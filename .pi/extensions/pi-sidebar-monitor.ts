/**
 * Pi Sidebar Monitor
 *
 * Panel de monitoreo para desarrolladores profesionales.
 *
 * Muestra:
 *   – Estado del agente / turno + tiempo activo
 *   – Git: rama, estado dirty/clean, archivos modificados
 *   – Modelo activo, provider, thinking level
 *   – Contexto: tokens usados / % del window
 *   – Skills cargados, hooks recientes
 *   – Estadísticas: archivos creados, líneas escritas, errores, costo acumulado
 *   – Stack detectado del proyecto (Node, Go, Rust, Python, etc.)
 *   – Nombre de sesión
 *
 * Uso:
 *   /monitor              Abre/cierra el panel lateral detallado
 *   /monitor auto         Activa/desactiva apertura automática al iniciar
 *
 * El panel es un overlay derecho. Se cierra con q/Esc.
 * Scroll: ↑↓ / PgUp / PgDn.
 *
 * Widget compacto debajo del editor con resumen en tiempo real.
 */

import type { AssistantMessage } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionContext, Theme } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType } from "@earendil-works/pi-coding-agent";
import { matchesKey, truncateToWidth, visibleWidth } from "@earendil-works/pi-tui";
import { existsSync } from "node:fs";
import { join } from "node:path";

/* ------------------------------------------------------------------ */
/*  Tipos y estado                                                    */
/* ------------------------------------------------------------------ */

interface GitInfo {
	branch: string | undefined;
	dirty: boolean;
	modifiedCount: number;
}

interface MonitorState {
	agentsActive: number;
	turnsActive: number;
	agentStartTime: number | undefined;
	currentSkills: string[];
	recentHooks: string[];
	filesCreated: number;
	linesWritten: number;
	toolErrors: number;
	cost: number;
	git: GitInfo;
	stack: string[];
	modelStr: string;
	thinkingLevel: string;
	contextPercent: number | null;
	contextWindow: number | null;
}

const state: MonitorState = {
	agentsActive: 0,
	turnsActive: 0,
	agentStartTime: undefined,
	currentSkills: [],
	recentHooks: [],
	filesCreated: 0,
	linesWritten: 0,
	toolErrors: 0,
	cost: 0,
	git: { branch: undefined, dirty: false, modifiedCount: 0 },
	stack: [],
	modelStr: "",
	thinkingLevel: "off",
	contextPercent: null,
	contextWindow: null,
};

let autoShow = true;
let panelInstance: MonitorPanel | undefined;
let requestRender: (() => void) | undefined;
let gitRefreshInterval: ReturnType<typeof setInterval> | undefined;

/* ------------------------------------------------------------------ */
/*  Panel lateral (overlay)                                           */
/* ------------------------------------------------------------------ */

class MonitorPanel {
	private theme: Theme;
	private done: () => void;
	private scrollOffset = 0;
	private cachedWidth?: number;
	private cachedLines?: string[];
	private currentState: MonitorState;

	constructor(theme: Theme, done: () => void, initial: MonitorState) {
		this.theme = theme;
		this.done = done;
		this.currentState = initial;
	}

	updateState(next: MonitorState) {
		this.currentState = next;
		this.invalidate();
	}

	handleInput(data: string): void {
		if (matchesKey(data, "escape") || matchesKey(data, "q")) {
			this.done();
			return;
		}
		if (matchesKey(data, "up")) {
			this.scrollOffset = Math.max(0, this.scrollOffset - 1);
			this.invalidate();
		} else if (matchesKey(data, "down")) {
			this.scrollOffset++;
			this.invalidate();
		} else if (matchesKey(data, "pageup")) {
			this.scrollOffset = Math.max(0, this.scrollOffset - 8);
			this.invalidate();
		} else if (matchesKey(data, "pagedown")) {
			this.scrollOffset += 8;
			this.invalidate();
		}
	}

	private invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}

	private buildContent(width: number): string[] {
		const th = this.theme;
		const lines: string[] = [];
		const st = this.currentState;
		const pad4 = 4;

		const push = (text: string) => lines.push(truncateToWidth(text, width));

		/* ═════ HEADER ═════ */
		push(th.fg("accent", th.bold(" 📊 Pi Monitor ")));
		push(th.fg("border", "─".repeat(Math.max(0, width))));

		/* ═════ ESTADO ═════ */
		const working = st.agentsActive > 0 || st.turnsActive > 0;
		push(
			th.fg("text", "Estado: ") +
				(working ? th.fg("success", "● Trabajando") : th.fg("dim", "○ Inactivo"))
		);

		if (st.agentStartTime) {
			const elapsed = Math.round((Date.now() - st.agentStartTime) / 1000);
			const min = Math.floor(elapsed / 60);
			const sec = elapsed % 60;
			push(th.fg("dim", `  Tiempo: ${min}m ${sec}s`));
		}
		push(th.fg("dim", `  Turnos: ${st.turnsActive}`));
		push("");

		/* ═════ MODELO ═════ */
		push(th.fg("accent", th.bold("Modelo")));
		push(`  ${th.fg("text", st.modelStr || "—")}`);
		push(`  ${th.fg("dim", "thinking:")} ${th.fg("text", st.thinkingLevel)}`);
		push("");

		/* ═════ CONTEXTO ═════ */
		push(th.fg("accent", th.bold("Contexto")));
		if (st.contextPercent !== null && st.contextWindow !== null) {
			const color = st.contextPercent > 80 ? "error" : st.contextPercent > 50 ? "warning" : "success";
			push(`  ${th.fg(color, `${st.contextPercent}%`)} ${th.fg("dim", `/ ${(st.contextWindow / 1000).toFixed(0)}k tokens`)}`);
		} else {
			push("  " + th.fg("dim", "—"));
		}
		push("");

		/* ═════ GIT ═════ */
		push(th.fg("accent", th.bold("Git")));
		const branch = st.git.branch ?? "no git";
		const dirtyIcon = st.git.dirty ? th.fg("warning", "✗") : th.fg("success", "✓");
		push(`  ${dirtyIcon} ${th.fg("text", branch)}`);
		if (st.git.dirty) {
			push(th.fg("warning", `  ${st.git.modifiedCount} archivos modificados`));
		}
		push("");

		/* ═════ STACK ═════ */
		if (st.stack.length > 0) {
			push(th.fg("accent", th.bold("Stack")));
			push("  " + st.stack.map((s) => th.fg("text", s)).join("  "));
			push("");
		}

		/* ═════ SKILLS ═════ */
		push(th.fg("accent", th.bold("Skills")));
		if (st.currentSkills.length === 0) {
			push("  " + th.fg("dim", "—"));
		} else {
			for (const skill of st.currentSkills.slice(0, 8)) {
				push("  " + th.fg("accent", "•") + " " + truncateToWidth(skill, Math.max(0, width - pad4)));
			}
		}
		push("");

		/* ═════ HOOKS ═════ */
		push(th.fg("accent", th.bold("Hooks")));
		const uniqueHooks = [...new Set(st.recentHooks)].slice(-12);
		if (uniqueHooks.length === 0) {
			push("  " + th.fg("dim", "—"));
		} else {
			for (const hook of uniqueHooks) {
				const color = hook.startsWith("tool_call:")
					? "warning"
					: hook.startsWith("tool_result:")
						? "success"
						: "text";
				push("  " + th.fg(color, "•") + " " + truncateToWidth(hook, Math.max(0, width - pad4)));
			}
		}
		push("");

		/* ═════ ESTADÍSTICAS ═════ */
		push(th.fg("accent", th.bold("Estadísticas")));
		push(`  ${th.fg("success", "📝")} Archivos: ${st.filesCreated}`);
		push(`  ${th.fg("success", "📏")} Líneas:   ${st.linesWritten}`);
		if (st.toolErrors > 0) {
			push(`  ${th.fg("error", "✗")} Errores:  ${st.toolErrors}`);
		}
		push(`  ${th.fg("muted", "💰")} Costo:    $${st.cost.toFixed(4)}`);
		push("");

		/* ═════ FOOTER ═════ */
		push(th.fg("dim", "↑↓ scroll  PgUp/PgDn  q/Esc cerrar"));

		return lines;
	}

	render(width: number): string[] {
		if (this.cachedLines && this.cachedWidth === width) {
			return this.applyScroll(this.cachedLines, width);
		}
		const lines = this.buildContent(width);
		this.cachedWidth = width;
		this.cachedLines = lines;
		return this.applyScroll(lines, width);
	}

	private applyScroll(lines: string[], width: number): string[] {
		const visibleHeight = 26;
		const maxOffset = Math.max(0, lines.length - visibleHeight);
		this.scrollOffset = Math.min(this.scrollOffset, maxOffset);
		const visible = lines.slice(this.scrollOffset, this.scrollOffset + visibleHeight);
		return visible.map((line) => {
			const pad = " ".repeat(Math.max(0, width - visibleWidth(line)));
			return truncateToWidth(line + pad, width);
		});
	}

	invalidate(): void {
		this.cachedWidth = undefined;
		this.cachedLines = undefined;
	}
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function refreshPanel() {
	if (panelInstance) {
		panelInstance.updateState({ ...state });
	}
	requestRender?.();
}

function addHook(name: string) {
	state.recentHooks.push(name);
	if (state.recentHooks.length > 40) {
		state.recentHooks.shift();
	}
}

/** Extrae datos dinámicos de ctx (modelo, tokens, thinking) */
function updateDynamicState(ctx: ExtensionContext) {
	const model = ctx.model;
	state.modelStr = model ? `${model.provider}/${model.id}` : "no model";
	state.thinkingLevel = piRef.getThinkingLevel() ?? "off";

	const usage = ctx.getContextUsage();
	if (usage && usage.percent !== null) {
		state.contextPercent = Math.round(usage.percent);
		state.contextWindow = usage.contextWindow ?? ctx.model?.contextWindow ?? null;
	} else {
		state.contextPercent = null;
		state.contextWindow = ctx.model?.contextWindow ?? null;
	}
}

/** Detecta stack tecnológico del proyecto */
function detectStack(cwd: string): string[] {
	const stacks: string[] = [];
	const markers: Record<string, string> = {
		"package.json": "Node",
		"go.mod": "Go",
		"Cargo.toml": "Rust",
		"pyproject.toml": "Python",
		"setup.py": "Python",
		"requirements.txt": "Python",
		"Pipfile": "Python",
		"Gemfile": "Ruby",
		"composer.json": "PHP",
		"pom.xml": "Java",
		"build.gradle": "Java",
		"CMakeLists.txt": "C++",
		"Makefile": "C",
		"Dockerfile": "Docker",
		"docker-compose.yml": "Docker",
		"deno.json": "Deno",
		"bun.lockb": "Bun",
		"tsconfig.json": "TS",
	};
	for (const [file, label] of Object.entries(markers)) {
		if (existsSync(join(cwd, file))) stacks.push(label);
	}
	return [...new Set(stacks)];
}

/** Actualiza datos de git en background */
async function refreshGit(cwd: string) {
	try {
		const branchResult = await piRef.exec("git", ["branch", "--show-current"], {
			cwd,
			timeout: 2000,
		});
		const branch = branchResult.stdout?.trim() || undefined;

		const statusResult = await piRef.exec("git", ["status", "--porcelain"], {
			cwd,
			timeout: 2000,
		});
		const modified = statusResult.stdout
			? statusResult.stdout.trim().split("\n").filter((l) => l.length > 0)
			: [];

		state.git = {
			branch,
			dirty: modified.length > 0,
			modifiedCount: modified.length,
		};
	} catch {
		state.git = { branch: undefined, dirty: false, modifiedCount: 0 };
	}
	refreshPanel();
}

/** Actualiza costo acumulado desde la sesión */
function refreshCost(ctx: ExtensionContext) {
	let cost = 0;
	for (const e of ctx.sessionManager.getBranch()) {
		if (e.type === "message" && e.message.role === "assistant") {
			const m = e.message as AssistantMessage;
			cost += m.usage?.cost?.total ?? 0;
		}
	}
	state.cost = cost;
}

/** Devuelve líneas del widget compacto */
function getWidgetLines(theme: Theme, ctx: ExtensionContext): string[] | undefined {
	const st = state;
	const parts: string[] = [];

	if (st.git.branch) {
		const icon = st.git.dirty ? theme.fg("warning", "✗") : theme.fg("success", "✓");
		parts.push(`${icon} ${st.git.branch}`);
	}
	if (ctx.model) {
		parts.push(`${ctx.model.provider}/${ctx.model.id}`);
	}
	if (st.agentsActive > 0) {
		parts.push(`Turnos: ${st.turnsActive}`);
	}
	if (st.filesCreated > 0) {
		parts.push(`Archivos: ${st.filesCreated}`);
	}
	if (st.linesWritten > 0) {
		parts.push(`Líneas: ${st.linesWritten}`);
	}
	if (st.toolErrors > 0) {
		parts.push(theme.fg("error", `Errores: ${st.toolErrors}`));
	}
	if (st.stack.length > 0) {
		parts.push(`[${st.stack.join(", ")}]`);
	}

	if (parts.length === 0) return undefined;

	const usage = ctx.getContextUsage();
	const ctxText = usage && usage.percent !== null
		? `ctx ${Math.round(usage.percent)}%`
		: "";
	if (ctxText) parts.push(ctxText);

	return [theme.fg("dim", `📊 ${parts.join("  ·  ")}  (/monitor)`)];
}

/* ------------------------------------------------------------------ */
/*  Referencia global a pi                                            */
/* ------------------------------------------------------------------ */
let piRef: ExtensionAPI;

/* ------------------------------------------------------------------ */
/*  Factory                                                           */
/* ------------------------------------------------------------------ */

export default function (pi: ExtensionAPI) {
	piRef = pi;

	/* ---- Agentes / turnos ---- */
	pi.on("agent_start", (_event, ctx) => {
		state.agentsActive++;
		state.agentStartTime = Date.now();
		updateDynamicState(ctx);
		addHook("agent_start");
		refreshPanel();
	});

	pi.on("agent_end", (_event, ctx) => {
		state.agentsActive = Math.max(0, state.agentsActive - 1);
		state.agentStartTime = undefined;
		updateDynamicState(ctx);
		addHook("agent_end");
		refreshPanel();
	});

	pi.on("turn_start", (_event, ctx) => {
		state.turnsActive++;
		updateDynamicState(ctx);
		addHook("turn_start");
		refreshPanel();
	});

	pi.on("turn_end", (_event, ctx) => {
		state.turnsActive = Math.max(0, state.turnsActive - 1);
		updateDynamicState(ctx);
		refreshCost(ctx);
		addHook("turn_end");
		refreshPanel();
	});

	/* ---- Skills ---- */
	pi.on("before_agent_start", (event, ctx) => {
		updateDynamicState(ctx);
		const skills = event.systemPromptOptions?.skills ?? [];
		state.currentSkills = skills
			.map((s: any) => s.name ?? s.location ?? "skill")
			.filter(Boolean);
		refreshPanel();
	});

	/* ---- Tool execution ---- */
	pi.on("tool_execution_start", (_event, ctx) => {
		updateDynamicState(ctx);
		addHook("exec_start");
		refreshPanel();
	});

	pi.on("tool_execution_end", (_event, ctx) => {
		updateDynamicState(ctx);
		addHook("exec_end");
		refreshPanel();
	});

	/* ---- Tool calls (líneas escritas) ---- */
	pi.on("tool_call", (event, ctx) => {
		updateDynamicState(ctx);
		addHook(`tool_call:${event.toolName}`);

		if (isToolCallEventType("write", event)) {
			const content = event.input.content ?? "";
			state.linesWritten += content.split("\n").length;
		}
		if (isToolCallEventType("edit", event)) {
			for (const edit of event.input.edits ?? []) {
				state.linesWritten += (edit.newText ?? "").split("\n").length;
			}
		}

		refreshPanel();
	});

	/* ---- Tool results (archivos + errores) ---- */
	pi.on("tool_result", (event, ctx) => {
		updateDynamicState(ctx);
		addHook(`tool_result:${event.toolName}`);

		if (event.toolName === "write" && !event.isError) {
			state.filesCreated++;
		}
		if (event.isError) {
			state.toolErrors++;
		}

		/* Refrescar git si una tool pudo haber modificado el repo */
		if (["write", "edit", "bash", "exec"].includes(event.toolName)) {
			void refreshGit(ctx.cwd);
		}

		refreshPanel();
	});

	/* ---- Mensajes ---- */
	pi.on("message_start", (_event, ctx) => {
		updateDynamicState(ctx);
		addHook("message_start");
		refreshPanel();
	});

	pi.on("message_end", (_event, ctx) => {
		updateDynamicState(ctx);
		addHook("message_end");
		refreshPanel();
	});

	/* ---- Abrir panel detallado ---- */
	const openPanel = (ctx: ExtensionContext) => {
		if (panelInstance) return;

		void ctx.ui.custom(
			(tui, theme, _kb, done) => {
				requestRender = () => tui.requestRender();
				panelInstance = new MonitorPanel(theme, () => {
					panelInstance = undefined;
					requestRender = undefined;
					done();
				},
				{ ...state });

				return panelInstance;
			},
			{
				overlay: true,
				overlayOptions: {
					width: 42,
					minWidth: 34,
					maxHeight: "85%",
					anchor: "right-center",
					margin: { top: 1, right: 1, bottom: 1, left: 0 },
					visible: (termWidth, _termHeight) => termWidth >= 100,
					nonCapturing: true,
				},
			}
		);
	};

	/* ---- Widget compacto ---- */
	const refreshWidget = (ctx: ExtensionContext) => {
		const lines = getWidgetLines(ctx.ui.theme, ctx);
		if (lines) {
			ctx.ui.setWidget("pi-monitor", lines, { placement: "belowEditor" });
		} else {
			ctx.ui.setWidget("pi-monitor", undefined);
		}
	};

	/* ---- Sesión ---- */
	pi.on("session_start", (_event, ctx) => {
		if (!ctx.hasUI) return;

		/* Reset por sesión */
		state.agentsActive = 0;
		state.turnsActive = 0;
		state.agentStartTime = undefined;
		state.filesCreated = 0;
		state.linesWritten = 0;
		state.toolErrors = 0;
		state.cost = 0;
		state.recentHooks = [];
		state.stack = detectStack(ctx.cwd);

		updateDynamicState(ctx);
		refreshCost(ctx);

		/* Git en background */
		void refreshGit(ctx.cwd);
		gitRefreshInterval = setInterval(() => {
			void refreshGit(ctx.cwd);
		}, 5000);

		/* Widget */
		refreshWidget(ctx);

		/* Auto-lanzar */
		if (autoShow) {
			openPanel(ctx);
		}
	});

	pi.on("session_shutdown", () => {
		panelInstance = undefined;
		requestRender = undefined;
		if (gitRefreshInterval) {
			clearInterval(gitRefreshInterval);
			gitRefreshInterval = undefined;
		}
	});

	/* ---- Comando /monitor ---- */
	pi.registerCommand("monitor", {
		description: "Toggle sidebar monitor. '/monitor auto' toggles auto-show.",
		handler: async (args, ctx) => {
			const arg = args.trim().toLowerCase();

			if (arg === "auto") {
				autoShow = !autoShow;
				ctx.ui.notify(`Monitor auto-show: ${autoShow ? "ON" : "OFF"}`, "info");
				return;
			}

			if (panelInstance) {
				ctx.ui.notify("Panel abierto. Usa q o Esc para cerrarlo.", "warning");
			} else {
				updateDynamicState(ctx);
				openPanel(ctx);
				ctx.ui.notify("Monitor panel abierto", "info");
			}
		},
	});
}

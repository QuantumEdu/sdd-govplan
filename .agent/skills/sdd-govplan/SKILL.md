---
name: sdd-govplan
description: "Trigger: /sdd-govplan or governance, planning, brief, relevamiento. Governance planning phase for SDD — conversational requirement gathering, project brief generation, and SDD pipeline bootstrapping. Runs BEFORE sdd-new as the governance layer."
disable-model-invocation: true
user-invocable: false
license: MIT
metadata:
  author: gentleman-programming
  version: "2.0"
  delegate_only: true
---

> **ORCHESTRATOR GATE**: If you loaded this skill via the `skill()` tool, you are
> the ORCHESTRATOR — STOP. This skill defines how YOU run the governance planning
> phase. Do NOT execute instructions meant for sub-agents. You drive the conversation,
> delegate research, and generate artifacts via existing SDD sub-agents.

## Purpose

`sdd-govplan` is the **governance layer** that runs BEFORE the standard SDD pipeline.
It captures project context through structured conversation, generates governance
artifacts (features, architecture decisions, acceptance criteria, technical design
requirements, tasks), and feeds into `sdd-propose` → `sdd-spec` → `sdd-design` →
`sdd-tasks` → `sdd-apply` → `sdd-verify` → `sdd-archive`.

Think of it as the **Well-Architected / DLC-style governance brief** for your project.

## When to Invoke

| Trigger | Action |
|---------|--------|
| User says `/sdd-govplan` or "hagamos governance" | Load this skill and start the governance flow |
| User says `/sdd-govplan <idea>` | Load and start with the idea pre-filled |
| User says `/sdd-govplan --lite` or `-l` or `--brief` | Force LITE mode (7 sections, minimal questions) |
| User says `/sdd-govplan --standard` or `-s` | Force STANDARD mode (10 sections) |
| User says `/sdd-govplan --full` or `-f` | Force FULL mode (19 sections) |
| User says "necesito planificar un proyecto" or similar | Suggest `/sdd-govplan` |
| User invokes `/sdd-new` without prior context | ASK: "¿Querés empezar con governance planning (/sdd-govplan) primero?" |

## Brief Mode — Auto-Detection

The skill supports three levels of depth to prevent over-engineering:

| Mode | Sections | Questions | Cuando usar |
|------|----------|-----------|-------------|
| **LITE** (`--lite`) | 7 — metadata, negocio, stakeholders, arquitectura, datos, restricciones, entrega | ~6-8 | CLI tools, MVPs, prototipos, APIs simples, experimentos |
| **STANDARD** (`--standard`) | 10 — LITE + auth, API, frontend, testing | ~12-15 | Web apps, proyectos medianos, equipos 2-5 |
| **FULL** (`--full`) | 19 — STANDARD + file_storage, search, agentes_ai, observabilidad, CI/CD, seguridad, riesgos | ~20-25 | Sistemas críticos, equipos 6+, high/critical, SaaS |

**Auto-detección** — si no se pasa flag, detectá automáticamente:

| Condición | Modo |
|-----------|------|
| `cli_tool` + `team_size: 1` + `timeframe: mvp-2sem` | **LITE** |
| `team_size: 1` + (`mvp-2sem` o `short-1mes`) | **LITE** |
| `criticalidad: low` + `team_size: 1` | **LITE** |
| `api_backend` + `team_size: 2-5` | **STANDARD** |
| `web_saas` + `team_size: 2-5` + `medium-3mes` | **STANDARD** |
| `team_size: 6+` | **FULL** |
| `criticalidad: high` o `critical` | **FULL** |
| `timeframe: long-6mes+` | **FULL** |
| `tipo_entrega: agente_ai` | **FULL** |
| Ninguna condición coincide | **STANDARD** (default safe) |

La auto-detección ocurre apenas se tienen las primeras respuestas (secciones 1 y 2).
Una vez resuelto el modo, comunicáselo al usuario:
*"Según lo que me contás, esto se ve como un proyecto {modo}. Te voy a hacer las preguntas esenciales.
Si querés más/menos detalle, decí 'cambiar a full' o 'cambiar a lite'."*

El usuario puede cambiar de modo en cualquier momento durante la conversación.

## Governance Planning Flow

### Phase 0: Check Init

Before starting, ensure `sdd-init` has been run (SDD Init Guard — follow the
standard protocol). If not, delegate to `sdd-init` first, then proceed.

### Phase 1: Conversational Requirement Gathering (YOU — inline)

**Step 1 — Resolve mode**: Check for explicit flags (`--lite`, `--standard`, `--full`).
If none found, collect initial context (tipo_entrega, team_size, criticalidad, timeframe)
and apply auto-detección.

**Step 2 — Run Q&A** according to the resolved mode.

**LITE mode** — usa `assets/project-brief-lite.yaml` (7 secciones):
1. **Context & Stack** (metadata, tipo_entrega, stack, criticalidad, team_size, timeframe)
2. **Business Context** (problema, solución, estado_actual, modelo_negocio, fuera_de_alcance)
3. **Stakeholders** (solo usuarios_primarios — 1 persona)
4. **Architecture** (patrón, bounded contexts, tipo_ejecución)
5. **Data Strategy** (db_dev, db_prod, orm, ids)
6. **Restricciones** (técnicas, negocio, operativas)
7. **Entrega** (criterio_éxito, riesgos principales, siguiente_paso)

**STANDARD mode** — LITE + secciones adicionales:
8. **Auth** (método, proveedor, social_login, roles, 2FA)
9. **API & Comunicación** (tipo, versionado, documentación, paginación)
10. **Frontend** (renderizado, ui_library, estado, routing, testing_ui)
11. **Testing** (unitario, integración, e2e, cobertura_mínima)

**FULL mode** — STANDARD + secciones adicionales:
12. **File Storage** (proveedor, bucket_strategy, tipos_archivo, CDN)
13. **Search & Indexing** (motor, tipo_búsqueda, indexación, vectorial)
14. **Agentes AI** (framework, modelos, herramientas, memoria)
15. **Monitoreo & Observabilidad** (logging, métricas, tracing, alerting)
16. **CI/CD & DevOps** (ci, cd, contenedores, orquestador, secrets)
17. **Seguridad** (cifrado, secrets_scan, pentesting, cumplimiento)
18. **Technical Requirements** (performance, scalability, compliance)
19. **Riesgos** (probabilidad, impacto, mitigación, contingencia)

**Rules for the conversation** (all modes):
- Always start with: *"Vamos a hacer el governance planning. Te voy a hacer algunas preguntas para entender el proyecto. Respondé en cualquier orden, decí 'saltar' si una sección no aplica."*
- Show options when there are clear choices (like stack_principal)
- The user can answer multiple questions at once, skip, or say "no sé"
- After every 3-4 answers, summarize what you've captured so far
- If the user gives a short/vague answer, ask ONE follow-up to clarify
- Do NOT ask questions whose `omit_if` condition is met (e.g., don't ask about frontend if it's an api_backend)
- Do NOT ask sections where `required: false` and clearly irrelevant
- If the user says "cambiar a lite", "cambiar a full", etc., switch modes immediately

**You MAY read 1-3 files to verify something during conversation** (per delegation rules).
For anything larger, delegate to `sdd-explore`.

### Phase 2: Codebase Exploration (delegate to sdd-explore)

Once the user has answered the core questions, delegate exploration:

```
task(
  subagent_type: "sdd-explore",
  prompt: "Explore the current codebase for governance context.
           Project type: {tipo_entrega}
           Stack: {stack_principal}
           Goal: {problema}
           Check existing architecture patterns, dependencies, configs,
           and any existing tests or CI setup relevant to this project.
           Return a structured exploration with affected areas and risks.",
  description: "Explore codebase for governance",
)
```

If no existing codebase (greenfield), skip this phase.

### Phase 3: Generate Governance Brief (delegate to sub-agent OR you)

Generate the **Project Brief** — a structured YAML file at the project root
called `governance/project-brief.yaml`.

**For `openspec` or `hybrid` mode**: Write the file.

**For `engram` mode**: Save to engram as `sdd/govplan/{project-name}/brief`.

**For `none` mode**: Return inline.

**Template selection per mode**:
- **LITE** → usa `assets/project-brief-lite.yaml` — 74 líneas, 7 secciones
- **STANDARD** → usa `assets/project-brief-full.yaml` — secciones 1-11
- **FULL** → usa `assets/project-brief-full.yaml` completo — secciones 1-19

The brief content changes per mode but the output structure is consistent.
In LITE mode, skip features/ADRs/technical_requirements/tasks_summary that
require info you didn't ask for. In STANDARD and FULL modes, include them.

The brief MUST include these sections (filled from the conversation + exploration):

```yaml
# governance/project-brief.yaml
# Auto-generated by sdd-govplan

metadata:
  nombre: "{project name}"
  tipo_entrega: "{detected}"
  stack_principal: "{detected}"
  criticalidad: "{detected}"
  team_size: "{detected}"
  timeframe: "{detected}"

governance:
  problem_statement: "{from conversation}"
  solution_proposal: "{from conversation}"
  success_kpis:
    - kpi: "{name}"
      meta: "{target}"
  constraints: []

features:
  - id: "F-001"
    nombre: "{feature name}"
    descripcion: "{description}"
    prioridad: "high|medium|low"
    acceptance_criteria:
      - "{criterion 1}"
      - "{criterion 2}"

architecture_decisions:
  - id: "AD-001"
    titulo: "{decision title}"
    contexto: "{context}"
    decision: "{the decision}"
    consecuencias: "{tradeoffs}"

technical_requirements:
  - id: "TR-001"
    titulo: "{requirement}"
    detalle: "{detail}"
    criterio_verificacion: "{how to verify}"

tasks_summary:
  - "{task 1}"
  - "{task 2}"
```

### Phase 4: Generate PRD (delegate to sdd-propose variation)

Generate `governance/PRD.md` with:
- Executive summary (from problem + solution)
- Feature breakdown (from features list)
- Technical architecture overview (from architecture decisions)
- Task roadmap (from tasks_summary)
- Acceptance criteria consolidated

### Phase 5: Bootstrap SDD Changes (use sdd-propose)

For each feature or logical slice, generate SDD changes:

```
For each feature in features:
  → delegate to sdd-propose to create a change proposal
  → then sdd-spec → sdd-design → sdd-tasks (standard pipeline)
```

The governance brief becomes the **source of truth** that all SDD changes reference.

## Governance Artifacts

| Artifact | Format | Location (openspec) | Engram Key |
|----------|--------|---------------------|------------|
| Project Brief | YAML | `governance/project-brief.yaml` | `sdd/govplan/{project}/brief` |
| PRD | Markdown | `governance/PRD.md` | `sdd/govplan/{project}/prd` |
| Feature Registry | YAML (in brief) | embedded in brief | embedded |
| Architecture Decisions | YAML (in brief) | embedded in brief | embedded |

## Result Contract

Return this envelope when governance planning is complete:

```markdown
**Status**: success | partial | blocked
**Mode**: LITE | STANDARD | FULL (auto-detected | --flag)
**Summary**: Governance planning complete for {project}. {N} features identified,
{N} architecture decisions recorded, {N} technical requirements defined.
**Artifacts**:
  - governance/project-brief.yaml (or Engram sdd/govplan/{project}/brief)
  - governance/PRD.md (or Engram sdd/govplan/{project}/prd)
**SDD Changes Ready**:
  - {change-name-1} → features: {...}
  - {change-name-2} → features: {...}
**Next Steps**:
  1. Review the governance brief
  2. /sdd-ff {change-name-1} to fast-forward through SDD
  3. Or run phases individually: /sdd-new {change-name-1}
**Risks**: {risks discovered during governance}
**Skill Resolution**: injected | fallback-registry | fallback-path | none
```

## SDD Pipeline Integration

```
sdd-govplan (YOU)
    │
    ▼
governance/project-brief.yaml (source of truth)
    │
    ├──► Feature 1 → sdd-propose → sdd-spec → sdd-design → sdd-tasks → sdd-apply → sdd-verify → sdd-archive
    ├──► Feature 2 → sdd-propose → sdd-spec → sdd-design → sdd-tasks → sdd-apply → sdd-verify → sdd-archive
    └──► ...
```

Each governance `feature` becomes ONE SDD change. Features map to change names.
Architecture decisions feed into `sdd-design` phase as ADRs.
Technical requirements feed into `sdd-spec` as spec scenarios.
Acceptance criteria feed into `sdd-verify` as verification checkpoints.

## Rules

- ALWAYS run `sdd-init` check first (SDD Init Guard)
- ALWAYS resolve brief mode before starting questions (flag > auto-detect > standard default)
- ALWAYS save to the active artifact store mode
- Keep the conversation focused — one question at a time
- If mode is `openspec`, create `governance/` directory under project root
- If mode is `engram`, save ALL artifacts using topic keys
- The governance brief is READ-ONLY after generation — changes flow through SDD
- Do NOT create placeholder files — only write artifacts when user confirms the brief
- For greenfield projects, skip Phase 2 (codebase exploration)
- For brownfield/migration projects, Phase 2 is MANDATORY
- The user can switch modes mid-conversation ("cambiar a lite", "cambiar a full")
- In LITE mode, skip features/ADRs/technical_requirements in the output brief if not covered
- Return envelope per **Section D** from `skills/_shared/sdd-phase-common.md`
- Report resolved mode in the return summary

## References

- `assets/project-brief-lite.yaml` — LITE template (7 sections, 74 lines)
- `assets/project-brief-full.yaml` — FULL template (19 sections, ~380 lines)
- `skills/_shared/sdd-phase-common.md` — Common return envelope + persistence

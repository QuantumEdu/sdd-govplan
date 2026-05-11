import { type ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";

export default function (pi: ExtensionAPI) {
  let currentProgress = 0;
  let currentTask = "Not started";
  let isActive = false;

  function renderProgressBar(theme: any, width: number): string[] {
    const barWidth = 40;
    // Clamp progress between 0 and 100
    const progress = Math.max(0, Math.min(100, currentProgress));
    const filled = Math.round((progress / 100) * barWidth);
    const empty = barWidth - filled;
    
    const bar = "█".repeat(filled) + "░".repeat(empty);
    
    // Use theme colors for styling
    const title = theme.fg("accent", theme.bold(" 🚀 Progress: "));
    const barStyled = progress === 100 
      ? theme.fg("success", bar) 
      : theme.fg("accent", bar);
    const percent = theme.fg("dim", ` ${progress}% `);
    const taskStyled = theme.fg("muted", `- ${currentTask}`);

    const line = `${title}[${barStyled}]${percent}${taskStyled}`;
    return [truncateToWidth(line, width)];
  }

  function updateWidget(ctx: any) {
    if (isActive) {
      // Set the widget above the editor
      ctx.ui.setWidget("progress-bar", (_tui: any, theme: any) => {
        return {
          render: (width: number) => renderProgressBar(theme, width),
          invalidate: () => {}
        };
      }, { placement: "aboveEditor" });
    } else {
      // Remove the widget
      ctx.ui.setWidget("progress-bar", undefined);
    }
  }

  // Register the /progress command to allow users to update the bar
  pi.registerCommand("progress", {
    description: "Manage project or agent progress bar",
    usage: "<start|stop|set> [percentage] [task description...]",
    handler: async (args, ctx) => {
      const parts = args.trim().split(" ");
      const action = parts[0]?.toLowerCase();

      if (action === "start") {
        isActive = true;
        currentProgress = 0;
        currentTask = parts.slice(1).join(" ") || "Initializing...";
        updateWidget(ctx);
        ctx.ui.notify("Progress bar activated", "success");
      } else if (action === "stop") {
        isActive = false;
        updateWidget(ctx);
        ctx.ui.notify("Progress bar deactivated", "info");
      } else if (action === "set") {
        isActive = true;
        const pctStr = parts[1];
        const pct = parseInt(pctStr, 10);
        
        if (isNaN(pct) || pct < 0 || pct > 100) {
          ctx.ui.notify("Please provide a valid percentage between 0 and 100. Example: /progress set 50 Doing work", "error");
          return;
        }
        
        currentProgress = pct;
        const task = parts.slice(2).join(" ");
        if (task) {
          currentTask = task;
        }
        
        updateWidget(ctx);
      } else {
        ctx.ui.notify("Usage: /progress <start|stop|set> [percentage] [task]", "warning");
      }
    }
  });

  // Register a tool so agents can update the progress bar themselves
  pi.registerTool("set_progress", {
    description: "Set the current progress of the project or agent task.",
    parameters: {
      type: "object",
      properties: {
        percentage: {
          type: "number",
          description: "Progress percentage between 0 and 100"
        },
        task: {
          type: "string",
          description: "Short description of the current task"
        }
      },
      required: ["percentage", "task"]
    },
    execute: async (_callId, args, _onUpdate, ctx) => {
      isActive = true;
      currentProgress = Math.max(0, Math.min(100, args.percentage as number));
      currentTask = args.task as string;
      updateWidget(ctx);
      return { content: `Progress set to ${currentProgress}%: ${currentTask}` };
    }
  });

  // Automatically show it if it was active when session starts
  pi.on("session_start", (_event, ctx) => {
    if (isActive) {
      updateWidget(ctx);
    }
  });
}

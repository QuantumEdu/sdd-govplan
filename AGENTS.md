# AGENTS.md

## Purpose

This repository is the master source of the governance and workflow layer that complements `gentle-ai`.

## Read Order

1. `README.md`
2. `governance/00-start-here.md`
3. `governance/04-workflow-map.md`
4. `governance/05-quick-start-by-scenario.md`
5. `docs/system-boundaries.md`

## Operating Model

- `gentle-ai` = runtime/orchestrator
- `sdd-govplan` = master governance source
- `agent-core-v3` = global/installable distribution target
- local `/ai` = project-specific overlay

## Non-Negotiables

- Do not replace `gentle-ai` runtime behavior from this repo.
- Keep reusable assets generic when they are meant for export to `agent-core-v3`.
- Keep local/project-specific state out of this master repo.
- Use `PROJECT-BRIEF-LITE` for small/exploratory work and `PROJECT-BRIEF-FULL` for serious or complex work.

## Routing Rule

- Structural view by change type → `governance/04-workflow-map.md`
- Practical “what do I use now?” view → `governance/05-quick-start-by-scenario.md`

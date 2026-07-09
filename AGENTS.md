# AGENTS.md

## Purpose

This repository packages `/ai` plus `AGENTS.md` as a portable governance overlay for projects using **gentle-ai** (or compatible AI tools).

## Quick start

```bash
npx -p git+https://github.com/QuantumEdu/sdd-govplan.git sdd-govplan init
```

## Read Order

1. `ai/README.md`
2. `ai/governance/00-start-here.md`
3. `ai/governance/04-workflow-map.md`
4. `ai/governance/05-quick-start-by-scenario.md`

## Naming Convention

All skills use the prefix `sdd-govp:` (inspired by `ospx:` from OpenSpec).

```
sdd-govp:brief-inception → sdd-govp:brief-to-prd → sdd-govp:prd-to-spec → sdd-govp:spec-to-tasks
```

## Operating Model

- **gentle-ai**: orchestration, memory, SDD, delegation.
- **this package**: installable overlay (`sdd-govplan`) that copies `/ai` and `AGENTS.md` into a target project.
- **/ai/governance**: intake, decision gates, project brief guidance.
- **/ai/skills**: portable reusable behaviors.
- **/ai/agents**: optional specialized agents.

## Non-Negotiables

- Do not modify the AI tool's core behavior from this repository.
- Prefer `/ai/*` over reviving legacy assets.
- Treat the project brief as the entry gate before architecture or implementation.
- When unsure whether something is still used, archive it outside the active flow instead of deleting.

## Routing Rule

- Structural view by change type → `ai/governance/04-workflow-map.md`
- Practical "what do I use now?" view → `ai/governance/05-quick-start-by-scenario.md`

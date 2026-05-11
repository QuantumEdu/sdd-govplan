# sdd-govplan

**Governance Planning for Spec-Driven Development**

`sdd-govplan` is a Gentle AI skill that adds a **governance layer** to the SDD pipeline. It runs BEFORE the standard phases (propose → spec → design → tasks → apply → verify → archive) and captures project context through structured conversation, then generates governance artifacts.

Inspired by AWS Well-Architected / DLC governance frameworks and Kiro CLI's `/plan` flow.

## How It Works

```
/sdd-govplan "Quiero construir una API de facturación"
    │
    ├── Phase 1: Structured Q&A (orchestrator asks one question at a time)
    │   • Stack & Context → Business Problem → Stakeholders
    │   → Architecture → Data Strategy → Security → etc.
    │
    ├── Phase 2: Codebase Exploration (delegates to sdd-explore)
    │   • Only for brownfield/migration projects
    │
    ├── Phase 3: Generate Governance Artifacts
    │   • project-brief.yaml — 35-section structured brief
    │   • PRD.md — Product Requirements Document
    │   • Feature Registry — with acceptance criteria
    │   • Architecture Decision Records
    │
    └── Phase 4: Bootstrap SDD Changes
        • Each feature → one SDD change (sdd-propose → sdd-spec → ...)
        • Architecture decisions → feed sdd-design
        • Acceptance criteria → feed sdd-verify
```

## Files

| File | Description |
|------|-------------|
| `SKILL.md` | Main skill file — orchestrator instructions for governance planning |
| `assets/project-brief-template.yaml` | 35-section template covering all project aspects |
| `govplan.html` | Interactive reference page with FAQ and architecture |

## Pipeline Integration

```
sdd-init → sdd-govplan → sdd-propose → sdd-spec → sdd-design → sdd-tasks → sdd-apply → sdd-verify → sdd-archive
```

`sdd-govplan` sits between `sdd-init` (infrastructure setup) and the standard SDD pipeline (propose → archive). The SDD Init Guard automatically runs `sdd-init` if needed — you just type `/sdd-govplan`.

## Installation

This skill is installed in the Gentle AI skill directories:

- `~/.config/opencode/skills/sdd-govplan/`
- `~/.agents/skills/sdd-govplan/`

It's registered in `AGENTS.md` and the orchestrator prompt is updated in `opencode.json`.

## Usage

```
/sdd-govplan                              # Start interactive governance
/sdd-govplan Quiero construir un CRM      # Start with pre-filled idea
```

The orchestrator will:
1. Check `sdd-init` status (runs it silently if needed)
2. Ask structured questions (one at a time)
3. Explore the codebase if it exists
4. Generate the governance brief
5. Propose SDD changes for each feature

## Artifact Store Support

| Mode | Storage |
|------|---------|
| `engram` | Persistent memory (`sdd/govplan/{project}/brief`) |
| `openspec` | File-based (`governance/project-brief.yaml`) |
| `hybrid` | Both |
| `none` | Inline only |

## License

MIT — see [Gentle AI](https://github.com/gentleman-programming/gentle-ai)

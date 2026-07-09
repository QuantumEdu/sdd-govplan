# sdd-govplan

Repositorio maestro de la capa de **governance, skills, templates y flujo** para proyectos asistidos por IA sobre `gentle-ai`.

---

## Instalación

Actualmente desde GitHub (el paquete npm está próximo a publicarse):

```bash
npx -p git+https://github.com/QuantumEdu/AgentCore.git agentcore-overlay init
```

O clonando y ejecutando local:

```bash
git clone https://github.com/QuantumEdu/AgentCore.git
node AgentCore/bin/agentcore-overlay.js init .
```

O si ya tenés este repo clonado, copiá skills y governance directo:

```bash
cp -r skills/ governance/ templates/ tu-proyecto/
cp AGENTS.md tu-proyecto/
```

> Próximamente: `npx agentcore-overlay init` (cuando el paquete esté en npm).

---

## Qué es sdd-govplan

Es la **fuente maestra** de governance y skills para gentle-ai. Centraliza:

- **Governance**: puertas de entrada, workflow map, quick-start por escenario
- **Skills**: 16 capacidades operativas reutilizables (brief, PRD, spec, tasks, review, migration, etc.)
- **Templates**: briefs, ADRs, specs, roadmaps, retrospectivas
- **AGENTS.md**: entrypoint operativo del proyecto

No reemplaza a `gentle-ai`. gentle-ai orquesta; sdd-govplan aporta la guía y estructura.

---

## Flujo canónico

```
brief-inception → brief-to-prd → prd-to-spec → spec-to-tasks
```

Cada skill produce el input de la siguiente:

1. **brief-inception** → brief clasificado con huecos detectados y siguiente artefacto
2. **brief-to-prd** → PRD corto con decisiones iniciales y riesgos
3. **prd-to-spec** → spec verificable con escenarios y criterios de aceptación
4. **spec-to-tasks** → tareas ejecutables con dependencias y criterios de done

---

## Catálogo de Skills (16)

| Skill | Descripción |
|-------|-------------|
| `brief-inception` | Discovery inicial: clasifica el proyecto, detecta huecos, hace hasta 7 preguntas críticas y propone el siguiente artefacto |
| `brief-to-prd` | Convierte un brief canónico o parcial en un PRD corto, claro y profesional con decisiones y riesgos |
| `prd-to-spec` | Convierte un PRD en spec operativa y verificable con escenarios y criterios de aceptación |
| `spec-to-tasks` | Convierte una spec en tareas pequeñas, dependientes y ejecutables con orden y criterios de done |
| `change-review` | Revisa un cambio antes de integrarlo: riesgos de ruptura, drift de documentación, impactos operativos |
| `rule-migration` | Diseña migración segura de reglas en sistemas operativos: shadow mode, rollout gradual, rollback |
| `add-endpoint` | Guía la adición segura de un endpoint nuevo con contrato, validación, reglas y pruebas mínimas |
| `improvement-loop` | Captura errores repetidos, identifica causa raíz y propone regla/checklist/ajuste de flujo |
| `memory-fallback` | Memoria local basada en archivos cuando Engram no está disponible (decisions, pitfalls, working-memory) |
| `local-retrospective` | Retrospectiva ligera: qué funcionó, qué falló, qué se repitió, qué ajustar |
| `project-stack-decider` | Ayuda a decidir stack y forma de entrega con trade-offs, supuestos y alternativas descartadas |
| `prompt-improver` | Reestructura prompts con formato profesional, claro y reusable sin cambiar la intención |
| `coding-conventions` | Resume prácticas de arquitectura, API, seguridad y testing como base de implementación o revisión |
| `geek-tech-tone` | Ajusta respuestas a tono geek, técnico, profesional, proactivo y con pensamiento lateral |
| `workflow-builder` | Crea workflows custom para proyectos no-software (tesis, consultoría, coaching, investigación). Incluye 4 templates predefinidos |
| `sdd-govplan` | Skill original de governance: aplica el flujo completo del repositorio como skill invocable |

---

## Estructura del repositorio

```
├── AGENTS.md                ← Entrypoint operativo
├── governance/              ← Puertas de entrada y mapas de flujo
│   ├── 00-start-here.md     ←   Punto de entrada
│   ├── 02-decision-gates.md
│   ├── 03-aidlc-lite.md
│   ├── 04-workflow-map.md   ←   Vista estructural por tipo de cambio
│   └── 05-quick-start-by-scenario.md  ←  Entrada por caso real
├── templates/               ← Formatos para materializar outputs
│   ├── PROJECT-BRIEF-FULL.yaml
│   ├── PROJECT-BRIEF-LITE.yaml
│   ├── change-review-template.md
│   ├── decision-adr-template.md
│   ├── prompt-structures.md
│   ├── retrospective-template.md
│   ├── roadmap-template.md
│   ├── rule-migration-template.md
│   ├── spec-template.md
│   └── tasks-template.md
├── docs/                    ← Límites del sistema, planes maestros, mapas de publicación
├── reference/               ← Patterns y material de apoyo
│
├── brief-inception/         ← Skills (16)
├── brief-to-prd/
├── prd-to-spec/
├── spec-to-tasks/
├── change-review/
├── rule-migration/
├── add-endpoint/
├── improvement-loop/
├── memory-fallback/
├── local-retrospective/
├── project-stack-decider/
├── prompt-improver/
├── coding-conventions/
├── geek-tech-tone/
├── workflow-builder/        ← + 4 templates de proyecto (thesis, consulting, coaching)
│   └── assets/templates/
└── sdd-govplan/             ← Skill original de governance
```

---

## Casos de uso

### Proyecto nuevo con discovery

```
brief-inception → brief-to-prd → prd-to-spec → spec-to-tasks
```

### Cambio sensible en sistema existente

```
change-review
├── rule-migration (si reemplaza reglas en producción)
```

### Agregar endpoint

```
add-endpoint → change-review
```

### Error repetitivo

```
improvement-loop → local-retrospective
```

### Sin Engram (continuidad local)

```
memory-fallback
```
Archivos clave: `decisions.md`, `pitfalls.md`, `working-memory.md`

### Proyecto no-software (tesis, consultoría, coaching)

```
workflow-builder → elegir template → /workflow continue
```

---

## Templates disponibles (10)

| Template | Uso |
|----------|-----|
| `PROJECT-BRIEF-FULL.yaml` | Brief completo para proyectos serios o complejos |
| `PROJECT-BRIEF-LITE.yaml` | Brief corto para proyectos pequeños o exploratorios |
| `change-review-template.md` | Estructura para revisión de cambio |
| `decision-adr-template.md` | Formato ADR para decisiones arquitectónicas |
| `prompt-structures.md` | Estructuras de prompt reusables |
| `retrospective-template.md` | Guía para retrospectiva post-cambio |
| `roadmap-template.md` | Formato de roadmap |
| `rule-migration-template.md` | Plan de migración de reglas |
| `spec-template.md` | Template de spec operativa |
| `tasks-template.md` | Template de breakdown de tareas |

---

## Documentos clave

- `governance/00-start-here.md` — punto de entrada
- `governance/04-workflow-map.md` — mapa estructural por tipo de cambio
- `governance/05-quick-start-by-scenario.md` — guía operativa por escenario
- `docs/system-boundaries.md` — límites entre gentle-ai, agent-core-v3 y overlays locales
- `docs/master-plan.md` — plan maestro de evolución
- `docs/repo-publication-map.md` — mapa de publicación entre repos

---

## Licencia

MIT

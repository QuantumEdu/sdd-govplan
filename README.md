# sdd-govplan

Overlay portable de governance, skills, agentes y templates para proyectos asistidos por IA.

Un `npx sdd-govplan init` y tenés toda la estructura operativa dentro de tu proyecto, sin tocar el core del orquestador.

---

## Instalación

### Por proyecto (recomendado)

```bash
npm install --save-dev git+https://github.com/QuantumEdu/sdd-govplan.git
npx sdd-govplan init
```

### Global

```bash
npm install -g git+https://github.com/QuantumEdu/sdd-govplan.git
sdd-govplan init
```

### Sin instalar (npx directo)

```bash
npx -p git+https://github.com/QuantumEdu/sdd-govplan.git sdd-govplan init
```

### Actualizar overlay existente

```bash
npx -p git+https://github.com/QuantumEdu/sdd-govplan.git sdd-govplan init . --force
```

### Ver qué copiaría sin escribir

```bash
npx -p git+https://github.com/QuantumEdu/sdd-govplan.git sdd-govplan init sandbox --dry-run
```

### Seleccionar AI tool

Por defecto pregunta de forma interactiva. También se puede pasar con `--ai`:

```bash
sdd-govplan init --ai opencode
sdd-govplan init --ai claude-code
sdd-govplan init --ai codex
```

| AI tool | Scaffold destino |
|---------|-----------------|
| `gentle-ai` | `ai/` + `AGENTS.md` (raíz del proyecto) |
| `opencode` | `.opencode/skills/`, `.opencode/agents/`, etc. |
| `claude-code` | `.claude/ai/` + `.claude/AGENTS.md` |
| `codex` (Amazon Q) | `.codex/governance/`, `.codex/templates/`, etc. |

> Próximamente: `npx sdd-govplan init` (cuando el paquete esté publicado en npm).

**Qué copia**: `ai/` (completo) + `AGENTS.md`. No copia README.md, FAQ.md ni CHANGELOG.md porque son docs del repositorio fuente, no del overlay operativo.

---

## Qué es sdd-govplan

Es una **capa portable** que se instala dentro de cualquier proyecto para sumar:

- **Governance**: puertas de entrada, mapas de flujo, quick-start por escenario
- **Skills**: capacidades operativas reutilizables (17 skills + workflow-builder)
- **Agents**: especialistas simples que componen skills (4 agents)
- **Templates**: briefs, ADRs, specs, roadmaps, retrospectivas (10 templates)
- **Context**: memoria local, decisiones, pitfalls, system-layers
- **AGENTS.md**: entrypoint operativo del overlay dentro del proyecto

No reemplaza al AI tool que uses. sdd-govplan aporta la guía y estructura portable.

### Naming Convention

Todas las skills usan el prefijo `sdd-govp:` (como `ospx:` en OpenSpec).

```
sdd-govp:brief-inception → sdd-govp:brief-to-prd → sdd-govp:prd-to-spec → sdd-govp:spec-to-tasks
```

---

## Flujo canónico

```
sdd-govp:brief-inception → sdd-govp:brief-to-prd → sdd-govp:prd-to-spec → sdd-govp:spec-to-tasks
```

Cada skill produce el input de la siguiente:

1. **brief-inception** → brief clasificado con huecos detectados
2. **brief-to-prd** → PRD corto con decisiones y riesgos
3. **prd-to-spec** → spec verificable con escenarios y criterios de aceptación
4. **spec-to-tasks** → tareas ejecutables con dependencias y criterios de done

Después, según el escenario:

| Necesidad | Skill |
|-----------|-------|
| Revisar un cambio antes de integrar | `sdd-govp:change-review` |
| Migrar reglas sin romper producción | `sdd-govp:rule-migration-plan` |
| Agregar un endpoint nuevo | `sdd-govp:add-endpoint` |
| Error repetido o fricción recurrente | `sdd-govp:improvement-loop` |
| Continuidad sin Engram | `sdd-govp:project-memory-fallback` |
| Proyecto no-software (tesis, consultoría) | `sdd-govp:workflow-builder` |
| Retrospectiva post-cambio | `sdd-govp:local-retrospective` |
| Decidir stack técnico | `sdd-govp:project-stack-decider` |
| Mejorar prompts | `sdd-govp:prompt-improver` |
| Tono técnico/geek | `sdd-govp:geek-tech-tone` |
| Convenciones de código | `sdd-govp:coding-conventions` |

---

## Catálogo de Skills (17)

| Skill | Descripción |
|-------|-------------|
| `sdd-govp:add-endpoint` | Guía la adición segura de un endpoint nuevo: contrato, validación, reglas, pruebas y documentación mínima |
| `sdd-govp:brief-inception` | Usa PROJECT-BRIEF-FULL como motor de discovery inicial. Clasifica el proyecto, detecta huecos, hace hasta 7 preguntas críticas y propone el siguiente artefacto |
| `sdd-govp:brief-to-prd` | Convierte un brief canónico o parcial en un PRD corto, claro y profesional con decisiones iniciales y riesgos |
| `sdd-govp:change-review` | Revisa un cambio antes de integrarlo: riesgos de ruptura, drift de documentación, impactos operativos, huecos de validación |
| `sdd-govp:coding-conventions` | Resume prácticas de arquitectura, API, seguridad y testing como base de implementación o revisión |
| `sdd-govp:geek-tech-tone` | Ajusta respuestas a tono geek, técnico, profesional, proactivo y con pensamiento lateral |
| `sdd-govp:improvement-loop` | Captura errores repetidos, identifica causa raíz y propone regla/checklist/ajuste de flujo |
| `sdd-govp:local-retrospective` | Retrospectiva ligera: qué funcionó, qué falló, qué se repitió, qué ajustar |
| `sdd-govp:prd-to-spec` | Convierte un PRD en spec operativa y verificable con requisitos, escenarios y criterios de aceptación |
| `sdd-govp:project-memory-fallback` | Memoria local mínima basada en archivos cuando Engram no está disponible |
| `sdd-govp:project-stack-decider` | Ayuda a decidir stack y forma de entrega con trade-offs, supuestos y alternativas descartadas |
| `sdd-govp:prompt-improver` | Reestructura prompts con formato profesional, claro y reusable sin cambiar la intención original |
| `sdd-govp:rule-migration-plan` | Diseña migración segura de reglas en sistemas operativos: shadow mode, rollout gradual, rollback |
| `sdd-govp:spec-to-tasks` | Convierte una spec en tareas pequeñas, dependientes y ejecutables con orden y criterios de done |
| `sdd-govp:workflow-builder` | Crea workflows custom para cualquier tipo de proyecto no-software (tesis, consultoría, coaching, investigación). Incluye 4 templates predefinidos |
| `sdd-govp:sdd-govplan` | Skill original de governance del repositorio — invoca el pipeline completo como una skill |

---

## Agentes (4)

| Agente | Skill que compone | Rol |
|--------|-------------------|-----|
| `change-reviewer` | `sdd-govp:change-review`, `sdd-govp:coding-conventions` | Revisa cambios con foco en riesgo de ruptura, drift y safeguards faltantes |
| `endpoint-designer` | `sdd-govp:add-endpoint`, `sdd-govp:change-review`, `sdd-govp:coding-conventions` | Aterriza endpoints nuevos con contrato, validación, pruebas y compatibilidad |
| `migration-guardian` | `sdd-govp:rule-migration-plan`, `sdd-govp:change-review`, `sdd-govp:project-memory-fallback` | Planea migraciones seguras de reglas o flujos en sistemas operativos |
| `project-inception-architect` | Ninguna directa — agente de discovery | Toma una idea difusa y la convierte en arranque ordenado con preguntas, criterios y siguiente artefacto |

---

## Estructura completa

```
ai/
├── agents/                    ← Agentes simples por rol (4)
├── context/                   ← Memoria local y sistema estable
│   ├── decisions.md
│   ├── pitfalls.md
│   ├── working-memory.md
│   └── system-layers.md
├── governance/                ← Puertas de entrada y mapas de flujo
│   ├── 00-start-here.md
│   ├── 02-decision-gates.md
│   ├── 03-aidlc-lite.md
│   ├── 04-workflow-map.md
│   └── 05-quick-start-by-scenario.md
├── migration/                 ← Material de transición histórica
├── schemas/                   ← Validación estructural
├── skills/                    ← Capacidades operativas (17)
│   ├── add-endpoint/
│   ├── brief-inception/
│   ├── brief-to-prd/
│   ├── change-review/
│   ├── coding-conventions/
│   ├── geek-tech-tone/
│   ├── improvement-loop/
│   ├── local-retrospective/
│   ├── patterns/              ← Patrones de diseño (no skills)
│   ├── prd-to-spec/
│   ├── project-memory-fallback/
│   ├── project-stack-decider/
│   ├── prompt-improver/
│   ├── rule-migration-plan/
│   ├── sdd-govplan/           ← Skill original de governance
│   ├── spec-to-tasks/
│   └── workflow-builder/      ← + 4 templates de proyecto
└── templates/                 ← Formatos para outputs (10)
```

---

## Casos de uso

### Proyecto nuevo con discovery

```
sdd-govp:brief-inception → sdd-govp:brief-to-prd → sdd-govp:prd-to-spec → sdd-govp:spec-to-tasks
```

### Cambio sensible en sistema existente

`sdd-govp:change-review` → `sdd-govp:rule-migration-plan` (si reemplaza reglas)

### Agregar endpoint

`sdd-govp:add-endpoint` → `sdd-govp:change-review`

### Error repetitivo

`sdd-govp:improvement-loop` → `sdd-govp:local-retrospective`

### Sin Engram

`sdd-govp:project-memory-fallback` (decisions.md, pitfalls.md, working-memory.md)

### Proyecto no-software (tesis, consultoría, coaching)

```
sdd-govp:workflow-builder → elegir template → /workflow continue
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

## Desarrollo local

```bash
node bin/sdd-govplan.js --help
node bin/sdd-govplan.js init . --force --dry-run
```

---

## Licencia

MIT

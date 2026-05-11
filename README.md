# Gentle AI Meta-Skills

Colección de skills avanzadas para **Gentle AI** que extienden el pipeline de Spec-Driven Development (SDD) con capacidades de **governance planning** y **workflow builder** para proyectos de cualquier tipo.

---

## Skills incluidas

### 1. `sdd-govplan` — Governance Planning

**Para proyectos de SOFTWARE.** Capa de gobernabilidad que captura contexto del proyecto, features, decisiones de arquitectura, criterios de aceptación y requisitos técnicos ANTES del pipeline SDD estándar.

Inspirado en AWS Well-Architected / DLC y el flujo `/plan` de Kiro CLI.

```
/sdd-govplan --lite               # Modo breve (CLI, MVPs, protos)
/sdd-govplan --standard           # Modo estándar (web apps, equipos 2-5)
/sdd-govplan --full               # Modo completo (sistemas críticos)
/sdd-govplan "API de facturación" # Con idea pre-cargada
```

**Auto-detección**: según `tipo_entrega`, `team_size`, `criticalidad`, `timeframe` resuelve automáticamente LITE / STANDARD / FULL.

**Pipeline**:
```
sdd-init → sdd-govplan → sdd-propose → sdd-spec → sdd-design → sdd-tasks → sdd-apply → sdd-verify → sdd-archive
```

**Archivos**:
| Ruta | Descripción |
|------|-------------|
| `sdd-govplan/SKILL.md` | Instrucciones del orchestrator |
| `sdd-govplan/assets/project-brief-lite.yaml` | Template LITE (7 secciones) |
| `sdd-govplan/assets/project-brief-full.yaml` | Template FULL (19 secciones) |
| `sdd-govplan/govplan.html` | Página de referencia interactiva |

---

### 2. `workflow-builder` — Custom Workflow Builder

**Para proyectos de CUALQUIER tipo** — no solo software. Crea dinámicamente flujos de trabajo personalizados con skills generadas para cada fase.

Ideal para: tesis académicas, consultoría ISO 27001, coaching PNL, coaching de carrera, investigaciones, y cualquier proceso multi-fase.

```
/workflow-builder                         # Inicia entrevista para definir el workflow
/workflow-builder "Tesis sobre IA"        # Con nombre prefijado
/workflow continue                        # Ejecuta la siguiente fase pendiente
/workflow status                          # Muestra progreso del workflow actual
```

**Templates incluidos**:

| Tipo | Fases | Descripción |
|------|-------|-------------|
| **Thesis / Investigación** | 8 | problema → objetivos → justificación → marco teórico → metodología → análisis → redacción APA → referencias |
| **Consultoría (ISO 27001, etc.)** | 6 | diagnóstico → plan de acción → implementación → evaluación → mejora continua → cierre |
| **PNL Coaching** | 5 | línea base → objetivos → ejercicios → seguimiento → evaluación |
| **Career Coaching** | 5 | autoevaluación → exploración → plan de carrera → ejecución → revisión |
| **Custom** | a definir | El usuario describe cada fase y se genera automáticamente |

**Cómo funciona**:
```
/workflow-builder
  │
  ├── Fase 1: Entrevista (orchestrator pregunta)
  │   • Tipo de proyecto → elige template o custom
  │   • Ajusta fases, nombres, actividades, outputs
  │
  ├── Fase 2: Generación
  │   • Crea .agent/skills/{workflow-name}/workflow.yaml
  │   • Crea SKILL.md por cada fase
  │   • Crea progress.yaml para seguimiento
  │
  └── Fase 3: Ejecución (/workflow continue)
      • Carga la skill de la fase actual
      • La ejecuta
      • Actualiza progreso
      • Avanza a la siguiente
```

**Archivos generados por proyecto**:
```
.agent/skills/{workflow-name}/
├── workflow.yaml           ← Definición del DAG de fases
├── progress.yaml           ← Estado actual de ejecución
├── phase-001-slug.SKILL.md ← Skill para fase 1
├── phase-002-slug.SKILL.md ← Skill para fase 2
└── ...
```

---

## ¿Cuál usar?

| Si tu proyecto es... | Usá |
|---------------------|-----|
| Una app, API, o sistema de software | `/sdd-govplan` → pipeline SDD |
| Una tesis o investigación académica | `/workflow-builder` |
| Una consultoría empresarial | `/workflow-builder` |
| Coaching de carrera o PNL | `/workflow-builder` |
| Un proyecto que no es código pero tiene fases | `/workflow-builder` |
| Una mezcla de software + consultoría | Ambos: primero `/sdd-govplan` para el software, después `/workflow-builder` para el resto |

---

## Instalación global

Las skills se instalan en los directorios globales de Gentle AI:

```
~/.config/opencode/skills/
├── sdd-govplan/          ← Governance para software
│   ├── SKILL.md
│   ├── govplan.html
│   └── assets/
└── workflow-builder/     ← Workflows para cualquier proyecto
    ├── SKILL.md
    └── assets/
        ├── phase-skill-template.md
        └── templates/
```

Y en la copia de cobertura global:

```
~/.agents/skills/
├── sdd-govplan/
└── workflow-builder/
```

Registradas en `AGENTS.md` para que el orchestrator las encuentre via `available_skills`.

---

## Repositorio

Este repo contiene el código fuente de ambas skills.

```
sdd-govplan/               ← Skill de governance planning (software)
workflow-builder/          ← Skill de workflow builder (universal)
```

## License

MIT — parte del ecosistema [Gentle AI](https://github.com/gentleman-programming/gentle-ai)

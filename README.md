# Gentle AI Meta-Skills

Colección de skills para **Gentle AI** que extienden sus capacidades más allá del pipeline de software.

```
📦 sdd-govplan/
├── 📄 README.md
├── 📁 sdd-govplan/            ← Governance planning para proyectos de SOFTWARE
│   ├── SKILL.md
│   ├── govplan.html
│   └── assets/
└── 📁 workflow-builder/       ← Workflow builder para CUALQUIER tipo de proyecto
    ├── SKILL.md
    └── assets/
        ├── phase-skill-template.md
        └── templates/
```

---

## 1 · `sdd-govplan` — Governance para Software

Capa de gobernabilidad que captura contexto, features, decisiones de arquitectura y criterios de aceptación ANTES del pipeline SDD. Inspirado en AWS Well-Architected / DLC.

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

## 2 · `workflow-builder` — Workflows para Cualquier Proyecto

Crea dinámicamente flujos de trabajo personalizados con skills generadas para CADA FASE. Ideal para proyectos que NO son de software.

```
/workflow-builder                         # Inicia entrevista
/workflow-builder "Tesis sobre IA"        # Con nombre prefijado
/workflow continue                        # Ejecuta siguiente fase
/workflow status                          # Muestra progreso
```

### Modo Investigación (NUEVO)

Cuando **no conocés el flujo de trabajo**, el agente investiga por vos:

```
/workflow-builder

[1]: ¿Qué tipo de proyecto?
> Quiero implementar ISO 27001 en una empresa

[2]: ¿Conocés el flujo o querés que investigue?
> No lo conozco, investigá

→ El agente busca: ISO 27001 implementation methodology, PDCA cycle
→ Propone: diagnóstico → SGSI →风险评估 → controles → implementación → auditoría → certificación
→ Vos validás, ajustás, y se generan las skills
```

**Qué investiga según el dominio:**

| Domain | Investiga | Propone |
|--------|-----------|---------|
| Estándares (ISO, COBIT) | Fases de implementación, requisitos de certificación | Gap analysis → implementación → auditoría |
| Metodologías ágiles | Scrum, Kanban, SAFe | Sprint planning → daily → review → retro |
| Investigación científica | Método científico, metodologías | Problema → hipótesis → experimento → conclusión |
| Design Thinking | Proceso de diseño centrado en humano | Empatizar → definir → idear → prototipar → testear |
| Lean / Six Sigma | DMAIC, value stream mapping | Define → measure → analyze → improve → control |
| Cualquier dominio no listado | Búsqueda web + conocimiento del modelo | Flujo propuesto + opciones alternativas |

### Templates incluidos

| Tipo | Fases | Descripción |
|------|-------|-------------|
| **Thesis** | 8 | problema → objetivos → justificación → marco teórico → metodología → análisis → redacción APA → referencias |
| **Consulting** | 6 | diagnóstico → plan de acción → implementación → evaluación → mejora continua → cierre |
| **PNL Coaching** | 5 | línea base → objetivos → ejercicios → seguimiento → evaluación |
| **Career Coaching** | 5 | autoevaluación → exploración → plan de carrera → ejecución → revisión |
| **Custom / Investigado** | a definir | El usuario describe o el agente investiga y propone |

### Archivos generados por proyecto

```
.agent/skills/{workflow-name}/
├── workflow.yaml           ← DAG de fases
├── progress.yaml           ← Estado de ejecución
├── phase-001-slug.SKILL.md ← Skill para fase 1
├── phase-002-slug.SKILL.md ← Skill para fase 2
└── ...
```

---

## ¿Cuál usar?

| Si tu proyecto es... | Usá |
|---------------------|-----|
| App, API, o sistema de software | `/sdd-govplan` |
| Tesis o investigación académica | `/workflow-builder` |
| Consultoría empresarial | `/workflow-builder` |
| Coaching de carrera o PNL | `/workflow-builder` |
| No sabés por dónde arrancar | `/workflow-builder` → modo investigación |
| Proyecto sin código con fases | `/workflow-builder` |

---

## Instalación global

```
~/.config/opencode/skills/
├── sdd-govplan/
│   ├── SKILL.md
│   ├── govplan.html
│   └── assets/
└── workflow-builder/
    ├── SKILL.md
    └── assets/
        ├── phase-skill-template.md
        └── templates/
```

```
~/.agents/skills/
├── sdd-govplan/
└── workflow-builder/
```

Registradas en `AGENTS.md`.

---

## Repositorio

**https://github.com/QuantumEdu/sdd-govplan**

```sdd-govplan```

## License

MIT — ecosistema [Gentle AI](https://github.com/gentleman-programming/gentle-ai)

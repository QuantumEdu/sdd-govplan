# sdd-govplan

Repositorio maestro de la capa de **governance y flujo** para proyectos asistidos por IA sobre `gentle-ai`.

## Quick path

1. Leer `AGENTS.md`
2. Leer `governance/00-start-here.md`
3. Usar `governance/05-quick-start-by-scenario.md`
4. Seguir el flujo: `brief-inception` → `brief-to-prd` → `prd-to-spec` → `spec-to-tasks`

## Qué es este repo

Este repo ya no debe entenderse como una skill aislada de governance.

Ahora representa la **fuente maestra** de:

- governance;
- briefs y templates canónicos;
- puente `brief → PRD → spec → tasks`;
- review, migration, retrospective e improvement;
- documentación de límites entre `gentle-ai`, `agent-core-v3` y los overlays locales.

## Modelo de capas

| Capa | Dueño | Rol |
|------|------|-----|
| Runtime | `gentle-ai` | orquestación, memoria, SDD, delegación |
| Core reusable | `agent-core-v3` | distribución global por npm de skills/assets reutilizables |
| Overlay local | `/ai` en cada repo | adaptación contextual del proyecto |

## Qué resuelve

Cuando el sistema solo tiene skills globales o prompts sueltos, suele faltar:

- intake ordenado;
- puente entre idea y tareas ejecutables;
- navegación por escenarios;
- templates consistentes;
- estrategia clara para cambios sensibles y migraciones.

`sdd-govplan` centraliza precisamente esa parte.

## Estructura del repo

```text
governance/      # gates, workflow map, quick-start, start-here
templates/       # briefs, spec, tasks, review, retrospective, migration
docs/            # límites del sistema, planes maestros, mapas de publicación
reference/       # patterns y material de apoyo

sdd-govplan/     # skill original de governance
workflow-builder/# skill para workflows no-code

brief-inception/
brief-to-prd/
prd-to-spec/
spec-to-tasks/
change-review/
rule-migration/
improvement-loop/
memory-fallback/
local-retrospective/
project-stack-decider/
add-endpoint/
coding-conventions/
prompt-improver/
geek-tech-tone/
```

## Flujos principales

### Flujo canónico

`brief-inception` → `brief-to-prd` → `prd-to-spec` → `spec-to-tasks`

### Flujos de soporte

- review → `change-review`
- rule replacement → `rule-migration`
- repeated error → `improvement-loop`
- no Engram → `memory-fallback`
- retrospective → `local-retrospective`

## Brief modes

- `templates/PROJECT-BRIEF-FULL.yaml` — proyectos serios, sensibles o complejos
- `templates/PROJECT-BRIEF-LITE.yaml` — proyectos pequeños, rápidos o exploratorios

## Relación con `agent-core-v3`

`agent-core-v3` es el **target de distribución**.

No debe reemplazar este repo narrativamente; debe recibir desde aquí solo lo reusable:

- skills globales
- templates base
- assets multi-tool
- docs de instalación y uso global

## Relación con overlays locales

Cada proyecto puede tener su propio `/ai` como overlay local.

Ese overlay:
- usa este repo como fuente de gobierno;
- usa `agent-core-v3` como distribución reusable;
- se adapta al contexto real del proyecto.

## Documentos clave

- `governance/00-start-here.md`
- `governance/04-workflow-map.md`
- `governance/05-quick-start-by-scenario.md`
- `docs/system-boundaries.md`
- `docs/master-plan.md`
- `docs/repo-publication-map.md`

## Estado actual

Este repo pasa a ser el archivo maestro de la capa de gobernanza trabajada en esta sesión.
La evolución siguiente es exportar el core reusable hacia `agent-core-v3` sin volver a mezclar runtime, distribución y overlay local.

## License

MIT

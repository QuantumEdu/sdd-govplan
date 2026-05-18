# AI-DLC Lite over gentle-ai

## Tesis

En este repositorio, AI-DLC-lite no reemplaza a gentle-ai.
Funciona como **capa de gobierno liviana** encima del orquestador.

## Distribución de responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| gentle-ai | Orquestación, memoria, SDD, delegación |
| governance/ | Intake, preguntas, gates, brief y decisiones iniciales |
| root skills | Capacidades portables y reusables |
| optional agents | Especialistas opcionales por rol |
| local `/ai` overlays | Adaptación contextual de cada repo |

## Fases

1. **Inception**: brief, preguntas, clasificación del proyecto.
2. **Construction**: spec, tareas, implementación.
3. **Verification**: pruebas, revisión, ajuste documental.
4. **Operations**: runbooks, rollout, rollback, decisiones operativas.

## Regla de convivencia

Si una capa intenta decidir flujo, memoria y ejecución al mismo tiempo, hay duplicación.
En este diseño:

- gentle-ai decide la orquestación;
- AI-DLC-lite decide las puertas de paso;
- Engram recuerda.

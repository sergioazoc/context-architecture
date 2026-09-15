---
title: Context Architecture vs. context engineering vs. harness engineering
description: Tres disciplinas, tres posturas frente al codebase. Context Architecture diseña el codebase mismo en tiempo de diseño, independiente de cualquier agente, la contraparte de context engineering (runtime) y harness engineering (el bucle de operación del agente). Una especificación de Sergio Azócar.
eyebrow: Comparación
definition: Context engineering diseña el contenido de la ventana de contexto. Harness engineering diseña todo lo que envuelve a un agente. Context Architecture diseña el codebase mismo, en tiempo de diseño e independiente de cualquier agente.
---

Los términos se confunden fácil porque todos tocan agentes de IA y código. No son competidores. Toman
posturas distintas frente al codebase. La distinción se traza mejor con una sola pregunta: ¿qué diseña
cada uno?

## Las tres disciplinas

| Disciplina               | Qué diseña                                       | Capa                                  | Pregunta que responde                                                        |
| ------------------------ | ------------------------------------------------ | ------------------------------------- | ---------------------------------------------------------------------------- |
| Context engineering      | El contenido de la ventana de contexto           | Runtime                               | ¿Qué ve el modelo ahora mismo?                                               |
| Harness engineering      | Las guías y sensores que envuelven a un agente   | El bucle de operación del agente      | ¿Cómo se orienta y se corrige este agente?                                   |
| **Context Architecture** | **El codebase mismo**                            | **Arquitectura de software (diseño)** | **¿Cómo se estructura el sistema para que personas y agentes lo entiendan?** |

::diagram-layers
::

Algunos proveedores usan "context architecture" para la primera fila, la disposición en runtime de la
ventana de contexto. Esta especificación llama a eso context engineering y reserva Context Architecture
para el codebase.

## El codebase como entrada vs. el codebase como objeto

Las otras disciplinas tratan al codebase como una _entrada_. El harness lo lee. Context engineering lo
comprime en una ventana. El agente lo navega. En todos los casos el codebase es un dato dado, algo que
se consume.

Context Architecture trata al codebase como el _objeto de diseño_. Pregunta cómo debería estructurarse
el repo en primer lugar, antes de que algún agente lo lea.

Esta es la línea que sigue separando a las disciplinas ahora que harness engineering se movió hacia el
repositorio. Tal como usan el término OpenAI y Thoughtworks hoy, el harness incluye el AGENTS.md que el
agente lee y los linters que aplican la estructura, y Thoughtworks trata el harness de un agente de
código como una forma de context engineering. La postura es lo que las divide: el harness y context
engineering consumen el codebase para un agente en un momento; Context Architecture diseña el codebase,
y su regla se sostiene sea cual sea el agente o el harness que lea el resultado.

Y hay una relación causal entre las capas. Un codebase con buena Context Architecture le baja el
trabajo a toda otra: menos que comprimir en runtime, menos guardrails correctivos en el harness, menos
errores que parchar entre sesiones. La estructura bien hecha en tiempo de diseño rinde en todo lo que
viene aguas abajo.

## Harness engineering, tal como lo usa OpenAI

El relato de OpenAI sobre harness engineering (febrero de 2026) describe un AGENTS.md de alrededor de
cien líneas como mapa, un directorio docs tratado como el system of record, linters custom cuyos
mensajes orientan al agente, y tareas de fondo que recogen docs obsoletos. Thoughtworks (Böckeler,
abril de 2026) divide el mismo trabajo en guías y sensores, y nombra las architectural fitness
functions entre ellos. Eso es casi todo el territorio de Context Architecture, descrito como una
práctica con un toolchain, meses antes de que se publicara esta especificación.

Context Architecture no es esa práctica; es la regla que la práctica cumple o no. El "promote the rule
into code" de OpenAI y los sensores de Böckeler son mecanismos en el sentido que se usa aquí. Lo que
esta especificación añade es que la regla también aplica a las afirmaciones en prosa, un AGENTS.md que
cita un archivo borrado es una violación, y al propio conjunto de mecanismos (principio 09), que ninguna
práctica de harness ata.

## Scorecards de readiness y linters de instrucciones

La aptitud de un repositorio para agentes ahora se puntúa. El Agent Readiness de Factory califica
pilares por niveles; agent-ready y agents-lint revisan hooks, rulesets, rutas muertas y scripts
obsoletos. Son primos cercanos de Context Architecture y útiles junto a ella, pero miden presencia:
¿hay un linter, hay tests, hay un AGENTS.md? Context Architecture pregunta si cada mecanismo falla
cuando su afirmación deja de ser cierta, y si el propio checklist está atado. Un scorecard puede salir
en verde con tests que nunca fallan; la regla no.

## Una analogía

Harness engineering diseña el vehículo, sus controles de seguridad y las notas del propio conductor
sobre las calles. Context engineering decide qué mapa cargar en cada viaje. Context Architecture es el
urbanismo de la ciudad misma: calles con nombres claros y barrios con lógica interna dejan que
cualquier conductor, persona o agente, navegue sin un GPS sofisticado.

Una ciudad bien planificada no es una función que le atornillas a una mala. Es el sustrato que abarata
cada trayecto por ella. Esa es la relación de Context Architecture con las capas de arriba.

## Trabajo relacionado, con fecha

Context Architecture declara su linaje en vez de reclamar novedad sobre él. Cada uno de estos precede
o corre en paralelo a la especificación y respalda una parte de ella.

- **Ford, Parsons y Kua, 2017.** Architectural fitness functions: una verificación objetiva atada a
  una característica arquitectónica. El linaje de la palabra "mecanismo" aquí.
- **Anthropic, septiembre de 2025.** Las jerarquías de archivos, las convenciones de nombres y las
  marcas de tiempo son señales que un agente lee, que es lo que dicen los principios 01 y 04.
- **Simon Willison, septiembre y octubre de 2025.** Una suite de tests robusta y estable deja volar a
  las herramientas agénticas, y un AGENTS.md debe llevar ejemplos de comandos reales (principios 05 y
  08).
- **Birgitta Böckeler, octubre de 2025 y 2026.** La taxonomía de spec-driven (principio 06) y los
  sensores del harness, incluidas las fitness functions, en que se apoya esta página.
- **OpenAI, febrero de 2026.** Harness engineering: AGENTS.md como mapa, docs como system of record, y
  "promote the rule into code" (principios 01, 02, 07).
- **Gloaguen et al., 2026.** Los archivos de resumen del repositorio no suben en general la tasa de
  éxito y añaden más de 20% al coste de inferencia, por lo que el principio 02 limita un AGENTS.md a lo
  que el código no puede decir.
- **Thoughtworks Technology Radar, 2026.** AGENTS.md, agent instruction bloat, feedback sensors y
  codebase cognitive debt, los nombres del campo para lo que la regla ata.

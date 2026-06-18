---
title: Context Architecture vs. context engineering vs. harness engineering
description: Tres disciplinas, tres objetos de diseño. Context Architecture diseña el codebase mismo, la contraparte de diseño de context engineering (runtime) y harness engineering (el entorno de operación del agente). Una especificación de Sergio Azócar.
eyebrow: Comparación
definition: Context engineering diseña el contenido de la ventana de contexto. Harness engineering diseña el entorno de ejecución del agente. Context Architecture diseña el codebase mismo, en tiempo de diseño.
---

Los términos se confunden fácil porque todos tocan agentes de IA y código. No son competidores.
Operan sobre objetos distintos, en capas distintas. La distinción se traza mejor con una sola
pregunta: ¿qué diseña cada uno?

## Las tres disciplinas

| Disciplina               | Qué diseña                             | Capa                                  | Pregunta que responde                                                     |
| ------------------------ | -------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------- |
| Context engineering      | El contenido de la ventana de contexto | Runtime                               | ¿Qué ve el modelo ahora mismo?                                            |
| Harness engineering      | El entorno de ejecución del agente     | Infraestructura / operación           | ¿Cómo opera el agente de forma segura y se autocorrige?                   |
| **Context Architecture** | **El codebase mismo**                  | **Arquitectura de software (diseño)** | **¿Cómo estructuro el sistema para que personas y agentes lo entiendan?** |

::diagram-layers
::

## El codebase como entrada vs. el codebase como objeto

Las otras disciplinas tratan al codebase como una _entrada_. El harness lo lee. Context engineering
lo comprime en una ventana. El agente lo navega. En todos los casos el codebase es un dato dado,
algo que se consume.

Context Architecture trata al codebase como el _objeto de diseño_. Pregunta cómo debería
estructurarse el repo en primer lugar, antes de que algún agente lo lea.

Y hay una relación causal entre los dos. Un codebase con buena Context Architecture le baja el
trabajo a toda otra capa: menos que comprimir en runtime, menos guardrails correctivos en el
harness, menos errores que parchar entre sesiones. La estructura bien hecha en tiempo de diseño es
apalancamiento en todo lo que viene aguas abajo.

## Una analogía

Harness engineering diseña el vehículo y sus controles de seguridad. Context engineering decide qué
mapa cargar en cada viaje. Context Architecture es el urbanismo de la ciudad misma: calles con
nombres claros y barrios con lógica interna dejan que cualquier conductor, persona o agente, navegue
sin un GPS sofisticado.

Una ciudad bien planificada no es una función que le atornillas a una mala. Es el sustrato que
abarata cada trayecto por ella. Esa es la relación de Context Architecture con las capas de arriba.

---
title: "Glosario: Context Architecture y los términos adyacentes"
description: "Definiciones concisas y citables de Context Architecture y los términos con los que más se confunde: context engineering, harness engineering, AGENTS.md, spec-driven development y Screaming Architecture. Una especificación de Sergio Azócar."
eyebrow: Glosario
definition: "Context Architecture es la disciplina de tiempo de diseño que estructura un codebase para que sea legible para personas y agentes de IA. Este glosario la define junto a los términos adyacentes con los que más se confunde, para que cada uno pueda citarse con precisión."
---

Los términos en torno a los agentes de IA y el código se usan de forma laxa y se confunden. Este
glosario le da a cada uno una definición corta y autocontenida, y dice cómo se relaciona con Context
Architecture. Para el tratamiento completo de las tres disciplinas, ver la
[comparación](/es/comparacion).

## Context Architecture

Una arquitectura de software para la era de los agentes de IA: la práctica de estructurar un codebase
para que su intención y comportamiento sean igual de legibles para personas y agentes de IA. Trata
el repositorio mismo (su árbol de archivos, fronteras, convenciones y contexto embebido) como un
artefacto diseñado, no como un accidente de su crecimiento. Opera en tiempo de diseño, y es la
contraparte estructural de context engineering y harness engineering. Introducida por Sergio Azócar
en octubre de 2025.

## Context engineering

La disciplina de runtime que decide qué entra a la ventana de contexto del modelo en cada paso: qué
archivos, instrucciones y resultados de herramientas se cargan. Diseña los contenidos de la ventana.
Context Architecture diseña aquello que la ventana mira, el codebase. Una mejor Context Architecture
significa que hay menos que comprimir en runtime.

## Harness engineering

La disciplina operacional que diseña el entorno donde corre un agente: el bucle de ejecución, las
herramientas que puede invocar y los guardrails que lo mantienen seguro y le permiten autocorregirse.
Diseña el entorno de operación del agente. Context Architecture diseña el codebase sobre el que ese
entorno opera. Una mejor Context Architecture significa menos guardrails correctivos en el harness.

## AGENTS.md

Un archivo de contexto embebido ubicado en una frontera con significado dentro de un repositorio, que
contiene solo lo que no se puede aprender leyendo el código: la fuente de verdad, los invariantes, la
deuda técnica aceptada y la razón que un spec dejó atrás. Como está junto al código, se revisa en el
mismo pull request, envejece al mismo ritmo y lo encuentra el mismo agente que está por editarlo.
`CLAUDE.md` es el equivalente específico de herramienta que leen algunos agentes. En Context
Architecture, un `AGENTS.md` es el artefacto del segundo principio (El contexto vive con el código), y
cada afirmación que hace debería estar ligada a un mecanismo.

## Spec-driven development

Escribir la intención como una especificación antes de que el código exista: el spec define el qué,
no el cómo, con criterios de aceptación contra los que se verifica la implementación. En Context
Architecture (tercer principio, La intención se vuelve mecanismo), el spec es andamiaje de tiempo de
diseño, no un artefacto durable. Una vez que sus criterios de aceptación se vuelven tests, sus
contratos se vuelven tipos y sus convenciones se vuelven lint, cumplió su función y se elimina, para
que no pueda derivar. Se conserva solo cuando sigue siendo generativo, alimentando generación de
código o un bucle spec-driven.

## Screaming Architecture

El principio, nombrado por Robert C. Martin en 2011, de que la estructura de un sistema de software
debería anunciar qué hace, no qué framework lo construyó: el primer nivel debería gritar `billing`,
`payments`, `onboarding`, no `controllers`, `services`, `utils`. Context Architecture es su heredera.
Hereda el ideal y lo extiende a un lector sin memoria, el agente de IA, para quien la estructura debe
gritar aún más legiblemente, porque el agente no va a tapar la ambigüedad con intuición.

## Context-rot

El deterioro silencioso de la documentación a medida que el código que describe cambia: un doc que
cita un archivo borrado, nombra un módulo renombrado o contradice el comportamiento actual, mientras
todavía se lee como autoritativo. Un lector con confianza lo obedece, así que el contexto podrido es
peor que no tener ninguno. La regla en el corazón de Context Architecture existe para prevenirlo: toda
afirmación que un repositorio hace sobre sí mismo debe estar ligada a un mecanismo que falla cuando la
afirmación deja de ser verdad.

## Hacia dónde seguir

- La [especificación](/es): la regla, los cuatro pilares, el mecanismo y los ocho principios.
- La [comparación](/es/comparacion): Context Architecture vs. context engineering vs. harness
  engineering.
- La [guía](/es/guia): cómo aplicarla a un codebase existente.

---
title: "Glosario: Context Architecture y los términos adyacentes"
description: "Definiciones concisas y citables de Context Architecture y los términos con los que más se confunde: context engineering, harness engineering, AGENTS.md, spec-driven development, context rot y el vocabulario del tooling de agentes. Una especificación de Sergio Azócar."
eyebrow: Glosario
definition: "Context Architecture es una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea legible para el agente que escribe el código y para las personas que responden por él, y esté atado a un mecanismo que falla cuando esa afirmación deja de ser cierta."
---

Los términos en torno a los agentes de IA y el código se usan de forma laxa y se confunden. Este
glosario le da a cada uno una definición corta y autocontenida, y dice cómo se relaciona con Context
Architecture. Para el tratamiento completo de las tres disciplinas, ver la
[comparación](/es/comparacion).

## Context Architecture

Una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que
todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea
legible para el agente que escribe el código y para las personas que responden por él, y esté atado a
un mecanismo que falla cuando esa afirmación deja de ser cierta. Trata el repositorio mismo (su árbol
de archivos, fronteras, convenciones y contexto embebido) como un artefacto diseñado, no como un
accidente de su crecimiento. Es la contraparte en tiempo de diseño de context engineering y harness
engineering. Sergio Azócar introdujo el término para repositorios de software en octubre de 2025, y
publicó por primera vez esta especificación en junio de 2026.

La frase se usa en otros ámbitos con sentidos que no son sobre el repositorio. Algunas plataformas de
datos llaman "context architecture" a la capa de metadatos que un agente lee (Modern Data 101, octubre
de 2025). Algunos proveedores la usan para la disposición en runtime de la ventana de contexto del
agente, el system prompt, la memoria y los datos recuperados (Atlan, abril de 2026); esta
especificación llama a eso context engineering. En UX nombra la arquitectura de información aplicada a
productos de IA (Nielsen Norman Group, junio de 2026). Aquí, Context Architecture diseña el
repositorio.

## Context engineering

La disciplina de runtime que decide qué entra a la ventana de contexto del modelo en cada paso: qué
archivos, instrucciones y resultados de herramientas se cargan. Diseña los contenidos de la ventana.
Context Architecture diseña aquello que la ventana mira, el codebase. Una mejor Context Architecture
significa que hay menos que comprimir en runtime. Popularizado por Tobi Lütke y Andrej Karpathy en
junio de 2025 y definido por Anthropic en septiembre de 2025.

## Harness engineering

La disciplina de diseñar todo lo que envuelve a un agente: el bucle de ejecución, las herramientas que
puede invocar, las guías que lo orientan y los sensores que atrapan sus errores. Tal como usan el
término OpenAI (febrero de 2026) y Thoughtworks (Birgitta Böckeler, abril de 2026), el harness también
alcanza el repositorio: el AGENTS.md que el agente lee como mapa, los docs que trata como fuente de
verdad, los linters custom que aplican la arquitectura. Context Architecture no compite con ese
trabajo; es la regla que esas guías y sensores cumplen o no. Harness engineering envuelve a un agente
con un toolchain; Context Architecture es una propiedad del repositorio, independiente del agente: cada
afirmación atada a un mecanismo que falla, y el propio conjunto de mecanismos atado (principio 09). Una
mejor Context Architecture significa menos guardrails correctivos en cualquier harness.

## AGENTS.md

Un archivo de contexto embebido ubicado en una frontera con significado dentro de un repositorio, que
contiene solo lo que no se puede aprender leyendo el código: la fuente de verdad, los invariantes, la
deuda técnica aceptada y la razón que un spec dejó atrás. Es un formato abierto, publicado en agosto de
2025 y custodiado por la Agentic AI Foundation bajo la Linux Foundation desde diciembre de 2025,
adoptado en decenas de miles de proyectos. Un repositorio puede tener uno por directorio, y los agentes
leen el más cercano en el árbol, así que el más próximo tiene precedencia. El estándar fija el nombre
del archivo y esa regla de nearest-wins, nada sobre el contenido; Context Architecture aporta la
disciplina de contenido: solo lo que el código no puede decir, cada afirmación atada a un mecanismo.
Como el archivo está junto al código, se revisa en el mismo pull request, envejece a su ritmo y lo
encuentra el mismo agente que va a editarlo. Claude Code lee su propio `CLAUDE.md` en su lugar, así que
un `CLAUDE.md` que importa `AGENTS.md`, o un symlink, hace de puente entre ambos; la mayoría de los
demás agentes leen `CLAUDE.md` solo como fallback cuando falta `AGENTS.md`. En Context Architecture un
`AGENTS.md` es el artefacto del segundo principio (El contexto vive con el código).

## Spec-driven development

Escribir la intención como una especificación antes de que el código exista: el spec define el qué, no
el cómo, con criterios de aceptación contra los que se verifica la implementación. Birgitta Böckeler
(octubre de 2025) nombra tres niveles: spec-first (el spec se usa y se descarta), spec-anchored (el spec
persiste y evoluciona) y spec-as-source (el spec es el artefacto que se mantiene, el código su salida).
Las herramientas difieren: Spec Kit y Kiro conservan el spec como fuente de verdad viva, Tessl lo
empareja con tests enlazados, OpenSpec lo archiva. Context Architecture (sexto principio, La intención
se convierte en mecanismo) es spec-first por defecto: el spec se convierte en tests, tipos y lint, y
luego se elimina para que no derive. Un spec que sigue siendo generativo, alimentando generación de
código o un bucle spec-driven, se conserva, y entonces la regla también aplica sobre él: es una
afirmación que el repositorio hace, así que necesita un mecanismo que falle cuando él y el código
divergen. Un spec que ninguna verificación puede reprobar es prosa.

## Context rot

El término tiene dos sentidos. Chroma (julio de 2025) y Anthropic (septiembre de 2025) lo usan para la
degradación del recuerdo del modelo a medida que crece su ventana de contexto. Esta especificación,
como Treude y Baltes (junio de 2026), lo usa para el otro deterioro: el contexto del repositorio que se
aleja del código que describe, un doc que cita un archivo borrado, nombra un módulo renombrado o
contradice el comportamiento actual mientras todavía se lee como autoritativo. Un lector con confianza
lo obedece, así que el contexto podrido es peor que no tener ninguno. La regla en el corazón de Context
Architecture existe para prevenir este segundo sentido: toda afirmación que un repositorio hace sobre sí
mismo debe estar ligada a un mecanismo que falla cuando esa afirmación deja de ser verdad.

## Mechanism

Aquello a lo que se ata una afirmación, que falla cuando la afirmación deja de ser cierta: un error de
compilación, una regla de linter, una prueba automatizada o un paso de revisión. Es una architectural
fitness function (Ford, Parsons y Kua, 2017), lo que Böckeler (2026) llama un sensor, aplicado a una
afirmación que el repositorio hace sobre sí mismo. Context Architecture añade dos cosas a ese linaje:
una afirmación en prosa (una ruta de `AGENTS.md`, un comando del README) también se ata, y el conjunto
de mecanismos está a su vez atado (principio 09).

## Hook

Un script que la herramienta del agente corre en un punto fijo de su bucle, antes de una llamada a una
herramienta, después de una edición o al terminar el turno, y que puede bloquear la acción. Se
configura en un archivo que el repositorio versiona (`.claude/settings.json`, `.cursor/hooks.json`,
`.github/hooks/`, `.codex/hooks.json`). En Context Architecture un hook es un lugar donde un mecanismo
puede disparar antes, dentro del bucle del agente en vez de en CI. No es la autorización del principio
09, porque a la herramienta se le puede decir que lo salte y otro agente puede no correrlo; el gate de
integración sigue siendo el piso.

## Skill

Un procedimiento empaquetado que el agente carga bajo demanda, en el formato Agent Skills (un archivo
`SKILL.md` con frontmatter). Contiene el cómo, los pasos repetibles, fuera del contexto hasta que se
necesitan, junto al qué que un `AGENTS.md` siempre lleva. En Context Architecture un skill es una forma
de hacer descubribles las capacidades (quinto principio); un skill que cita una ruta o un script es una
afirmación, atada por la misma prueba de referencias de docs.

## Progressive disclosure

Cargar la información por etapas para gastar contexto solo cuando hace falta: una tabla de contenidos,
luego el capítulo, luego el apéndice (Anthropic, octubre de 2025, y el estándar Agent Skills). Context
Architecture es un diseño de progressive disclosure: el `AGENTS.md` raíz es la tabla de contenidos, el
`AGENTS.md` de cada frontera es el capítulo, el código es el apéndice, y el primer principio hace del
árbol de archivos el primer nivel.

## Agent memory

Notas que la herramienta del agente guarda para sí entre sesiones (Claude Code auto memory, Codex
memories, Copilot Memory). Son locales a una máquina o una cuenta, no verificadas y no compartidas con
el repositorio, así que se desactualizan como cualquier prosa y nada falla cuando lo hacen. Context
Architecture diseña para el lector que no las tiene, el único diseño que vale para todo lector; lo que
la memoria aprende y el repositorio debería decir se promueve a un `AGENTS.md` o a un mecanismo.

## Agentic engineering

La práctica, nombrada por Andrej Karpathy en 2026, de coordinar agentes falibles preservando
corrección, seguridad y mantenibilidad: diseñar specs, supervisar planes, inspeccionar diffs, escribir
tests y construir bucles de evaluación. Agentic engineering es el trabajo y el rol; Context Architecture
es una propiedad del repositorio sobre el que ese trabajo opera. Cuando el agentic engineer escribe
tests y bucles de evaluación, la regla dice cuáles: uno por cada afirmación que el repositorio hace
sobre sí mismo.

## Agent readiness

Cuán preparado está un repositorio para que los agentes trabajen en él, medido por scorecards y linters
de instrucciones (por ejemplo el Agent Readiness de Factory, agents-lint). Estos miden si los
mecanismos están presentes: un linter, tests, un `AGENTS.md`. Context Architecture pide más: que cada
mecanismo falle cuando su afirmación deja de ser cierta, y que el conjunto de mecanismos esté a su vez
atado. Un scorecard puede estar en verde con tests que nunca fallan.

## Hacia dónde seguir

- La [especificación](/es): la regla, el espectro de autonomía, los mecanismos y los nueve principios.
- La [comparación](/es/comparacion): Context Architecture vs. context engineering vs. harness
  engineering.
- La [guía](/es/guia): cómo aplicarla a un codebase existente.

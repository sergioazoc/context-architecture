---
title: Context Architecture
description: Context Architecture es la práctica de estructurar un codebase para que su intención y comportamiento sean igual de legibles para personas y agentes de IA. Una especificación de Sergio Azócar.
eyebrow: Una especificación
definition: Context Architecture es la práctica de estructurar un codebase para que su intención y comportamiento sean igual de legibles para personas y agentes de IA. Trata el repositorio mismo (su árbol de archivos, fronteras, convenciones y contexto embebido) como un artefacto diseñado, no como un accidente de su crecimiento.
attribution: Introduje el término Context Architecture en octubre de 2025, mientras reestructuraba el monorepo de Skyward para la legibilidad de personas y agentes de IA. Publicado por primera vez en junio de 2026.
---

<!--
  NOTA DE IP: El conjunto de principios (nombres + enunciados de una línea) es
  un borrador fuerte derivado de la práctica del autor, no el canon final. La
  estructura es real y completa; el autor finalizará la redacción. No inventar
  principios adicionales ni alterar la metodología.
-->

## La regla

Context Architecture no inventa piezas nuevas. Toma lo que ya funciona en el ecosistema y lo
organiza bajo una sola regla. Esa regla es la columna vertebral, y todo lo demás deriva de ahí.

::rule
Toda afirmación que un repositorio hace sobre sí mismo debe estar ligada a un mecanismo que
falla cuando esa afirmación deja de ser verdad.

#slogan
Si un dato de contexto puede pudrirse en silencio, no es arquitectura: es documentación.
::

La regla es un test que puedes correr sobre cualquier repo, línea por línea. Para cada cosa que el
repositorio afirma sobre sí mismo (dónde está la fuente de verdad, qué patrón es el correcto, qué no
se toca), ¿hay un compilador, un linter, un test o un paso de review que se rompe si esa afirmación
se vuelve falsa? Si no lo hay, es texto, y el texto se pudre. Una afirmación de contexto sin
mecanismo que la respalde _es_ la violación.

La contribución no son las piezas. Es la regla que las selecciona y las sostiene, y la consecuencia
de esa regla: el contexto deja de ser una promesa que alguien mantiene a mano y pasa a ser una
propiedad verificable y autosostenida del sistema.

## El problema

Durante mucho tiempo, una buena arquitectura se medía por una sola cosa: qué tan rápido un ingeniero
nuevo entendía el codebase. Screaming Architecture le puso nombre al ideal. La estructura de un
proyecto debería gritar qué hace, no qué framework lo construyó.

Ese ideal sigue intacto. El que cambió es el lector. Hoy buena parte del código que se envía a
producción lo leen, navegan y modifican agentes de IA. Por eso la arquitectura parte de un supuesto
de diseño explícito:

> Asume un lector que no retiene nada entre sesiones y conoce únicamente lo que el repositorio hace
> explícito. Los agentes de IA satisfacen este supuesto de forma exacta; un contribuyente humano
> nuevo lo aproxima.

De ese supuesto se siguen cinco modos de falla. Cada uno es un defecto de diseño del repositorio, no
un límite del modelo, y por eso ninguno se corrige con un modelo mejor ni con mejores prompts:

1. **Reimplementación.** El lector reconstruye lo que ya existe, porque la fuente de verdad no
   estaba localizable.
2. **Estructura inventada.** Impone su propia organización, porque ninguna estaba impuesta.
3. **Obediencia a documentación falsa.** Cita archivos borrados o contradice el código actual, con
   plena confianza.
4. **Propagación de patrón deprecado.** Copia el patrón más visible aunque esté obsoleto.
5. **Resolución aleatoria de ambigüedad.** Con dos convenciones coexistiendo, usa la del archivo que
   leyó primero.

La arquitectura existe para que estas cinco fallas no tengan dónde ocurrir.

## Cómo funciona

La arquitectura satisface la regla con dos movimientos y una frontera: el contexto se **escribe**
(los cuatro pilares) y vive con el código que describe (principio 02); se **verifica** (el mecanismo,
cuya primera instancia es codificar las convenciones en lint y tipos, principio 05); y, en su forma
madura, se **alimenta** (el metabolismo).

### Los cuatro pilares

Por sí solos los pilares son buena documentación, y la documentación se pudre. Son solo la mitad del
trabajo. Dos de ellos hacen legible la forma del propio código (estructura y capacidades, que el
lector infiere del árbol); dos declaran lo que el código no puede decir de sí mismo (contexto
embebido e intención escrita).

**Pilar 1. La estructura grita la intención.** El nivel superior se organiza por dominio, no por
tecnología: `billing/`, `onboarding/`, `payments/`, no `controllers/`, `services/`, `utils/`. Las
carpetas técnicas están bien un nivel más abajo, dentro del dominio al que sirven; lo que el
framework no debe ser es el eje sobre el que se organiza el repositorio. Un lector ubica un cambio
antes de leer una línea de código.

**Pilar 2. Contexto embebido.** Un `AGENTS.md` o `CLAUDE.md` en cada frontera significativa, con
solo lo que no se aprende leyendo el código: fuentes de verdad, invariantes, deuda técnica asumida y el
porqué que deja una spec al volverse mecanismo (pilar 3). Como está pegado al código, envejece con él y lo
encuentra el mismo agente que está a punto de editarlo. No vive en una wiki que se desactualiza en
otra parte.

**Pilar 3. La intención se vuelve mecanismo.** La spec precede al código: define el qué, no el cómo, con criterios
de aceptación contra los que el agente se autoevalúa. Pero la spec es andamiaje de diseño, no un
artefacto durable; una vez que su intención vive en tests, tipos y lint, cumplió su tarea y se
elimina. Cuando la intención solo vive en la cabeza de quien estuvo en la reunión, el agente no
tiene contra qué alinearse.

**Pilar 4. Las capacidades son descubribles.** Herramientas, skills y comandos en rutas
predecibles, nombrados por lo que hacen. Una capacidad que existe pero no se encuentra, para un
agente no existe: garantiza que se reimplemente o se omita. Las capacidades se invocan cuando hacen
falta, no siempre, porque el contexto es finito: si le das todo a un agente siempre, no le das nada.
Cuál cargar en cada momento es trabajo de context engineering, en runtime; el trabajo de este pilar
es de diseño, hacerlas encontrables en primer lugar y ligar eso a un mecanismo (abajo).

### El mecanismo

Esta es la otra mitad, y la línea entre Context Architecture y "buenas prácticas de documentación".
Cada afirmación de los pilares se liga a un mecanismo que la hace fallar cuando deja de ser verdad.
Cuatro capas, cada una atrapando un tipo de deriva:

- **El compilador** vigila lo que puede: reintroducir un alias de import prohibido rompe el
  typecheck.
- **El linter** vigila la estructura: un archivo en la carpeta equivocada es un error inmediato, con
  un mensaje que cita la regla, no un comentario en el review.
- **Los tests** vigilan que la documentación no mienta: si un `AGENTS.md` cita un archivo borrado,
  la suite se pone roja. La misma capa vigila la descubribilidad: un índice de capacidades generado
  desde las rutas convencionales (no mantenido a mano) no puede omitir una capacidad real, y una
  entrada obsoleta pone la suite en rojo.
- **El review** (humano o IA) vigila la verdad semántica, con una instrucción que en cada cambio
  pregunta si deja alguna doc mintiendo y exige actualizarla en el mismo PR.

Con el mecanismo, el contexto deja de ser una promesa y pasa a ser una propiedad del sistema. Es
también lo que deja a los cinco modos de falla sin lugar donde ocurrir: la estructura inventada la
atrapa el linter, la documentación falsa los tests, los patrones obsoletos y la ambigüedad las
convenciones codificadas, y la reimplementación las capacidades descubribles y su índice.

### El metabolismo

El nivel maduro, el que separa una Context Architecture real de una bien intencionada: el contexto
no solo se valida, se alimenta. Una arquitectura que se valida no puede pudrirse en silencio. Una
que se alimenta incorpora conocimiento nuevo en el momento en que se crea. Cuando un PR introduce
una fuente de verdad o una invariante, el loop de review pide documentarla ahí mismo. El contexto
crece con el sistema, no por detrás de él.

::diagram-metabolism
::

### El porqué: el atributo de calidad

Todo esto sirve a un solo atributo de calidad, y nombrarlo es lo que vuelve la arquitectura una
arquitectura y no un conjunto de buenas ideas:

> El tiempo hasta el primer cambio correcto de un lector sin contexto previo.

Históricamente ese lector era un ingeniero nuevo. Ahora también es un agente, y es el lector más
exigente que hay, porque no tapa la ambigüedad con intuición. Optimizar para él es el norte que
justifica integrar las piezas. No es elegancia, es servir a un lector concreto.

## Los principios

Cada principio sigue la misma anatomía: un nombre, un enunciado de una línea, el razonamiento, la
práctica que lo implementa y un ejemplo. La regularidad es parte del argumento. Esto es una
metodología, no una colección de opiniones. Cada principio es una derivación de la regla, y cada uno
vive en un pilar o en un nivel superior:

| Principio    | Dónde vive                          |
| ------------ | ----------------------------------- |
| 01 · 04 · 07 | Pilar 1: La estructura grita la intención |
| 02           | Pilar 2: Contexto embebido                |
| 03           | Pilar 3: La intención se vuelve mecanismo |
| 06           | Pilar 4: Las capacidades son descubribles |
| 05           | El mecanismo (su primera instancia) |
| 08           | El atributo de calidad (el porqué)  |

### 01 La estructura grita la intención

> Un lector, persona o agente, debe poder inferir qué hace el sistema solo a partir del árbol de
> archivos, nunca del framework que se usó.

Un directorio llamado `billing/` dice más que uno llamado `controllers/`. El primero nombra una
responsabilidad del dominio. El segundo nombra un mecanismo técnico que podría pertenecer a
cualquier sistema. Cuando el nivel superior de un repo grita `payments`, `onboarding`,
`notifications`, tanto una persona como un agente ubican un cambio antes de leer una línea de
código.

Los árboles con forma de framework hacen lo contrario. Optimizan para la conveniencia del framework,
no para la comprensión del lector, y obligan a cada recién llegado a reconstruir el dominio desde
evidencia dispersa.

::diagram-tree
::

**Práctica.** Organiza el nivel superior por capacidad de dominio, no por capa técnica. Deja que el
framework viva un nivel más abajo, dentro de la capacidad a la que sirve.

**Ejemplo.**

```text
src/
  billing/          # el dominio en el nivel superior
    controllers/    # el framework vive un nivel más abajo,
    services/       # dentro del dominio al que sirve
    models/
  onboarding/
  payments/
# no: un nivel superior de controllers/ services/ models/ utils/
```

### 02 El contexto vive con el código

> El contexto embebido pertenece a cada frontera significativa, colocado junto a lo que describe, no
> exiliado a una wiki que se desactualiza.

La documentación que vive en otra parte se desactualiza en otra parte. El arreglo es la proximidad:
un `AGENTS.md` o `CLAUDE.md` en cada frontera, que dice qué hace esta parte, qué no debe hacer y
cómo trabajar dentro de ella. Como está pegado al código, se revisa en el mismo pull request,
envejece al mismo ritmo que el código y lo encuentra el mismo agente que está a punto de editarlo.

**Práctica.** Pon un `AGENTS.md`/`CLAUDE.md` en la raíz y en cada directorio que tenga una
responsabilidad distinta. Mantén cada uno corto y específico a su alcance.

**Ejemplo.**

```text
billing/
  AGENTS.md       # invariantes, trampas, propiedad de billing
  invoices/
  refunds/
```

### 03 La intención se vuelve mecanismo

> La intención se escribe como spec antes de que exista el código, y luego se vuelve mecanismo: el
> código y los chequeos que la hacen valer. La spec es andamiaje, no un artefacto permanente.

Una spec es la fuente de verdad en tiempo de diseño: le da al código contra qué contrastarse, y al
agente algo a lo que alinearse. Pero una vez que el código existe, una spec en prosa que solo lo
describe es una segunda fuente que puede divergir, y según la regla, una afirmación sin un mecanismo
detrás es solo documentación. Así que la spec se vuelve mecanismo: sus criterios de aceptación se vuelven
tests, sus contratos se vuelven tipos y schemas, sus convenciones se vuelven lint. Su intención
verificable queda forzada por algo que falla cuando el código diverge. Lo que queda es el porqué, lo
que el código no puede contener, y eso se mueve al contexto embebido (principio 02). Entonces la
spec se elimina, para que no pueda pudrirse. Solo sigue viva si es generativa: alimentando un loop
iterativo que sigue produciendo código y validación, atada a un mecanismo como la regeneración o los
contract tests.

**Práctica.** Escribe una spec antes de cualquier trabajo no trivial. A medida que el código
aterriza, vuélvela mecanismo: convierte los criterios de aceptación en tests, los contratos en tipos, las
convenciones en lint; mueve el porqué que sobrevive al `AGENTS.md` más cercano; luego borra la spec.
Mantén una en el repo solo si es generativa (codegen, configuración declarativa, un loop
spec-driven).

**Ejemplo.**

```text
# tiempo de diseño
specs/checkout-flow.md        # se escribe primero, se borra al volverse mecanismo
# después de volverse mecanismo
tests/checkout-flow.test.ts   # criterios de aceptación, ahora ejecutables
types/checkout.ts             # contratos, ahora forzados
billing/AGENTS.md             # el porqué que sobrevive a la spec
```

### 04 Las fronteras son explícitas y nombradas

> Cada módulo, paquete y línea de propiedad se nombra para que su responsabilidad sea inferible. Los
> nombres ambiguos son deuda arquitectónica.

Una frontera que no se nombra no se hace cumplir. `utils/`, `common/` y `helpers/` son donde la
responsabilidad va a morir: acumulan código no relacionado porque nada en el nombre lo resiste. Una
frontera nombrada (`pricing`, `auth`, `ingestion`) comunica una responsabilidad y presiona para
mantener fuera lo que no corresponde. Usadas con criterio no están prohibidas: un helper chico, sin
dependencias y sin hogar de dominio (un formateador de fechas, un tipo Result) vive legítimamente en
un `shared/`. La deuda es usar el nombre para esquivar la decisión de dónde va algo, hasta que la
carpeta se vuelve un cajón de sastre que crece sin límite.

**Práctica.** Nombra cada paquete y módulo por la responsabilidad que tiene. Cuando no puedas
nombrar una frontera con precisión, es señal de que la frontera está mal, no excusa para llamarla
`shared`. Reserva `shared`/`utils` para lo genuinamente genérico, y mantenlo chico.

**Ejemplo.**

```text
packages/
  pricing-engine/
  auth-session/
  event-ingestion/
# no: packages/core/  packages/lib/
```

### 05 Las convenciones se codifican, no son implícitas

> Una convención que vive solo en la cabeza de las personas es invisible para un agente. Codifícala
> en el linting y los tipos para que el toolchain pueda chequearla.

Las personas en un equipo transmiten las convenciones por ósmosis: code review, pairing, algún
suspiro de vez en cuando. El agente no recibe nada de eso. Una convención que no puede leer es una
convención que va a romper. La salida es sacar las convenciones de la cultura y meterlas en el
toolchain: reglas de lint, restricciones de tipos y checks de CI que enuncian la regla y la hacen
cumplir en el mismo lugar. Este principio es la primera instancia del mecanismo: es lo que cada otro
pilar invoca cuando necesita que sus afirmaciones se sostengan.

**Práctica.** Por cada «siempre lo hacemos así», pregúntate si un linter o el sistema de tipos puede
expresarlo. Si puede, codifícalo. El propio toolchain de este sitio usa `oxlint` con el plugin
`oxlint-tailwindcss` para lintear sus convenciones de CSS de forma que se chequeen
automáticamente.

**Ejemplo.**

```text
.oxlintrc.json    # la convención, escrita y aplicada
```

### 06 Las capacidades son descubribles

> Las herramientas, skills y comandos se documentan donde un agente los va a buscar, no donde una
> persona los archivó por casualidad.

Una capacidad que existe pero no se puede encontrar es, para un agente, una capacidad que no existe.
Archivar un script útil en una carpeta personal, o un comando de deploy en un README olvidado,
garantiza que se reimplemente o se omita. Ser descubrible significa poner las capacidades en la ruta
predecible y nombrarlas por lo que hacen.

**Práctica.** Expón las capacidades del proyecto (scripts, generadores, skills de agente) en
ubicaciones convencionales y nombradas. Prefiere los scripts de `package.json`, un directorio
`skills/` o comandos documentados antes que el boca a boca.

**Ejemplo.**

```text
scripts/
  deploy.sh
  seed-db.sh
package.json      # los "scripts" que un agente lee primero
```

### 07 El repo es legible en todo nivel de zoom

> Del árbol de archivos al cuerpo de la función, cada nivel de zoom comunica propósito. La
> legibilidad es fractal.

La legibilidad no es solo una propiedad del nivel superior. Un árbol claro con funciones opacas
adentro es legible en un zoom e ilegible en otro. La misma disciplina que nombra directorios debería
nombrar funciones, tipos y variables, para que la comprensión se degrade con gracia a medida que el
lector baja, sin caer por un acantilado en la frontera del archivo.

**Práctica.** Aplica la misma claridad de nombres y estructura en cada escala. El lector debería
poder dejar de hacer zoom en cualquier nivel y aun así saber dónde está.

**Ejemplo.**

```text
billing/refunds/issue-refund.ts
  → issueRefund(order, reason)   # propósito legible en la hoja
```

### 08 Optimiza para el recién llegado, y ahora el recién llegado es un agente

> La prueba más clara de una arquitectura es qué tan rápido un desconocido se vuelve productivo. Ese
> desconocido es cada vez más una máquina.

Todos los principios anteriores se reducen a una prueba: ¿qué tan rápido puede alguien que nunca vio
este codebase hacer trabajo correcto en él? Durante años ese alguien era una contratación nueva.
Ahora también es un agente invocado en frío, sin memoria de la sesión de ayer. Una arquitectura que
sirve al recién llegado en frío sirve a todos, y el agente es el recién llegado más exigente que
hay, porque no va a tapar tu ambigüedad con intuición.

**Práctica.** Haz del tiempo hasta el primer cambio correcto tu única métrica, y optimiza sin tregua
para ella.

**Ejemplo.**

```text
README.md         # grita la intención
AGENTS.md         # las reglas de la casa
specs/            # qué construir, antes de construirlo
```

## Las prácticas

Cada principio mapea a un artefacto concreto que puedes agregar a un repo hoy.

| Principio                                | Artefacto                                      |
| ---------------------------------------- | ---------------------------------------------- |
| La estructura grita la intención         | Directorios de primer nivel por dominio        |
| El contexto vive con el código           | `AGENTS.md` / `CLAUDE.md` por frontera         |
| La intención se vuelve mecanismo         | Se convierte en tests, tipos, lint          |
| Las fronteras son explícitas y nombradas | Paquetes nombrados; sin `utils`/`common`       |
| Las convenciones se codifican            | `oxlint`, restricciones de tipos, checks de CI |
| Las capacidades son descubribles         | `scripts/`, `skills/`, comandos documentados   |
| Legible en todo nivel de zoom            | Disciplina de nombres del árbol a la función   |
| Optimiza para el recién llegado          | `README` + `AGENTS.md` + `specs/` en la raíz   |

## El linaje

**Ancestro.** Screaming Architecture (Robert C. Martin, 2011). Context Architecture la hereda y la
extiende a la era de los agentes: la estructura ya no solo debe gritarle a un humano, sino a un
lector sin memoria.

**Mecanismos que adopta.** Spec-driven development (la intención escrita antes que el código) y TDD.
TDD es el ancestro espiritual de la regla: verifica que el código hace lo que dice. Context
Architecture generaliza esa idea del comportamiento a todo el contexto: **los tests verifican que el
código hace lo que dice; Context Architecture verifica que el repositorio dice la verdad sobre sí
mismo.**

**Vecinos en otras capas, distintos pero a los que habilita.** Context engineering (runtime: qué
entra a la ventana de contexto del modelo en cada momento) y harness engineering (operación: el
entorno donde corre el agente). Context Architecture no los absorbe. Se sienta debajo, en tiempo de
diseño, y les baja el trabajo. Una mejor Context Architecture significa menos que comprimir en
runtime y menos guardrails correctivos en el harness.

## Límites y costo

No es bala de plata, y decirlo es parte de la solidez.

**Aplica en:** refactors a escala, migraciones mecánicas, features con spec clara, generación de
tests, contribuciones donde el contexto ya existe.

**No aplica en:** problemas mal definidos, decisiones de producto, debugging sin contexto, el primer
prototipo de algo que aún no se entiende. El límite que lo resume: el agente no reemplaza el
criterio, lo amplifica donde el criterio ya está claro.

::callout{color="neutral"}
**El costo.** Trabajo de estructuración por adelantado, capas de verificación que son
código y hay que mantener, y un impuesto de disciplina en cada PR. Es una inversión que rinde en
proporción a cuánto trabajo de agentes o de varias personas absorbe el repositorio. En un proyecto
desechable, el peaje supera al retorno.
::

## Casos de estudio

Evidencia, con sobriedad.

En **Skyward** apliqué Context Architecture sobre el monorepo de la empresa; es donde más a fondo lo
probé. Una vez reestructurado para la legibilidad, sobre ese mismo codebase agentes de IA migraron el
toolchain de Biome + `tsc` a `oxlint` + `tsgo`, llevaron el sitio público de React Router a Nuxt y
construyeron features grandes a partir de specs. Cada uno de los cambios que normalmente
se ramifican por todo el codebase, acá salió bien, porque el codebase estaba hecho para entenderse:
con las convenciones codificadas y los checks en su lugar, un agente sabe de inmediato cuando algo
deja de funcionar.

**oxlint-tailwindcss** es un plugin nativo de `oxlint` que construí: el principio 05 hecho código.
Una convención de Tailwind que normalmente vive solo en la cabeza de la gente se vuelve reglas de
lint que el toolchain chequea. Lo usamos en todo el monorepo de Skyward, y su CTO lo
[respaldó públicamente](https://x.com/fforres/status/2044481779306823819){target="_blank" rel="nofollow noopener"}. Lo que aporta Context
Architecture viene antes: escribir la convención como reglas chequeables, en vez de dejarla
implícita, es la razón de que un plugin así pueda existir.

## Preguntas frecuentes

### ¿Qué es Context Architecture?

Context Architecture es la práctica de estructurar un codebase para que su intención y
comportamiento sean igual de legibles para personas y agentes de IA. Trata el repositorio (su árbol
de archivos, fronteras, convenciones y contexto embebido) como un artefacto diseñado.

### ¿Quién creó Context Architecture?

Sergio Azócar introdujo el término en octubre de 2025, mientras reestructuraba el monorepo de Skyward para la
legibilidad de personas y agentes de IA.

### ¿En qué se diferencia de context engineering?

Context engineering es un asunto de runtime: qué información entra a la ventana de contexto del
modelo en cada momento. Context Architecture es un asunto de diseño: cómo está estructurado el
codebase mismo. Uno diseña el contenido de la ventana; el otro diseña aquello que la ventana mira.

### ¿En qué se diferencia de harness engineering?

Harness engineering diseña el entorno donde opera el agente: el bucle de ejecución, las herramientas
y los guardrails. Context Architecture diseña el codebase sobre el que el agente opera. Una mejor
Context Architecture le baja el trabajo al harness.

### ¿Esto no es solo buena documentación?

No. La documentación es no verificada y se pudre en silencio. Context Architecture liga toda
afirmación de contexto a un mecanismo que falla cuando la afirmación deja de ser verdad. El contexto
con enforcement difiere de la documentación en categoría, no en grado.

### ¿Es de verdad una arquitectura?

Sí. Toma decisiones estructurales caras de revertir (dónde vive el contexto, cómo se nombran las
fronteras, qué se codifica), optimiza un atributo de calidad concreto (la legibilidad para personas
y agentes) y es verificable con fitness functions. Eso es operar al nivel arquitectónico.

### ¿Necesito herramientas especiales para aplicarlo?

No. Context Architecture es una disciplina de estructura, no un producto. `AGENTS.md`, specs,
fronteras nombradas y convenciones codificadas son prácticas que aplicas con las herramientas que ya
usas.

---
title: Cómo aplicar Context Architecture a un codebase existente
description: "Una guía práctica para reordenar un repositorio y dejarlo legible para personas y agentes de IA: léelo como alguien sin contexto, arregla los docs que mienten, pon AGENTS.md en las fronteras y respalda cada afirmación con un check. Una especificación de Sergio Azócar."
eyebrow: Guía
definition: Context Architecture se aplica a un codebase que ya existe, reordenándolo de a poco, nunca armando uno nuevo desde cero. Lees el repo como alguien sin contexto, arreglas la documentación que miente y respaldas cada afirmación que el repo hace sobre sí mismo con un check que falla cuando esa afirmación deja de ser verdad.
---

Un repo parte limpio y crece tres años. Las convenciones se separan. Los docs dejan de calzar con el
código. Los nombres de las carpetas te dicen qué framework armó la cosa, no qué hace la cosa.

Ahora pásaselo a un lector sin memoria: alguien en su primer día, o un agente de IA arrancado en frío.
Pídele un cambio. No puede saber qué significa nada, dónde va el cambio, ni cuál de dos patrones que
conviven es el actual. El repo creció. Nadie lo diseñó para que se pudiera leer.

Ese es el problema que esto arregla. La [especificación](/es) dice qué es Context Architecture y por
qué. Esta página es la parte que haces con las manos: cómo aplicarla a un repo que ya tienes.

El "ya tienes" importa. Un proyecto nuevo parte con la estructura que le da su framework, y este
problema todavía no existe. Aparece después, cuando el código crece más allá de lo que una persona
mantiene en la cabeza. Así que esto no es una forma de empezar un proyecto. Es una forma de arreglar
uno. No estás construyendo una ciudad nueva, le estás poniendo nombres a las calles de una que ya se
desparramó.

## Antes de empezar: ¿vale la pena?

Tiene un costo real. La reorganización inicial, los checks que son código que tienes que mantener en
verde, y un pequeño impuesto en cada pull request para que cada afirmación quede atada a un check.

Se paga en proporción a cuánto trabajo de agentes o de varias personas absorbe el repo. Vale la pena
en un codebase que aguanta refactors, migraciones, features con spec, contribuciones de agentes. No
vale la pena en un prototipo desechable ni en un problema que todavía no entiendes. Ahí el impuesto
cuesta más de lo que devuelve, y saltártelo es lo correcto. Decirlo en voz alta es parte de la
disciplina.

::callout{color="neutral"}
**El único lector para el que diseñar.** Asume un lector que no guarda nada entre sesiones y solo sabe
lo que el repo dice en voz alta. Un agente de IA es exactamente ese lector. Alguien recién llegado se
le acerca. Debajo de todo hay un solo número: cuánto demora ese lector en hacer un cambio correcto.
::

## El orden de operaciones

Hazlo de a poco. No detienes todo para reorganizar de una. Aterrizas un cambio acotado y reversible a
la vez, y cada uno llega con el check que mantiene honesta su afirmación. Nada de reescribir todo de
golpe.

El orden va de lo más barato y seguro a lo más caro:

1. Lee el repo como un lector en frío, y nombra los modos de falla con los que choques.
2. Arregla los docs que mienten.
3. Pon `AGENTS.md` en las fronteras de arriba.
4. Convierte el comentario que más repites en review en una regla de lint.
5. Desarma una carpeta cajón de sastre.
6. Haz que las capacidades se encuentren.
7. Avanza hacia una estructura por dominio, al final, y solo si se gana el costo de mover todo.
8. Conecta el bucle que evita que se vuelva a pudrir.

El resto de la guía es un paso por sección, y después un ejemplo completo.

## Paso 1: auditar el repo como un lector en frío

Abre el repo como si nunca lo hubieras visto y no recordaras nada. Lee el árbol de primer nivel, luego
las fronteras, luego un puñado de archivos hoja. En cada nivel, una pregunta: ¿podría hacer un cambio
correcto acá sin preguntarle a nadie? Cada "no" es un defecto que acabas de encontrar.

Los defectos vienen en cinco formas. Ninguno es culpa del modelo, y por eso un modelo mejor o un
prompt más astuto no arregla ninguno:

1. **Reimplementación.** La fuente de verdad no se podía encontrar, así que el lector reconstruye lo que ya existe.
2. **Estructura inventada.** No se impuso ninguna, así que el lector impone la suya.
3. **Obediencia a docs falsos.** Cita archivos borrados o contradice el código actual, con total confianza.
4. **Propagación de patrón obsoleto.** Copia el patrón más ruidoso aunque ese patrón esté muerto.
5. **Cara o sello con la ambigüedad.** Dos convenciones conviven, así que usa la que leyó primero.

Anota, por principio, un veredicto y la evidencia. Hazlo a mano, o carga el
[skill de Context Architecture](/es/skill) en tu agente y deja que escriba el informe.

**Cómo se ve esto.** En un servicio de pagos, la primera pasada encuentra la lógica de reembolsos
repartida en tres carpetas (una reimplementación esperando para ocurrir), un `README` que apunta a un
script de deploy borrado hace meses (docs falsos) y dos helpers de fecha con firmas distintas (un cara
o sello). Tres modos de falla nombrados antes de tocar una línea.

## Paso 2: arreglar el context-rot primero

Parte por hacer que los docs dejen de mentir. Un doc que cita un archivo borrado o contradice el código
es peor que no tener doc, porque un lector con confianza hace lo que dice.

Encuéntralo a mano o con un script: saca cada ruta de archivo, comando, símbolo y enlace de tu
`README`, tus archivos `AGENTS.md` y `CLAUDE.md`, y tus documentos de diseño, y verifica que cada uno
siga existiendo o siga corriendo. Arregla cada mentira contra lo que el código realmente hace hoy.

Después haz que el rot sea imposible de traer de vuelta. Agrega un test que afirme que cada ruta que
los docs citan sigue existiendo en disco. Ahora "este doc es preciso" es una afirmación con un check
detrás, en vez de un deseo.

**Cómo se ve esto.** El `README` documenta un `deploy.sh` que se borró hace un año. Sacas la referencia
muerta, escribes el comando real y agregas ese test de rutas. La próxima vez que alguien mueva un
archivo por debajo de un doc, la suite se pone roja en el mismo pull request, no en producción seis
semanas después.

## Paso 3: poner AGENTS.md en las fronteras de arriba

El contexto va junto al código que describe, en cada frontera que es dueña de algo. Puesto ahí,
envejece al mismo ritmo que el código y lo lee el mismo agente que está por editarlo. Empieza por la
raíz y los dos o tres directorios de más tráfico. Ahí cada `AGENTS.md` compra la mayor legibilidad.

Escribe solo lo que no puedes sacar leyendo el código: la fuente de verdad, los invariantes, la deuda
técnica que aceptaste a propósito, y el razonamiento que un spec dejó atrás. Mantén cada uno corto.

```markdown
# AGENTS.md (billing)

Dueño de la facturación, los reembolsos y el calendario de cobranza.

## Fuente de verdad
Los precios vienen del paquete `pricing-engine`, nunca hardcodeados acá.

## Invariantes
- Un reembolso nunca excede el monto capturado. Lo hace cumplir `refunds/guard.test.ts`.
- Todo el dinero es enteros en centavos, sin floats. Lo hace cumplir la regla lint `no-float-money`.

## Deuda técnica aceptada
La ruta legacy `chargeV1` se queda hasta la migración 2026-Q3. No la extiendas.
```

Mira los invariantes: cada uno nombra el check que lo hace cumplir. Ese es todo el punto. Un invariante
sin nada detrás es solo una línea nueva que se puede pudrir. Si el check todavía no existe, escríbelo en
el mismo cambio, o redacta la línea como un hueco conocido, no como una garantía.

## Paso 4: codificar la convención más repetida

Toma el comentario que más dejas en review, el que vive solo en la cabeza de tu equipo, y ponlo en la
cadena de herramientas. Una convención que un agente no puede leer es una convención que va a romper,
siempre.

Este es el movimiento en el que se apoyan los demás pasos. Cuando una afirmación tiene que sostenerse,
así se sostiene: una regla de lint que enuncia la convención y falla en el mismo lugar, o un tipo que
hace que lo incorrecto no compile.

**Cómo se ve esto.** El comentario que más dejas es "importa desde la raíz del paquete, no rutas
profundas". Hoy vive en la cabeza de quienes revisan, así que un agente lo rompe en su primer commit.

```text
# antes: una convención que vive en la cabeza de quienes revisan
"siempre importar desde la raíz del paquete, nunca rutas profundas"

# después: la convención, escrita y exigida
.oxlintrc.json   # una regla no-restricted-imports que falla la ruta profunda en CI
```

Una vez que la regla está en el linter, la ruta profunda falla al toque, con un mensaje que cita la
regla, no a quien revisó y justo estaba prestando atención ese día.

## Paso 5: nombrar una frontera de cajón de sastre

`utils/`, `common/`, `helpers/`, `core/`, `lib/`. Acá es donde la responsabilidad va a morir. Nada en el
nombre frena al código no relacionado, así que la carpeta crece para siempre. Elige la peor y divídela
en carpetas cuyos nombres digan, cada uno, de qué son dueñas.

```text
# antes
src/utils/        # 40 archivos no relacionados

# después
src/pricing/      # la matemática de precios que estaba escondida en utils
src/auth-session/ # los helpers de sesión que estaban escondidos en utils
src/shared/       # lo que es genuinamente genérico, chico y sin dependencias
```

El nombre está haciendo el trabajo. Una carpeta llamada `pricing` resiste el código que no es sobre
pricing, porque deja de calzar. Si no puedes nombrar una frontera con precisión, la frontera está mal, y
`shared` no es la respuesta. Un `shared/` chiquito para un formateador de fechas o un tipo result está
bien. La deuda es echar mano del nombre genérico para esquivar la pregunta de dónde va algo.

## Paso 6: hacer las capacidades descubribles

Una capacidad que un agente no puede encontrar es, para ese agente, una capacidad que no existe.
Simplemente la rehace, o la salta. Mueve tus scripts, generadores y comandos a lugares predecibles y
nombrados, y nómbralos por lo que hacen: scripts de `package.json`, un directorio `scripts/` o
`skills/`, comandos que de verdad escribiste.

Mejor todavía, genera la lista de capacidades a partir de esas rutas convencionales en vez de mantenerla
a mano, y testea que la lista esté completa. Una lista mantenida a mano es una afirmación más esperando
para pudrirse.

**Cómo se ve esto.** Tres scripts de deploy y de seed viven en el directorio personal de un ingeniero y
un hilo de Slack que nadie encuentra. Los mueves a `scripts/` con nombres que dicen qué hacen y los
listas en `package.json`. El siguiente agente los encuentra donde mira primero, en vez de escribir un
cuarto.

## Paso 7: avanzar hacia una estructura por dominio (al final)

El primer nivel debería decir qué hace el sistema, no qué framework lo armó: `billing/`, `onboarding/`,
`payments/`, no `controllers/`, `services/`, `utils/`. El framework vive un nivel más abajo, dentro del
dominio al que sirve.

Este es el movimiento caro y el más propenso a romper imports, así que va al final y va en tajadas. A
menudo un movimiento parcial más un `AGENTS.md` en la raíz que explica la estructura hacia la que migras
compra más legibilidad, por archivo movido, que reorganizar todo de una.

```text
# antes: organizado por capa técnica
src/
  controllers/   services/   models/   utils/

# después: organizado por dominio, el framework un nivel más abajo
src/
  billing/
    controllers/   services/   models/   # el framework, dentro del dominio al que sirve
  onboarding/
  payments/
```

Evita que se devuelva con una regla de lint que impide que el código de dominio se filtre a una carpeta
de capa, y mantén la estructura objetivo en el `AGENTS.md` raíz para que un lector que cae a mitad de la
migración sepa hacia dónde es adelante.

## Paso 8: instalar el metabolismo

La versión madura no solo revisa el contexto, lo alimenta. Un repo que se revisa a sí mismo no puede
pudrirse en silencio. Un repo que se alimenta a sí mismo absorbe conocimiento nuevo en el momento en que
se crea.

Una línea en el `AGENTS.md` raíz y en la checklist de review lo logra: cuando un pull request agrega una
fuente de verdad o un invariante, lo documenta en ese mismo pull request, con un check detrás. Ahora el
contexto crece con el sistema en vez de ir seis meses atrás.

## Un ejemplo completo, de principio a fin

Un servicio que empezó como una app de un framework y creció tres años. El árbol grita el framework, no
el producto, y el único doc es un `README` que está medio equivocado.

```text
# antes
src/
  controllers/      # 22 archivos, dominios mezclados
  services/         # 18 archivos, dominios mezclados
  models/
  utils/            # el cajón de sastre
  helpers/          # un segundo cajón de sastre
README.md           # apunta a un script de deploy borrado el año pasado
```

Pídele a un agente "agregar un flujo de reembolso parcial" acá y míralo chocar con tres de los cinco
modos de falla en una sola tarea: no encuentra dónde viven los reembolsos (repartidos entre
`controllers/`, `services/`, `models/`), rehace matemática de dinero que ya está en `utils/`, y sigue el
`README` hacia un script de deploy que ya no está.

El arreglo, en el orden de arriba, sin un solo commit de golpe:

1. **Context-rot.** Saca la referencia muerta al deploy del `README`, escribe el comando real, agrega un
   test de que cada ruta que el `README` y los `AGENTS.md` citan sigue existiendo.
2. **Contexto embebido.** Un `AGENTS.md` raíz (qué posee el servicio, la estructura hacia la que migra) y
   uno en el área de más tráfico.
3. **Codificar.** El comentario de review más repetido era "el dinero es enteros en centavos". Eso pasa a
   ser una regla lint `no-float-money`.
4. **Nombrar.** Divide `utils/` y `helpers/`: la matemática de dinero pasa a `money/`, el código de
   sesión a `auth-session/`, el resto genuinamente genérico se queda en un `shared/` chico.
5. **Descubrible.** Los scripts ad-hoc se mueven a `scripts/` con nombres reales, listados en
   `package.json`.
6. **Por dominio, en tajadas.** Mueve `refunds` primero: un `billing/refunds/` que mantiene juntos su
   controller, su service y su model. El siguiente agente que pregunte por reembolsos los encuentra en un
   solo lugar.

```text
# después
src/
  billing/
    AGENTS.md       # invariantes y la fuente de verdad de billing
    refunds/        # controller + service + model, juntos
    invoices/
  auth-session/
  money/            # la matemática que estaba enterrada en utils, ahora nombrada y exigida
  shared/           # chico, genérico, sin dependencias
scripts/            # nombrados, listados en package.json
AGENTS.md           # las reglas de la casa, y la estructura hacia la que se migra
README.md           # preciso, y un test lo mantiene así
```

Ahora la misma tarea aterriza en `billing/refunds/`, contra un `AGENTS.md` que enuncia el invariante del
reembolso, reutilizando el paquete `money/` al que la regla lint ya apunta. Los modos de falla no tienen
dónde ocurrir.

## Correrlo con el skill

El paso 1 y casi todos los movimientos de arriba son cosas que un agente puede correr. El
[skill de Context Architecture](/es/skill) es un solo archivo que cargas en tu agente: lee el repo como
un lector en frío, encuentra los docs que mienten y te devuelve el backlog en el orden de arriba.
Apúntalo a tu repositorio y empieza por lo que marca primero.

## Hacia dónde seguir

- La [especificación](/es): la regla, los cuatro pilares, el mecanismo y los ocho principios completos.
- La [comparación](/es/comparacion) con context engineering y harness engineering: qué capa diseña cada
  una, y por qué esta se sitúa debajo de ellas en tiempo de diseño.
- El [skill](/es/skill): para correr el trabajo con tu propio agente.
- El [glosario](/es/glosario): los términos que se usan en la especificación, definidos.

---
title: Context Architecture
description: "Context Architecture es una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea legible para el agente que escribe el código y para las personas que responden por él. Una especificación de Sergio Azócar."
eyebrow: Una especificación
definition: "Context Architecture es una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea legible para el agente que escribe el código y para las personas que responden por él, y esté atado a un mecanismo que falla cuando esa afirmación deja de ser cierta."
attribution: Introduje el término Context Architecture en octubre de 2025, mientras reestructuraba el monorepo de Skyward para la legibilidad de personas y agentes de IA. Publicado por primera vez en junio de 2026.
---

## La regla

Una arquitectura de software para agentes se reduce a una regla.

::rule
Toda afirmación que un repositorio hace sobre sí mismo debe estar ligada a un mecanismo que falla cuando esa afirmación deja de ser verdad.
::

Esa es toda la arquitectura. Lo demás es cómo se aplica.

La regla se evalúa sobre cualquier repositorio, afirmación por afirmación. Toma cada cosa que el repositorio sostiene sobre sí mismo (dónde vive la fuente de verdad, cuál es el patrón correcto, qué no se debe tocar) y pregunta si hay un compilador, una regla de linter, una prueba automatizada o un paso de revisión que se rompe cuando eso deja de ser cierto. Si no lo hay, es prosa, y la prosa se desactualiza en silencio.

Una afirmación es cualquier cosa que el repositorio sostiene sobre sí mismo, no solo la forma de sus carpetas. "Los precios se calculan en este módulo y en ningún otro" es una afirmación. "Esta operación responde dentro de cierto tiempo" es una afirmación. "Este formato de datos no se rompe para quienes ya lo usan" es una afirmación. Todas son del mismo tipo: algo que el repositorio promete, y que en algún momento puede dejar de ser cierto.

El mecanismo tiene que fallar de verdad, no solo existir. Una prueba de rendimiento que nunca ejercita la parte lenta no cumple la regla, la incumple. O la afirmación está atada a algo que se pone en rojo cuando se rompe, o no lo está.

La regla se aplica a sí misma. El conjunto de pruebas y reglas que verifican el repositorio es, a su vez, un conjunto de afirmaciones sobre el repositorio, así que también está atado a un mecanismo que falla si se debilita.

La arquitectura tiene que sostenerse con o sin una persona revisando el código. Cuando una persona revisa, los mecanismos hacen la revisión que esa persona haría a mano. Cuando no hay persona, los mecanismos son el revisor.

## El problema

Durante años la arquitectura optimizaba una cosa: cuánto tardaba un ingeniero nuevo en entender el código. El lector cambió. Hoy buena parte del código que llega a producción lo lee y lo escribe un agente.

Escribir código dejó de ser el cuello de botella. Los modelos escriben bien y se revisan a sí mismos cada vez mejor. El cuello se movió a verificar que un volumen creciente de cambios no rompe nada, a la velocidad a la que el agente los produce.

Una tasa de error chica, multiplicada por ese volumen y esa velocidad, sin un mecanismo que falle cuando una afirmación se viola, es ruptura silenciosa a escala. Toma dos formas. Con una persona revisando, la verificación no escala: el código se genera más rápido de lo que se puede leer, y termina aprobando lo que no alcanza a revisar. Sin una persona, un cambio que parece correcto se integra, porque nada falló cuando se violó una afirmación que solo vivía en prosa.

El trabajo de la arquitectura no es que el agente se equivoque menos. De eso se encarga el modelo, y cada vez mejor. El trabajo es que cada afirmación violada falle de inmediato, en el lugar donde se rompió, en vez de integrarse en silencio. Por eso el problema crece con mejores modelos en vez de desaparecer: cuanto más rápido y más autónomo el agente, más indispensable que el repositorio se verifique solo.

> Diseña para un lector que no recuerda nada entre sesiones y solo sabe lo que el repositorio dice en voz alta. Un agente lo cumple exacto. Una persona nueva lo aproxima.

## El espectro de autonomía

Context Architecture funciona con o sin una persona en el loop. Hoy lo normal es alguien orquestando al agente; cada vez más trabajo pasa a agentes corriendo solos. La arquitectura tiene que servir todo el rango.

| Nivel | Quién revisa | Qué se rompe sin disciplina del repositorio |
| --- | --- | --- |
| Inline | una persona aprueba cada edición | el agente reimplementa cosas que ya existen y la persona quema tiempo corrigiendo lo que las herramientas pudieron atrapar |
| Async | una persona revisa el cambio antes de integrarlo | la revisión no escala; el control de integración existe pero no exige nada, basta un clic para pasar un cambio |
| Autónomo | una persona define las reglas, no mira cada cambio | si faltan los mecanismos, la definición de "listo" es hueca: el agente da por terminado un cambio que pasa pero está mal |
| Orquestado | nadie en el medio | el error se multiplica a velocidad de máquina; lo único que arbitra son los mecanismos del repositorio |

Lo que cambia a través del espectro es quién consume la verificación, no la verificación. El mismo `AGENTS.md` y los mismos mecanismos sirven en una sesión interactiva, en un cambio que se revisa aparte y en un agente corriendo solo. Cuando hay una persona, los mecanismos absorben la revisión rutinaria, así la persona gasta su atención en lo que requiere criterio, no en re-chequear una convención. Cuando no hay persona, los mecanismos son el revisor.

## Cómo se aplica

Trabajar con un agente es un flujo continuo de cambios de código. La regla vive dentro de ese flujo, no aparte. Cada vez que un cambio introduce o modifica algo que el repositorio sostiene sobre sí mismo (una nueva fuente de verdad, una invariante, una convención), ese algo queda atado a un mecanismo en el mismo cambio. Y cada cambio que toca código existente se encuentra con los mecanismos que ya están ahí: si viola una afirmación, algo se pone en rojo antes de llegar a producción.

Por eso el contexto del repositorio crece con el sistema en lugar de quedarse atrás. No es un montaje que haces una vez, es una propiedad que se mantiene cambio a cambio. Cuando un cambio agrega una afirmación nueva y la deja suelta, la revisión, sea de una persona o de un agente, lo detecta y exige atarla antes de aceptar el cambio.

Atar una afirmación es conectarla a algo que falla cuando deja de ser cierta. Context Architecture nombra los tipos de mecanismo, no la herramienta:

- **El compilador** atrapa lo que se puede expresar en tipos: reintroducir una importación prohibida rompe la compilación.
- **El linter** atrapa problemas de estructura y de convención: un archivo en la carpeta equivocada falla el lint y cita la regla que incumple.
- **Las pruebas automatizadas** atrapan documentación que miente y comportamiento que se sale de lo esperado: un `AGENTS.md` que menciona un archivo borrado pone las pruebas en rojo.
- **La revisión**, de una persona o de un agente, atrapa lo que las otras no ven, el sentido: en cada cambio pregunta si quedó algún documento diciendo algo falso, y exige corregirlo en el mismo cambio.

El reparto con la infraestructura donde corre el agente es claro: Context Architecture decide qué se verifica y garantiza que el mecanismo existe y falla. La infraestructura lo ejecuta. Atar la afirmación es de la arquitectura; correr ese mecanismo en cada cambio es del entorno.

## Los principios

Cada principio es una propiedad que se puede comprobar, no una aspiración. O es cierta de tu repositorio y está atada a un mecanismo, o no lo está. Si no se puede atar a algo que falla, no es un principio.

### Que el repositorio diga lo que es

**01 · La estructura grita la intención.** El árbol de archivos dice qué hace el sistema, no qué framework lo construyó. Una carpeta `billing/` nombra una responsabilidad del negocio; una carpeta `controllers/` nombra un detalle técnico que podría ser de cualquier sistema. El framework vive un nivel más abajo, dentro del dominio que sirve. Así un lector ubica dónde va un cambio antes de leer una línea.
_Mecanismo: una regla de linter que da error cuando un archivo queda en una carpeta que no corresponde a su dominio._

::diagram-tree
::

**02 · El contexto vive con el código.** El contexto vive pegado al código que describe, en cada frontera importante, no en una wiki aparte que se desactualiza. Contiene solo lo que el código no puede decir por sí mismo: dónde está la fuente de verdad, qué invariantes hay que respetar, qué deuda técnica se aceptó a propósito, qué límites de comportamiento sostiene esa parte. Como está al lado del código, envejece a su ritmo y lo encuentra el mismo agente que va a editarlo.
_Mecanismo: una prueba que falla si un `AGENTS.md` menciona un archivo que ya no existe._

**03 · Las fronteras son explícitas y tienen nombre.** Cada módulo y paquete se nombra por la responsabilidad que tiene. Carpetas como `utils/`, `common/` o `helpers/` acumulan cualquier cosa, porque el nombre no descarta nada.

El código genuinamente compartido y sin dominio existe, y tiene lugar: un formateador de fechas, un tipo de resultado, un hook de interfaz reutilizable. Va en un `shared/` pequeño, sin dependencias hacia ningún dominio, y se mantiene chico. La deuda no es tener cosas compartidas, es usar el nombre genérico para no decidir dónde va algo que sí tiene dueño. Si no puedes nombrar una frontera con precisión, suele ser señal de que la frontera está mal trazada, no de que necesites otra carpeta genérica.
_Mecanismo: una regla que prohíbe que un módulo importe desde otra frontera por caminos no permitidos, y rompe la compilación cuando ocurre._

**04 · El repositorio es legible a cualquier escala.** La legibilidad no es solo del primer nivel, llega hasta el cuerpo de cada función. Puedes tener una raíz impecable, `billing/`, `payments/`, y tres carpetas más abajo un archivo `helpers.ts` con una función `process(data)` que no dice qué procesa ni qué devuelve. Ahí la legibilidad se cae. La misma disciplina que te hizo nombrar `billing/` en la raíz tiene que nombrar `applyLateFee(invoice)` en la hoja, y llamar `invoice` a lo que hoy es `data`.
_Mecanismo: reglas de linter sobre nombres y límites de complejidad._

**05 · Las capacidades se pueden descubrir.** Las herramientas, scripts y comandos del proyecto viven en lugares predecibles y con nombres que dicen lo que hacen: los scripts de `package.json`, una carpeta `scripts/`, una carpeta de skills. Una capacidad que existe pero que un agente no encuentra, para ese agente no existe: la vuelve a implementar desde cero.

La lista de capacidades no se escribe a mano, se genera a partir de esos lugares predecibles. Una lista escrita a mano es una afirmación más que se desactualiza: alguien agrega un script y olvida anotarlo. Una lista generada a partir de las carpetas convencionales no puede dejar fuera algo que está ahí, y si queda obsoleta, una prueba lo detecta y se pone en rojo.
_Mecanismo: la lista generada desde las rutas convencionales, y una prueba que falla si una capacidad real no aparece en ella._

### Atar cada afirmación a un mecanismo

**06 · La intención se convierte en mecanismo.** La intención se escribe como spec antes del código, luego se convierte en el código y en las pruebas y reglas que lo hacen cumplir, y la spec se borra cuando su contenido ya vive ahí. Lo que perdura es la intención y su verificación, no el código que la cumple: mientras las pruebas cerquen el comportamiento, ese código se puede volver a generar. Una spec se conserva solo si sigue generando algo (código, configuración); si no, se borra, para que no quede un segundo relato que se desactualiza.
_Mecanismo: las pruebas, los tipos y las reglas en que la spec se convirtió._

**07 · Las convenciones se codifican, no se sobreentienden.** Una convención que vive solo en la cabeza de la gente es invisible para un agente, y la va a romper. Sácala de la cultura y ponla en las herramientas que revisan el código: reglas de linter, restricciones de tipos, validaciones automáticas en CI que enuncian la regla y la hacen cumplir en el mismo lugar.
_Mecanismo: las reglas de linter y las restricciones de tipos._

**08 · El comportamiento se verifica, no se declara.** Toda afirmación sobre cómo se comporta el sistema (cuánto puede tardar una operación, qué datos no deben cruzar cierto límite, qué formato no se puede romper para quienes ya lo usan) está atada a una prueba automatizada que vive en el repositorio y se pone en rojo cuando el comportamiento se sale de lo prometido. Un límite de tiempo escrito en un documento se desactualiza; el mismo límite atado a una prueba que falla al excederlo es arquitectura. La prueba vive en el repositorio y corre antes de integrar el cambio. Si el sistema en producción además dispara una alerta cuando algo se degrada, eso ya es trabajo del entorno donde corre, no de la arquitectura.
_Mecanismo: una prueba automatizada de comportamiento (rendimiento, contrato de datos, seguridad) que vive en el repositorio y falla cuando el comportamiento se desvía._

**09 · La superficie de verificación también está atada.** El conjunto de pruebas y reglas que verifican el repositorio es, a su vez, un conjunto de afirmaciones sobre el repositorio, así que también está atado. Un agente puede reescribir el código libremente, pero no puede debilitar ni borrar una prueba, una regla o una validación para que un cambio pase. Sin una persona revisando, este es el principio que más importa: la forma más barata de hacer que una validación pase es eliminarla.
_Mecanismo: una validación que se pone en rojo si el conjunto de pruebas y reglas cambia sin la autorización que el repositorio definió._

## Lo que Context Architecture no hace

Una arquitectura honesta dice qué no es.

No es un sistema de aislamiento ni de permisos. El entorno aislado donde corre el agente, las conexiones de red que entran y salen, las credenciales y la identidad del agente son cosa de la infraestructura, no de la arquitectura del repositorio.

No es la maquinaria que ejecuta los controles. Las validaciones automáticas, la protección de ramas, los revisores obligatorios ya existen y se aplican igual sobre el cambio de un agente. Context Architecture decide qué deben comprobar, la infraestructura los corre.

No es cumplimiento normativo. Es agnóstica a las regulaciones. Que una empresa necesite la firma de una persona por una norma es decisión y problema de la empresa.

No impone herramientas. Nombra los tipos de mecanismo, el repositorio elige el producto. `oxlint` o `eslint`, da igual.

No hace al agente más inteligente ni arregla sus alucinaciones. Hace que la verdad del repositorio se pueda comprobar de forma automática, para que el error del agente falle de inmediato y donde ocurrió, en vez de integrarse en silencio.

## Límites y costo

No aplica en todos lados.

Aplica a repositorios que absorben trabajo de agentes o de varias personas: refactors a escala, migraciones, features con una spec clara. Aplica desde el primer commit (un repositorio puede nacer legible) y también sobre uno que creció sin diseño, que se reestructura en pasos, nunca de un golpe.

No lo apliques al primer prototipo de algo que todavía no entiendes, ni a un problema mal definido. Estructurar es una inversión que paga en proporción al trabajo que el repositorio absorbe. En un proyecto desechable, el costo supera al retorno.

Hay un costo: estructurar por adelantado, mantener las pruebas y reglas que son código y hay que cuidar, una disciplina extra en cada cambio. Pero ese trabajo es mecánico, bien especificado y repetitivo, que es justo lo que un agente hace bien. La persona escribe la intención y firma lo que decide firmar, el agente mantiene los mecanismos.

Context Architecture garantiza que una afirmación está atada a algo que falla, no que la afirmación sea la correcta ni que el mecanismo sea suficiente. Saber qué hay que afirmar sigue siendo criterio humano, el único recurso escaso que esta arquitectura no fabrica. Por eso el conjunto de verificaciones es la parte que más se revisa, no la que más se delega.

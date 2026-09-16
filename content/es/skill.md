---
title: El skill de Context Architecture, aplícalo con tu agente
description: "Un skill agnóstico de agente que audita un codebase contra los nueve principios de Context Architecture, encuentra las afirmaciones que no están atadas a un mecanismo y te devuelve un backlog de arreglos. Un comando lo instala en Claude Code, Cursor, Codex, Copilot y más. Por Sergio Azócar."
eyebrow: Skill
definition: "El skill de Context Architecture es un procedimiento agnóstico de agente que lee un repositorio como un lector en frío, lo audita contra los nueve principios, encuentra las afirmaciones que el repositorio hace sobre sí mismo que no están atadas a un mecanismo y te devuelve un backlog ordenado de arreglos. No necesita servidor. La instalación es un archivo que tu agente lee."
---

El skill es la especificación, convertida en algo que tu agente corre. Un archivo Markdown. Lo cargas,
lo apuntas a un repo, y lee el código como un lector sin memoria, lo audita contra los
[nueve principios](/es) y encuentra las afirmaciones que el repositorio hace sobre sí mismo que no
están atadas a un mecanismo que falla cuando dejan de ser ciertas. Después te devuelve el backlog en el
orden que arma la [guía](/es/guia).

Sin servidor, sin dependencia, sin herramientas especiales. Es un archivo que tu agente lee, que es el
principio 05 (Las capacidades son descubribles) aplicado al skill mismo.

## Qué hace

- **Audita** el repo contra los nueve principios y escribe un informe con un veredicto y la evidencia
  que lo respalda, uno por principio: qué afirmaciones están atadas a un mecanismo y cuáles son solo
  prosa.
- **Encuentra afirmaciones sueltas**: docs que citan archivos borrados, nombran módulos renombrados o
  contradicen el código, y convenciones que viven solo en prosa sin nada que falle cuando se rompen.
- **Propone un backlog**: cambios del tamaño de un PR ordenados por impacto, cada uno emparejado con el
  mecanismo (compilador, linter, prueba automatizada, revisión) que falla cuando su afirmación deja de
  ser cierta.
- **Redacta archivos `AGENTS.md`** en las fronteras, con solo lo que no puedes sacar del código.

Aplica desde el primer commit, así un repo puede nacer legible, y también sobre un repo que creció sin
diseño, reestructurado en pasos. Hace la misma auditoría en ambos casos.

## Instalarlo

Un comando cubre la mayoría de las herramientas, y un archivo cubre el resto. El skill está en el
formato estándar Agent Skills, así que casi cualquier agente lo lee una vez que está en la carpeta
correcta.

### Un comando

El [CLI `skills`](https://skills.sh) lee el skill desde el repo y lo instala en el agente que tengas:

```bash
npx skills add sergioazoc/context-architecture
```

Te pregunta en qué herramienta instalarlo. Pasa `-a <herramienta>` para elegir una (por ejemplo
`-a claude-code`), `-g` para instalarlo en todos tus proyectos, y `-y` para saltarte las preguntas.
Instala una copia canónica y enlaza cada agente a ella; pasa `--copy` si prefieres copias
independientes.

### La ruta portable

La mayoría de los agentes leen un skill desde `.agents/skills/<name>/SKILL.md`. Deja el archivo ahí a
mano y funciona en varias herramientas:

```bash
mkdir -p .agents/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .agents/skills/context-architecture/SKILL.md
```

Usa `~/.agents/skills/` para una instalación personal en todos tus proyectos. A septiembre de 2026 esa
ruta la leen Codex, Cursor, GitHub Copilot, Gemini CLI, Antigravity, Amp, OpenCode, Zed, Roo Code,
Kilo, Junie, Windsurf, goose, Warp y Factory. La carpeta debe llamarse como el skill
(`context-architecture`); la spec de Agent Skills exige que el nombre sea igual a la carpeta.

### Claude Code

```bash
npx skills add sergioazoc/context-architecture -a claude-code -g
```

A mano, guarda el archivo en una carpeta con el nombre del skill bajo `.claude/skills/`:

```bash
mkdir -p ~/.claude/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.claude/skills/context-architecture/SKILL.md
```

`~/.claude/skills/` es la instalación personal (todos los proyectos de esta máquina); usa
`.claude/skills/context-architecture/SKILL.md` dentro de un repo para acotarlo a un proyecto. Claude
Code toma el archivo en la sesión en curso; reinicia solo si la carpeta `.claude/skills/` no existía
cuando arrancó la sesión.

### GitHub Copilot

Copilot lee skills en el modo agente de VS Code y JetBrains, la CLI, el coding agent y la revisión de
código, desde `.github/skills/`, `.claude/skills/` o `.agents/skills/`. El nombre de la carpeta debe
ser igual al del skill, o Copilot no lo carga:

```bash
mkdir -p .github/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .github/skills/context-architecture/SKILL.md
```

### Herramientas con su propia carpeta de skills

Algunos agentes leen una ruta específica en vez de `.agents/skills/`: Cline (`.cline/skills/`), Kiro
(`.kiro/skills/`) y Qwen Code (`.qwen/skills/`). El layout es el mismo, una carpeta
`context-architecture/SKILL.md` bajo esa ruta. En una herramienta sin soporte de skills, apúntala al
archivo en crudo: Aider lo lee como `CONVENTIONS.md` con `aider --read CONVENTIONS.md`, y cualquier
herramienta puede tomar el archivo autocontenido pegado en sus instrucciones. El archivo en crudo
siempre está en:

```bash
curl -fsSL https://context-architecture.dev/skill.md
```

### Como plugin de Claude Code

El repo también es un marketplace de un solo plugin, así que Claude Code puede instalarlo y
actualizarlo como plugin:

```bash
/plugin marketplace add sergioazoc/context-architecture
/plugin install context-architecture@context-architecture
```

El skill queda como `/context-architecture:context-architecture`.

## Usarlo

Carga el skill y apunta tu agente a un repo:

> Aplica el skill de Context Architecture a este repositorio.

Escribe primero la auditoría, solo lectura, después el backlog ordenado. Trabájalo un cambio a la vez,
cada uno aterrizando con el mecanismo que falla cuando su afirmación deja de ser cierta. Empieza donde
te diga: las afirmaciones que son solo prosa, y los `AGENTS.md` de las fronteras de arriba. Ahí es
donde más recuperas por edición.

## Mantenerlo al día

Las actualizaciones viajan por la rama por defecto: un cambio le llega a alguien solo cuando se
mergea a `main` y se vuelve a deployar el sitio. Después, cómo lo bajas depende de cómo lo instalaste.

- **CLI `skills`**: corre `npx skills update context-architecture` (o `npx skills update` para todos;
  agrega `-g` para la instalación global). Refresca la copia canónica a la que cada agente enlaza.
- **Plugin de Claude Code**: corre `/plugin marketplace update context-architecture` para refrescar el
  catálogo, luego `claude plugin update context-architecture@context-architecture` para instalar la
  versión nueva, o habilita el auto-update del marketplace en `/plugin` (apagado por defecto en
  marketplaces de terceros). Cada release sube la versión, así que una versión sin cambios queda
  cacheada.
- **Instalación manual (`curl`)**: vuelve a correr el mismo `curl ... -o <ruta>` con el que
  instalaste; sobreescribe el archivo. Claude Code toma un archivo `.claude/skills/...` editado dentro
  de la sesión.

## Hacia dónde seguir

- La [especificación](/es): la regla, el loop, los tipos de mecanismo y los nueve principios.
- La [guía](/es/guia): el mismo trabajo, hecho a mano, paso a paso.
- El [glosario](/es/glosario): los términos que usa el skill, definidos.

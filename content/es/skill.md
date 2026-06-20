---
title: El skill de Context Architecture, aplícalo con tu agente
description: "Un skill agnóstico de agente que audita un codebase existente contra los ocho principios de Context Architecture, encuentra los docs que mienten y te devuelve un backlog de arreglos. Un comando lo instala en Claude Code, Cursor, Codex, Copilot y más. Por Sergio Azócar."
eyebrow: Skill
definition: "El skill de Context Architecture es un procedimiento agnóstico de agente que lee un repositorio existente como un lector en frío, lo audita contra los ocho principios, encuentra la documentación que miente y te devuelve un backlog ordenado de arreglos. No necesita servidor. La instalación es un archivo que tu agente lee."
---

El skill es la especificación, convertida en algo que tu agente corre. Un archivo Markdown. Lo cargas,
lo apuntas a un repo, y lee el código como un lector sin memoria, lo audita contra los
[ocho principios](/es) y te dice dónde ese lector tendría que adivinar. Después te devuelve el backlog
en el orden que arma la [guía](/es/guia).

Sin servidor, sin dependencia, sin herramientas especiales. Es un archivo que tu agente lee, que es el
principio 06 (Las capacidades son descubribles) aplicado al skill mismo.

## Qué hace

- **Audita** el repo contra los ocho principios y los cinco modos de falla, y escribe un informe con un
  veredicto y la evidencia que lo respalda, uno por principio.
- **Encuentra context-rot**: docs que citan archivos borrados, nombran módulos renombrados o
  contradicen el código.
- **Propone un backlog**: cambios del tamaño de un PR ordenados por palanca, cada uno emparejado con el
  check (lint, tipos, test, revisión) que mantiene honesta su afirmación.
- **Redacta archivos `AGENTS.md`** en las fronteras, con solo lo que no puedes sacar del código.

Funciona sobre código que ya existe y creció desordenado. No arma proyectos nuevos desde cero.

## Instalarlo

Un comando cubre la mayoría de las herramientas. El [CLI `skills`](https://skills.sh) lee el skill
desde el repo y lo deja en el agente que tengas:

```bash
npx skills add sergioazoc/context-architecture
```

Te pregunta en qué herramienta instalarlo. Pasa `-a <herramienta>` para elegir una (por ejemplo
`-a claude-code`), `-g` para instalarlo en todos tus proyectos, y `-y` para saltarte las preguntas. Las
secciones por herramienta de abajo cubren el camino manual, por si prefieres dejar el archivo tú mismo
o tu herramienta no está en su lista.

### Claude Code

```bash
npx skills add sergioazoc/context-architecture -a claude-code -g
```

A mano, sin Node: guarda el archivo en una carpeta con el nombre del skill, luego reinicia Claude Code.
El nombre de la carpeta es lo que escribes como el comando `/context-architecture`, así que déjalo
exactamente así.

```bash
mkdir -p ~/.claude/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.claude/skills/context-architecture/SKILL.md
```

Quita el `~/.claude` para una instalación personal; usa `.claude/skills/context-architecture/SKILL.md`
para acotarlo a un solo proyecto.

### Cursor

Guárdalo como una regla de proyecto. La extensión `.mdc` importa, un `.md` plano en esa carpeta se
ignora:

```bash
mkdir -p .cursor/rules
curl -fsSL https://context-architecture.dev/skill.md -o .cursor/rules/context-architecture.mdc
```

El `description` del frontmatter le dice a Cursor que traiga la regla cuando es relevante.

### GitHub Copilot (VS Code)

VS Code lee Agent Skills de forma nativa, el mismo formato `SKILL.md`. La carpeta debe llamarse como el
skill, o Copilot no lo carga:

```bash
mkdir -p .github/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .github/skills/context-architecture/SKILL.md
```

En JetBrains, o en un Copilot viejo sin skills, pega el archivo en `.github/copilot-instructions.md`.

### OpenAI Codex

```bash
mkdir -p ~/.agents/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.agents/skills/context-architecture/SKILL.md
```

Usa un `.agents/skills/context-architecture/SKILL.md` local para acotarlo a un repo. Reinicia Codex si
no toma el skill.

### Otras herramientas

La misma idea: el archivo va donde la herramienta lee sus reglas.

- **Windsurf**: `.windsurf/rules/context-architecture.md`. Si Windsurf se queja por el tamaño, apúntalo
  al archivo en vez de pegar todo.
- **Cline**: `.clinerules/context-architecture.md`.
- **Zed**: agrégalo a tu `AGENTS.md`, que Zed lee. Un archivo `.rules` suelto puede tapar uno existente,
  así que agregarlo al `AGENTS.md` es más seguro.
- **Aider**: guárdalo como `CONVENTIONS.md`, luego corre `aider --read CONVENTIONS.md`.

### Cualquier otro agente

Toma el archivo en crudo y pégalo en las instrucciones de tu herramienta, o apúntala a él:

```bash
curl -fsSL https://context-architecture.dev/skill.md
```

Es autocontenido. Reenuncia la regla, los ocho principios y los cinco modos de falla, así que funciona
sin vuelta a este sitio.

## Usarlo

Carga el skill y apunta tu agente a un repo:

> Aplica el skill de Context Architecture a este repositorio.

Escribe primero la auditoría, solo lectura, después el backlog ordenado. Trabájalo un cambio a la vez,
cada uno aterrizando con el check que evita que su afirmación se pudra. Empieza donde te diga: los docs
que mienten, y los `AGENTS.md` de las fronteras de arriba. Ahí es donde más recuperas por edición.

## Hacia dónde seguir

- La [especificación](/es): la regla, los cuatro pilares, el mecanismo y los ocho principios.
- La [guía](/es/guia): el mismo trabajo, hecho a mano, paso a paso.
- El [glosario](/es/glosario): los términos que usa el skill, definidos.

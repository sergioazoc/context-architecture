# context-architecture.dev

The canonical site for **Context Architecture**: a software architecture for the age of AI agents. It
structures a repository so everything it claims about itself, its structure, its behavior, and who can
change it, is legible to the agent writing the code and to the people who answer for it, and bound to a
mechanism that fails when the claim stops being true. Introduced by
[Sergio Azócar](https://sergioazocar.com) in October 2025.

This repository is its own first case study. If you arrived here from the manifesto to check whether
the author structures projects the way he argues for, this README and the `AGENTS.md` files are the
answer. The structure is the argument.

## What this is

A small, dense, prerendered specification site. Not a product landing page. It reads as an RFC:
typography, structure, and almost nothing else.

- **Two readers, one source.** Every page can be read as a typeset document (person view) or as the
  raw Markdown an agent consumes (agent view). Both come from the same `.md` file. The site
  demonstrates its own thesis.
- **Static by design.** Fully prerendered (SSG); all content is in the served HTML, with no
  dependency on JavaScript for crawlers and LLMs to read it.

## Apply it

Context Architecture applies both to a repository born legible from the first commit and to one that
already grew without design. To apply it:

- Read the [specification](https://context-architecture.dev) and the
  [step-by-step guide](https://context-architecture.dev/guide).
- Install the agent skill into your tool with one command, `npx skills add sergioazoc/context-architecture`
  (Claude Code, Cursor, Codex, Copilot, and more), or copy
  [`skills/context-architecture/SKILL.md`](./skills/context-architecture/SKILL.md) / fetch the raw file at
  [`context-architecture.dev/skill.md`](https://context-architecture.dev/skill.md). The
  [skill page](https://context-architecture.dev/skill) has per-tool steps.

## Structure

The top level screams what the project _is_, not which framework built it:

```text
content/            # the manifesto: source of truth, one file per locale
  en/  es/          # /, /comparison, /guide, /glossary, /skill
app/
  pages/            # one file per route; queries content, renders it
  components/       # layout shell, person/agent toggle, MDC blocks (rule, diagrams)
  composables/      # site metadata, structured data (manifesto + glossary schema)
  app.config.ts     # Nuxt UI theme: palette + prose reading typography
  assets/css/       # design tokens + global base (UI strings live in each component's <i18n>)
skills/             # the distributable skill (context-architecture/SKILL.md)
server/             # one prerendered route: /skill.md serves the raw skill
```

Specs are design-time only (principle 06): written before code, turned into code, tests, and the
relevant `AGENTS.md`, then removed. The site's own spec was already turned into the files above, so
there is no `specs/` directory to keep.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Quality

Conventions are codified, not tribal (principle 07). The CSS conventions are machine-checked by
`oxlint` with the `oxlint-tailwindcss` plugin:

```bash
pnpm lint         # oxlint + oxlint-tailwindcss
pnpm typecheck    # vue-tsc
pnpm test         # vitest: the repo's claims about itself, bound
pnpm format       # oxfmt
```

## Build & deploy

Static generation, deployed to Cloudflare Workers as static assets:

```bash
pnpm generate     # prerender to .output/public
pnpm deploy       # generate && wrangler deploy
```

## License

- **Manifesto content** (`content/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/),
  see [`LICENSE`](./LICENSE).
- **Code**: MIT.

The nine principles in the manifesto are the author's methodology.

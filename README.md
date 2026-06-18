# context-architecture.dev

The canonical site for **Context Architecture** — the practice of structuring a codebase so that its
intent and behavior are equally legible to people and AI agents. Introduced by
[Sergio Azócar](https://sergioazocar.com) in October 2025.

This repository is its own first case study. If you arrived here from the manifesto to check whether
the author structures projects the way he argues for, this README and the `AGENTS.md` files are the
answer. The structure is the argument.

## What this is

A small, dense, prerendered specification site. Not a product landing page. It reads as an RFC:
typography, structure, and almost nothing else.

- **Two readers, one source.** Every page can be read as a typeset document (person view) or as the
  raw Markdown an agent consumes (agent view). Both come from the same `.md` file — the site
  demonstrates its own thesis.
- **Static by design.** Fully prerendered (SSG); all content is in the served HTML, with no
  dependency on JavaScript for crawlers and LLMs to read it.

## Structure

The top level screams what the project _is_, not which framework built it:

```text
content/            # the manifesto — source of truth, one file per locale
  en/  es/
app/
  pages/            # routes: / (manifesto) and /comparison
  components/       # layout shell, person/agent toggle, MDC blocks (rule, diagrams)
  composables/      # site metadata, structured data
  app.config.ts     # Nuxt UI theme: palette + prose reading typography
  assets/css/       # design tokens + global base (UI strings live in each component's <i18n>)
```

Specs are design-time only (principle 03): written before code, discharged into code, tests, and the
relevant `AGENTS.md`, then removed. The site's own spec has already been discharged, so there is no
`specs/` directory to keep.

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Quality

Conventions are codified, not tribal (principle 05). The CSS conventions are machine-checked by
`oxlint` with the `oxlint-tailwindcss` plugin:

```bash
pnpm lint         # oxlint + oxlint-tailwindcss
pnpm typecheck    # vue-tsc
```

## Build & deploy

Static generation, deployed to Cloudflare Workers as static assets:

```bash
pnpm generate     # prerender to .output/public
pnpm deploy       # generate && wrangler deploy
```

## License

- **Manifesto content** (`content/`): [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) —
  see [`LICENSE`](./LICENSE).
- **Code**: MIT.

The principle set in the manifesto is a working draft of the author's methodology; see the IP note
in `content/en/index.md`.

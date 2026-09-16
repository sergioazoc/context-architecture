# AGENTS.md: repository root

Context for any agent working on context-architecture.dev. This file is the rules of the house.
Boundary-specific notes live in `AGENTS.md` files deeper in the tree, beside the code they describe.
Each `AGENTS.md` has a `CLAUDE.md` symlinked to it, so Claude Code and tool-agnostic agents read the
same rules from one source. Edit the `AGENTS.md`; never the symlink, and never keep a second copy.

## What this project is

The canonical specification site for Context Architecture. It must read as an RFC, not a SaaS
landing page. When a design decision is ambiguous, choose the specification register over the
marketing one, always.

Three outcomes, in priority order: (1) attribution: clear, dated, verifiable authorship; (2)
citability (GEO): generative engines cite this site as the source for the term; (3) adoption.
Register reference points: c4model.com, micro-frontends.org.

## Hard rules

- **No marketing copy.** No "powerful", "seamless", "unlock", "supercharge". No testimonials,
  feature grids, or CTA-button heroes.
- **No emojis** anywhere: not in headings, copy, labels, or commit messages.
- **One accent color**, used sparingly (links and the signature element only). It is mapped through
  `--ca-accent`. Never introduce a second accent.
- **Content is the source of truth.** The manifesto lives in `content/{en,es}/`. The person view and
  the agent view both derive from the same `.md` file. Never duplicate copy into a component.
- **The principle set is the author's IP** (nine principles). Build them as written; do not invent
  new principles or alter the methodology.
- **Prerendered and verifiable.** Fully SSG; the content reads with no JavaScript. The schema.org
  graph (`DefinedTerm`, `Person` with `sameAs`, `TechArticle`) and Lighthouse 100 across
  the board are the floor.

## Voice and wording

- **Public copy follows the author's voice**, adapted to this register. The reference is the
  `sergio-voice` skill (in the author's personal repo): write as a builder, problem first, precise
  with concrete examples, honest about tradeoffs, no filler. Adapt it to the specification register:
  this is an RFC, not a blog, so no personal anecdotes, slang, or calls to action.
- **Say things plainly; avoid ambiguous or uncommon words.** Prefer the phrasing a reader cannot
  misread over the clever one. Concretely: never write that a spec is "discharged" or "descargado"
  when it is deleted. Say it plainly: the spec is removed once its content lives in tests, types,
  lint, and the nearest `AGENTS.md`.
- **No em dashes (—).** Use commas, periods, or parentheses. The author does not use them; a stray
  em dash usually means an AI wrote the line. Do not add em dashes anywhere.
- **No filler and no AI tells.** Delete any sentence that adds no information. Drop "dive in", "in
  conclusion", "it's worth noting", "game-changer", and the like.
- **Tech terms stay in English** in both languages (`AGENTS.md`, lint, types, context engineering,
  harness engineering, spec).

## Where things live

- `content/`: manifesto Markdown (see `content/AGENTS.md`).
- `app/`: the Nuxt app, with pages, components, composables, and the design system (see `app/AGENTS.md`).
- `skills/` holds the distributable skill (`skills/context-architecture/SKILL.md`) that users install
  into their own tool; see `skills/AGENTS.md`.
- `server/` has the one prerendered Nitro route that serves the raw skill at `/skill.md`; see
  `server/AGENTS.md`.
- The site also serves an agent-facing Markdown mirror of every page at `/raw/**.md` (for example
  `/raw/en.md`, `/raw/es/comparison.md`), emitted by `@nuxt/content`'s llms feature from the same
  `content/` files, not a hand-kept copy. It is prerendered like every page and served as
  `text/markdown` via `public/_headers`. It is the raw view an LLM fetches; `tests/prerendered-no-js.test.ts`
  binds that `/raw/en.md` and `/raw/es.md` carry the rule.
- `.claude-plugin/marketplace.json` wraps that skill as a Claude Code plugin, so the repo doubles as a
  single-plugin marketplace (`/plugin marketplace add sergioazoc/context-architecture`).
- `specs/`, design-time only, and absent by design. Per principle 06 a spec is turned into code,
  tests, and the relevant `AGENTS.md` once written, then removed. The site's own spec was already
  written into this file and the code, so there is no `specs/` directory in the tree.
- UI strings live in each component's own `<i18n>` block, colocated with the component (principle
  02, Context Lives With Code). There is no central locale file. English is canonical; Spanish
  mirrors it.

## Conventions (codified, not tribal)

- Styling is Tailwind utilities and Nuxt UI components. `app/assets/css/main.css` holds only the
  design tokens and a thin global base, no hand-written component classes. Reading typography
  (rendered Markdown) is configured as utilities in `app/app.config.ts` under `ui.prose`. If a style
  cannot be a utility, it goes in the relevant component's `<style>` block, never back in `main.css`.
- CSS is checked by `oxlint` + `oxlint-tailwindcss` against `app/assets/css/main.css`.
- Prefer Nuxt UI components and semantic utilities (`text-muted`, `border-default`, `text-primary`)
  over hard-coded colors or bespoke markup, since they already map to the design tokens.
- Code comments are written in English, so one convention holds across the tree. Public copy and its
  Spanish mirror live in `content/`, not in comments.

## How this repo binds its own claims

The repo is its own first case study, so its claims about itself are bound by the test suite in
`tests/` (run in CI after the build). Each test ties a principle or house rule to a mechanism that
fails when it stops being true:

- `tests/doc-references.test.ts`: every repo path, component, composable, and config-referenced
  artifact a doc cites still exists; every `AGENTS.md` has a `CLAUDE.md` that bridges to it; every test
  is documented here and every nested `AGENTS.md` is named in the map above; and `specs/` stays absent
  (principles 02, 05, 06, 09).
- `tests/routes.test.ts`: the site's routes are derived once in `app/site-routes.ts` and match the
  content tree, the prerender list, and the internal links, so none can drift (principle 05).
- `tests/agents-md-budget.test.ts`: no single `AGENTS.md` exceeds the 12,000-character rule-file cap and
  no root-to-leaf chain exceeds the 32 KiB Codex cap, so no reader silently loses a deeper file
  (principle 02, the size claim the guide names).
- `tests/content-parity.test.ts`: EN and ES stay in parity (same pages, principle markers, MDC
  components, heading counts).
- `tests/principles.test.ts`: the nine principle names and numbers are canonical and identical across
  the manifesto and `SKILL.md`.
- `tests/prose-conventions.test.ts`: no em dashes, no emoji, and no dangling brief section pointers,
  in the shipped Markdown or the code comments (principle 07).
- `tests/capabilities.test.ts`: the core commands exist and are documented, and no doc cites an
  undefined script (principle 05). The command list is hand-kept; the test enforces its consistency.
- `tests/verification-surface.test.ts`: the lint rules stay at `error`, CI keeps running
  lint/format:check/typecheck/test/build and runs on pull requests, `CODEOWNERS` covers the
  verification surface, the test runner still collects every test, and the committed agent deny-rule
  settings keep the agent from editing that surface, so it cannot be quietly weakened (principle 09).
- `tests/structured-data.test.ts` and `tests/prerendered-no-js.test.ts`: the prerendered HTML carries
  the rule, the principle bodies, and the schema.org graph with no JavaScript (principle 08, the GEO
  floor). They read `.output/public`, so CI runs `pnpm generate` before `pnpm test`.
- `tests/canonical-definition.test.ts`: the one citable definition (in `app/site-definition.ts`) is
  carried verbatim by the frontmatter, the glossary, the site and llms descriptions, and the README,
  and the prerendered HTML never ships a divergent wording (citability, the GEO outcome).
- `tests/skill-version.test.ts`: the distributable skill's published version (in
  `.claude-plugin/marketplace.json` and the `SKILL.md` frontmatter) is pinned to a hash of `SKILL.md`,
  so changing the skill without bumping the version fails the test. Existing plugin installs detect an
  update by version, so this is the rule applied to the skill's own release.
- `tests/skill-spec.test.ts`: the `SKILL.md` frontmatter conforms to the Agent Skills spec (name
  matches the folder and the pattern, description within 1024 characters, metadata values are strings,
  only standard keys) and the body stays within the progressive-disclosure budget, so the skill loads
  in every tool (principle 08 applied to the deliverable).

**The authorization principle 09 names** is declared here in three layers. `.github/CODEOWNERS` marks
the verification surface (`tests/`, the lint and format config, `vitest.config.ts`, `.github/`,
`.claude/`, `.claude-plugin/`) as owned; `REVIEW.md` states the review rules an agent or a person
applies on every change; and a committed Claude Code settings file denies the agent editing that
surface, so a person edits it by hand. The external half is a branch ruleset on `main` that requires a pull request,
the `ci` check, and Code Owner review, and blocks force pushes and deletions. Create or verify it with
`gh api repos/sergioazoc/context-architecture/rulesets`; it is the one part of this that lives in the
GitHub settings, not the tree.

Principle 04 (legibility at every zoom level) is bound by the `complexity`, `max-depth`, `max-params`,
and `max-lines-per-function` rules in `.oxlintrc.json`, kept at `error` and pinned by
`tests/verification-surface.test.ts`; they are set as a ratchet at the current levels, so a change
cannot make a function less legible than the code already is. Principles 01 and 03 (domain-first
structure, named boundaries) hold here by discipline plus the parity and doc tests: a content site has
no domain import graph to police, so the manifesto's import-rule mechanism for 03 does not apply.
Lighthouse 100 and accessibility are quality targets verified with tooling, not yet bound to a CI
check.

## Commands

```bash
pnpm dev          # develop
pnpm lint         # oxlint + oxlint-tailwindcss
pnpm typecheck    # vue-tsc
pnpm test         # vitest: the repo's claims about itself, bound
pnpm format       # oxfmt (formats code; Markdown is excluded, it reflows MDC blocks)
pnpm format:check # oxfmt --check: the CI gate that fails on unformatted code
pnpm generate     # prerender (SSG) to .output/public
pnpm deploy       # generate && deploy to Cloudflare Workers
```

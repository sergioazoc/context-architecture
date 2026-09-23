# AGENTS.md: content/

The manifesto. This is the source of truth for both reader and agent: the person view is this
Markdown rendered; the agent view is this Markdown raw. Edit the meaning here, once.

## Layout

```text
content/
  en/index.md         # the manifesto (canonical)
  en/comparison.md    # Context Architecture vs. the adjacent disciplines
  en/guide.md         # how to apply it (greenfield and brownfield)
  en/glossary.md      # the term and the adjacent terms, defined
  en/skill.md         # the skill page (per-tool install)
  es/...              # Spanish mirror, same files, faithful translation
```

Paths map by directory and locale strategy. English is canonical and served with no prefix, so
`en/index.md` -> `/` and `en/comparison.md` -> `/comparison`. Spanish is the mirror under `/es`, and
its pages use the localized slug declared in `i18n.pages` (nuxt.config), so `es/index.md` -> `/es`
and `es/comparison.md` -> `/es/comparacion`. Pages query the collection by the active locale. The
route map is derived once in `app/site-routes.ts` and consumed by both the router and the prerender
list, so it cannot drift from the content tree.

## Rules

- **Frontmatter carries the citable facts.** `definition` and `attribution` are rendered in the hero
  and exposed to SEO/schema. Keep the definition self-contained and quotable, generative engines
  extract it verbatim. The `definition` must match `CANONICAL_DEFINITION` in `app/site-definition.ts`
  word for word, and the `description` (the meta description) must include the mechanism clause, or it
  is not the citable definition. `tests/canonical-definition.test.ts` binds both.
- **The rule is canonical.** The invariant in `## The rule` is a quotable fact, like the definition.
  Keep it verbatim per locale and mirrored in `llms.txt` (nuxt.config) and the schema. Do not add a
  slogan or tagline beside it.
- **The manifesto uses MDC components.** `::rule`, `::diagram-tree`, and `::diagram-layers` (used by
  `comparison.md`) live in `app/components/content/`; `::callout` is Nuxt UI's prose callout (use
  `color="neutral"`), themed in `app/app.config.ts`. The person view renders them; the agent view
  shows their raw MDC source from the same `.md`. Block syntax must be multi-line (`::name` and the
  closing `::` each on their own line) or it renders as literal text.
- **Headings are the table of contents.** `##` is a section, `###` is a principle. Each gets an `id`
  and a TOC entry, so heading text must stand alone.
- **Parity.** Any change to an English file must be mirrored in its Spanish counterpart, keeping the
  specification register (neutral Spanish, technical terms left in English where idiomatic: context
  engineering, harness engineering). `tests/content-parity.test.ts` binds the dimensions: same pages,
  MDC components, heading count, mechanism markers, table rows, fenced blocks, internal links, code
  spans, and frontmatter keys per page. A paragraph or a mechanism line dropped in translation fails
  the suite.
- **The nine principles are the author's IP.** Build them as written; do not invent new principles,
  reword the rule, or alter the methodology.
- **Stay qualitative.** No performance figures attributed to Context Architecture; any speed gain
  belongs to the specific tooling, not to the discipline. Confirm any figure with the author.
  Third-party findings may be cited with their source and date (for example the AGENTS.md studies in
  "The problem"), never as a result of Context Architecture itself.
- **Voice and wording.** Follow the repository voice rules in the root `AGENTS.md`: plain,
  unambiguous wording (never "discharge"/"descargar" for removing a spec; say it is removed), no em
  dashes, no filler, tech terms in English. Public pages read in the author's voice within the
  specification register.

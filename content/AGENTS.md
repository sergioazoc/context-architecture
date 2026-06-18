# AGENTS.md — content/

The manifesto. This is the source of truth for both reader and agent: the person view is this
Markdown rendered; the agent view is this Markdown raw. Edit the meaning here, once.

## Layout

```text
content/
  en/index.md         # the manifesto (canonical)
  en/comparison.md    # Context Architecture vs. the adjacent disciplines
  es/index.md         # Spanish mirror — same structure, faithful translation
  es/comparison.md
```

Paths map by directory: `en/index.md` -> `/en`, `es/comparison.md` -> `/es/comparison`. Pages query
the collection by the active locale.

## Rules

- **Frontmatter carries the citable facts.** `definition` and `attribution` are rendered in the hero
  and exposed to SEO/schema. Keep the definition self-contained and quotable — generative engines
  extract it verbatim.
- **The rule and slogan are canonical.** The invariant in `## The rule` and its slogan are quotable
  facts, like the definition. Keep them verbatim per locale and mirrored in `llms.txt` (nuxt.config)
  and schema.
- **The manifesto uses MDC components.** `::rule`, `::diagram-tree`, `::diagram-metabolism`, and
  `::diagram-layers` (used by `comparison.md`) live
  in `app/components/content/`; `::callout` is Nuxt UI's prose callout (use `color="neutral"`),
  themed in `app/app.config.ts`. The person view renders them; the agent view shows their raw MDC
  source from the same `.md`. Block syntax must be multi-line (`::name` and the closing `::` each on
  their own line) or it renders as literal text.
- **Headings are the table of contents.** `##` is a section, `###` is a principle or a question.
  Each gets an `id` and a TOC entry, so heading text must stand alone.
- **Parity.** Any change to an English file must be mirrored in its Spanish counterpart, keeping the
  specification register (neutral Spanish, technical terms left in English where idiomatic: context
  engineering, harness engineering).
- **Do not finalize the principles.** Their names and one-line statements are a working draft of the
  author's methodology (see the IP note in `en/index.md`).
- **The case studies are qualitative.** No performance figures in the prose: the speed numbers
  belong to the tooling, not to Context Architecture. External corroboration is the linked tweet from
  Skyward's CTO. If you ever add a figure, attribute it to what produced it and confirm it with the
  author.

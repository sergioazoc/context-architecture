# AGENTS.md: app/

The Nuxt application: presentation only. Meaning lives in `content/`; this directory decides how it
looks and behaves.

## Boundaries

```text
app/
  pages/            # one file per route; queries content, renders it
  components/       # SiteHeader, SiteFooter, DocHero, DocShell, ViewToggle
  components/content/   # MDC components usable from Markdown (Rule, diagrams)
  composables/      # useSiteMeta, useManifestoSchema, useGlossarySchema
  app.config.ts     # Nuxt UI theme: palette + ui.prose reading typography
  assets/css/main.css   # design tokens + global base only
```

Components are built on Nuxt UI primitives, not bespoke markup: `UHeader`/`UFooter` (shell),
`UPage` + `UContentToc` (doc layout and the table of contents with its built-in scroll-spy),
`UFieldGroup` (the ViewToggle), `UColorModeButton` (theme switch). Reach for a Nuxt UI component
before writing your own.

## Rules

- **Tokens first.** All color, type scale, radius, and spacing come from the `--ca-*` tokens in
  `main.css`, mapped onto Nuxt UI's `--ui-*` variables. Don't hard-code colors in components; use
  `text-primary`, `text-muted`, `border-default`, etc.
- **Style with utilities, not CSS.** Component look is Tailwind utilities (in markup) and Nuxt UI
  `ui.*` overrides. The rendered Markdown is themed in `app.config.ts` under `ui.prose`. `main.css`
  is tokens + global base only; never add component classes there. Unavoidable custom CSS goes in
  that component's `<style>` block.
- **The signature element is `ViewToggle`.** It is the one bold move. Keep everything around it
  quiet so it stands out. Person view is the default and must work without JavaScript; the toggle is
  progressive enhancement.
- **Dark mode is an inversion**, not a separate theme, it only re-points the `--ca-*` tokens under
  `.dark`. Don't add dark-specific component styling.
- **Accessibility is a floor, not a nice-to-have.** Visible keyboard focus, AA contrast in both
  modes, and `prefers-reduced-motion` are respected globally in `main.css`. Don't regress them.
- **MDC components** (used inside Markdown) live in `components/content/` and must invert cleanly
  via `currentColor` / CSS variables.

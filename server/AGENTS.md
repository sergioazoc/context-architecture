# AGENTS.md: server/

Nitro server routes. The site is otherwise fully static; this directory exists for the few endpoints
that must serve something other than a prerendered page.

## Layout

```text
server/
  routes/
    skill.md.ts   # serves the canonical skill (skills/context-architecture/SKILL.md) as raw markdown at /skill.md
```

## Rules

- **Prerendered, not runtime.** Every route here must be listed in `nitro.prerender.routes`
  (nuxt.config) so it is emitted as a static asset; Cloudflare serves the file, the handler does not
  run at the edge. Reads from disk (e.g. `skills/context-architecture/SKILL.md`) therefore happen at build time only.
- **No second source of truth.** `skill.md.ts` reads `skills/context-architecture/SKILL.md` at build instead of holding a
  copy. If you add a route that serves repo content, read it; do not duplicate it.

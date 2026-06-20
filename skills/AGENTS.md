# AGENTS.md — skills/

The distributable Context Architecture skill. `skills/context-architecture/SKILL.md` is an
agent-agnostic procedure for auditing and reworking an existing codebase against the eight
principles. It is a deliverable users install into their own tool, not part of the site runtime.

## Layout

```text
skills/
  context-architecture/
    SKILL.md     # the skill: standard skills/<name>/SKILL.md layout
```

The `skills/<name>/SKILL.md` layout is the convention the cross-tool installers expect. The `skills`
CLI (skills.sh), Claude Code, OpenAI Codex, and VS Code Copilot all derive the skill's name and its
slash command from the folder name `context-architecture`. Do not rename the folder or move SKILL.md:
the install commands documented on `/skill`, the bare-slug `npx skills add sergioazoc/context-architecture`,
and the served `/skill.md` route all depend on this exact path.

## Rules

- **It must stand alone.** A reader loads `SKILL.md` with no access to this site, so it restates the
  rule, the eight principles, and the five failure modes in full. Keep it self-contained.
- **Faithful to the manifesto.** Principle names and one-line statements are quoted from
  `content/en/index.md` and are the author's working draft. Do not reword, reorder, or add principles.
  If the manifesto changes, mirror the change here.
- **Rework, not greenfield.** The skill applies to existing codebases. Do not turn it into a project
  scaffolder.
- **Same house rules as the rest of the repo.** No marketing copy, no emojis, specification register,
  the wording rules in the root `AGENTS.md` (plain language, no em dashes in copy).
- **The `description` frontmatter is the discovery surface.** It is what an agent and the installers
  match on, so keep it trigger-rich (the failure modes, "agent-ready", "AI-legible", "AGENTS.md") and
  accurate. The frontmatter `name` must stay `context-architecture` (lowercase, hyphens): Copilot and
  others require the folder name to equal it.
- **Served, documented, and packaged.** Three other places point at this exact path: `server/routes/skill.md.ts`
  reads it and serves it raw at `/skill.md`; the `/skill` page documents per-tool install; and
  `.claude-plugin/marketplace.json` at the repo root references `./skills/context-architecture` to
  publish it as a Claude Code plugin. Keep all four in sync, and do not rename the folder.

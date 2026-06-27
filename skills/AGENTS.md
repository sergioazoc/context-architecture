# AGENTS.md: skills/

The distributable Context Architecture skill. `skills/context-architecture/SKILL.md` is an
agent-agnostic procedure for auditing and structuring a codebase against the nine principles. It is a
deliverable users install into their own tool, not part of the site runtime.

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
  rule, the nine principles, and the five failure-mode signals in full. Keep it self-contained.
- **Faithful to the manifesto.** Principle names and one-line statements are quoted from
  `content/en/index.md`. Do not reword, reorder, or add principles. If the manifesto changes, mirror
  the change here.
- **Greenfield and brownfield.** The skill applies both to a repository born legible from the first
  commit and to one that grew without design and is restructured in steps. It is not retrofit-only,
  and it is not a project scaffolder either: it audits and structures against the rule.
- **Same house rules as the rest of the repo.** No marketing copy, no emojis, specification register,
  the wording rules in the root `AGENTS.md` (plain language, no em dashes in copy).
- **The `description` frontmatter is the discovery surface.** It is what an agent and the installers
  match on, so keep it trigger-rich (the failure-mode signals, "agent-ready", "AI-legible", "AGENTS.md")
  and accurate. The frontmatter `name` must stay `context-architecture` (lowercase, hyphens): Copilot
  and others require the folder name to equal it.
- **Served, documented, and packaged.** Three other places point at this exact path: `server/routes/skill.md.ts`
  reads it and serves it raw at `/skill.md`; the `/skill` page documents per-tool install; and
  `.claude-plugin/marketplace.json` at the repo root references `./skills/context-architecture` to
  publish it as a Claude Code plugin. Keep all four in sync, and do not rename the folder.
- **Bump the version on every change.** A change to `SKILL.md` ships with a version bump in
  `.claude-plugin/marketplace.json` (both `metadata.version` and the plugin entry, kept equal).
  Claude Code dedupes a plugin by version: an unchanged version is served from cache, so existing
  installs never see the new content. `tests/skill-version.test.ts` binds this, the published
  version is pinned to a hash of `SKILL.md`, so changing the skill without bumping the version fails
  the test. This is the rule applied to the skill itself.
- **Re-sync the external mirror on a version bump.** The skill is also vendored as a copy in the
  `davila7/claude-code-templates` aggregator, at
  `cli-tool/components/skills/development/context-architecture/SKILL.md`. That copy names this site as
  its source but is not bound to it: nothing here fails when it drifts, because it lives in a repo this
  one does not control. Treat it as a manual sync. On a meaningful version bump, open a PR there with
  the current `SKILL.md` (a faithful copy, attribution and the CC BY 4.0 license intact). If the
  aggregator's copy is older than `marketplace.json`'s version, a re-sync is pending. Last synced:
  v0.2.0.

---
title: The Context Architecture skill, run it with your agent
description: "An agent-agnostic skill that audits a codebase against the nine principles of Context Architecture, finds the claims that are not bound to a mechanism, and hands back a backlog of fixes. One command installs it into Claude Code, Cursor, Codex, Copilot, and more. By Sergio Azócar."
eyebrow: Skill
definition: "The Context Architecture skill is an agent-agnostic procedure that reads a repository as a cold reader, audits it against the nine principles, finds the claims the repository makes about itself that are not bound to a mechanism, and hands back an ordered backlog of fixes. It needs no server. The install is one file your agent reads."
---

The skill is the specification, turned into something your agent runs. One Markdown file. You load it,
point it at a repo, and it reads the code as a reader with no memory, audits it against the
[nine principles](/), and finds the claims the repository makes about itself that are not bound to a
mechanism that fails when they stop being true. Then it hands back the backlog in the order the
[guide](/guide) lays out.

No server, no dependency, no special tooling. It is a file your agent reads, which is principle 05
(Capabilities Are Discoverable) applied to the skill itself.

## What it does

- **Audits** the repo against the nine principles and writes a report with a verdict and the
  evidence behind it, one per principle: which claims are bound to a mechanism, and which are only
  prose.
- **Finds unbound claims**: docs that cite deleted files, name renamed modules, or contradict the
  code, and conventions that live only in prose with nothing that fails when they break.
- **Proposes a backlog**: PR-sized changes ordered by payoff, each paired with the mechanism
  (compiler, linter, automated test, review) that fails when its claim stops being true.
- **Drafts `AGENTS.md` files** at the boundaries, holding only what you cannot get from the code.

It applies from the first commit, so a repo can be born legible, and to a repo that grew without
design, restructured in steps. It does the same audit either way.

## Install it

One command covers most tools. The [`skills` CLI](https://skills.sh) reads the skill from the repo and
drops it into whatever agent you have:

```bash
npx skills add sergioazoc/context-architecture
```

It asks which tool to install into. Pass `-a <tool>` to pick one (for example `-a claude-code`), `-g`
to install it for all your projects, and `-y` to skip the prompts. The per-tool sections below cover
the manual path if you would rather drop the file in yourself, or your tool is not on its list.

### Claude Code

```bash
npx skills add sergioazoc/context-architecture -a claude-code -g
```

By hand, with no Node: save the file into a folder named for the skill, then restart Claude Code. The
folder name is what you type as the `/context-architecture` command, so keep it exactly that.

```bash
mkdir -p ~/.claude/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.claude/skills/context-architecture/SKILL.md
```

Drop the `~/.claude` for a personal install; use `.claude/skills/context-architecture/SKILL.md` to
scope it to one project instead.

### Cursor

Save it as a project rule. The `.mdc` extension matters, a plain `.md` in that folder is ignored:

```bash
mkdir -p .cursor/rules
curl -fsSL https://context-architecture.dev/skill.md -o .cursor/rules/context-architecture.mdc
```

The skill's `description` frontmatter tells Cursor to pull the rule in when it is relevant.

### GitHub Copilot (VS Code)

VS Code reads Agent Skills natively, the same `SKILL.md` format. The folder must be named for the
skill, or Copilot will not load it:

```bash
mkdir -p .github/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .github/skills/context-architecture/SKILL.md
```

On JetBrains, or older Copilot without skills, paste the file into `.github/copilot-instructions.md`
instead.

### OpenAI Codex

```bash
mkdir -p ~/.agents/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.agents/skills/context-architecture/SKILL.md
```

Use a project-local `.agents/skills/context-architecture/SKILL.md` to scope it to one repo. Restart
Codex if it does not pick the skill up.

### Other tools

Same idea: the file goes where the tool reads its rules.

- **Windsurf**: `.windsurf/rules/context-architecture.md`. If Windsurf complains about size, point it
  at the file instead of pasting the whole thing.
- **Cline**: `.clinerules/context-architecture.md`.
- **Zed**: append it to your `AGENTS.md`, which Zed reads. A loose `.rules` file can shadow an existing
  one, so appending is safer.
- **Aider**: save it as `CONVENTIONS.md`, then run `aider --read CONVENTIONS.md`.

### Any other agent

Grab the raw file and paste it into your tool's instructions, or point the tool at it:

```bash
curl -fsSL https://context-architecture.dev/skill.md
```

It is self-contained. It restates the rule and the nine principles, so it works with no way back to
this site.

## Use it

Load the skill and point your agent at a repo:

> Apply the Context Architecture skill to this repository.

It writes the audit first, read-only, then the ordered backlog. Work it one change at a time, each
landing with the mechanism that fails when its claim stops being true. Start where it tells you to:
the claims that are only prose, and the `AGENTS.md` files at the top boundaries. That is where you get
the most back per edit.

## Keep it updated

Updates travel through the default branch: a change reaches anyone only once it is merged to `main`
and the site is redeployed. After that, how you pull it in depends on how you installed it.

- **Claude Code plugin** (`/plugin marketplace add`): run
  `/plugin marketplace update context-architecture`. Each release bumps the plugin version, so Claude
  Code sees a new version and fetches it. An unchanged version is treated as cached and skipped, which
  is why every change to the skill ships with a version bump.
- **`skills` CLI**: re-run `npx skills add sergioazoc/context-architecture`. It overwrites the
  installed copy from the repo.
- **Manual install (`curl`)**: re-run the same `curl ... -o <path>` you installed with; it overwrites
  the file. Claude Code picks up an edited `~/.claude/skills/...` file within the session, no restart.

## Where to go next

- The [specification](/): the rule, the loop, the kinds of mechanism, and the nine principles.
- The [guide](/guide): the same work, done by hand, step by step.
- The [glossary](/glossary): the terms the skill uses, defined.

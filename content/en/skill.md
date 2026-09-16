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

One command covers most tools, and one file covers the rest. The skill is the standard Agent Skills
format, so almost any agent reads it once it sits in the right folder.

### One command

The [`skills` CLI](https://skills.sh) reads the skill from the repo and installs it into whatever agent
you have:

```bash
npx skills add sergioazoc/context-architecture
```

It asks which tool to install into. Pass `-a <tool>` to pick one (for example `-a claude-code`), `-g`
to install it for all your projects, and `-y` to skip the prompts. It installs a canonical copy and
links each agent to it; pass `--copy` for independent copies instead.

### The portable path

Most agents read a skill from `.agents/skills/<name>/SKILL.md`. Drop the file there by hand and it
works across tools:

```bash
mkdir -p .agents/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .agents/skills/context-architecture/SKILL.md
```

Use `~/.agents/skills/` for a personal install across every project. As of September 2026 that path is
read by Codex, Cursor, GitHub Copilot, Gemini CLI, Antigravity, Amp, OpenCode, Zed, Roo Code, Kilo,
Junie, Windsurf, goose, Warp, and Factory. The folder must be named for the skill
(`context-architecture`); the Agent Skills spec requires the name to equal the folder.

### Claude Code

```bash
npx skills add sergioazoc/context-architecture -a claude-code -g
```

By hand, save the file into a skill-named folder under `.claude/skills/`:

```bash
mkdir -p ~/.claude/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o ~/.claude/skills/context-architecture/SKILL.md
```

`~/.claude/skills/` is the personal install (every project on this machine); use
`.claude/skills/context-architecture/SKILL.md` inside a repo to scope it to one project. Claude Code
picks the file up in the running session; restart only if the `.claude/skills/` directory did not exist
when the session started.

### GitHub Copilot

Copilot reads skills in VS Code and JetBrains agent mode, the CLI, the coding agent, and code review,
from `.github/skills/`, `.claude/skills/`, or `.agents/skills/`. The folder name must equal the skill
name, or Copilot skips it:

```bash
mkdir -p .github/skills/context-architecture
curl -fsSL https://context-architecture.dev/skill.md -o .github/skills/context-architecture/SKILL.md
```

### Tools with their own skills directory

A few agents read a tool-specific path instead of `.agents/skills/`: Cline (`.cline/skills/`), Kiro
(`.kiro/skills/`), and Qwen Code (`.qwen/skills/`). The layout is the same, a `context-architecture/SKILL.md`
folder under that path. On a tool with no skills support, point it at the raw file: Aider reads it as
`CONVENTIONS.md` via `aider --read CONVENTIONS.md`, and any tool can take the self-contained file
pasted into its instructions. The raw file is always at:

```bash
curl -fsSL https://context-architecture.dev/skill.md
```

### As a Claude Code plugin

The repo is also a single-plugin marketplace, so Claude Code can install and update it as a plugin:

```bash
/plugin marketplace add sergioazoc/context-architecture
/plugin install context-architecture@context-architecture
```

The skill then runs as `/context-architecture:context-architecture`.

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

- **`skills` CLI**: run `npx skills update context-architecture` (or `npx skills update` for all; add
  `-g` for the global install). It refreshes the canonical copy each agent links to.
- **Claude Code plugin**: run `/plugin marketplace update context-architecture` to refresh the
  listing, then `claude plugin update context-architecture@context-architecture` to install the new
  version, or enable auto-update for the marketplace in `/plugin` (off by default for third-party
  marketplaces). Each release bumps the version, so an unchanged version stays cached.
- **Manual install (`curl`)**: re-run the same `curl ... -o <path>` you installed with; it overwrites
  the file. Claude Code picks up an edited `.claude/skills/...` file within the session.

## Where to go next

- The [specification](/): the rule, the loop, the kinds of mechanism, and the nine principles.
- The [guide](/guide): the same work, done by hand, step by step.
- The [glossary](/glossary): the terms the skill uses, defined.

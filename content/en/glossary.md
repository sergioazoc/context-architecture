---
title: "Glossary: Context Architecture and adjacent terms"
description: "Concise, citable definitions of Context Architecture and the terms it is most often confused with: context engineering, harness engineering, AGENTS.md, spec-driven development, context rot, and the vocabulary of agent tooling. A specification by Sergio Azócar."
eyebrow: Glossary
definition: "Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when that claim stops being true."
---

The terms around AI agents and code are used loosely and get confused. This glossary gives each one
a short, self-contained definition and says how it relates to Context Architecture. For the full
treatment of the three disciplines, see the [comparison](/comparison).

## Context Architecture

A software architecture for the age of AI agents: it structures a repository so that everything it
claims about itself, its structure, its behavior, and who can change it, is legible to the agent
writing the code and to the people who answer for it, and bound to a mechanism that fails when that
claim stops being true. It treats the repository itself (its file tree, boundaries, conventions, and
embedded context) as a designed artifact, not an accident of growth. It is the design-time
counterpart to context engineering and harness engineering. Sergio Azócar introduced the term for
software repositories in October 2025, and first published this specification in June 2026.

The phrase is used elsewhere in senses that are not about the repository. Some data platforms call the
metadata layer an agent reads a "context architecture" (Modern Data 101, October 2025). Some vendors
use it for the runtime layout of an agent's context window, the system prompt, memory, and retrieved
data (Atlan, April 2026); this specification calls that context engineering. In UX it names
information architecture applied to AI products (Nielsen Norman Group, June 2026). Here, Context
Architecture designs the repository.

## Context engineering

The runtime discipline of deciding what enters the model's context window at each step: which files,
instructions, and tool results are loaded. It designs the contents of the window. Context
Architecture designs the thing the window looks at, the codebase. Better Context Architecture means
there is less to compress at runtime. Popularized by Tobi Lütke and Andrej Karpathy in June 2025 and
defined by Anthropic in September 2025.

## Harness engineering

The discipline of designing everything wrapped around one agent: the execution loop, the tools it can
call, the guides that steer it, and the sensors that catch its mistakes. As OpenAI (February 2026) and
Thoughtworks (Birgitta Böckeler, April 2026) use the term, the harness reaches into the repository
too: the AGENTS.md an agent reads as a map, the docs it treats as the source of truth, the custom
linters that enforce the architecture. Context Architecture is not a rival to that work; it is the
rule those guides and sensors either satisfy or not. Harness engineering wraps one agent with one
toolchain; Context Architecture is a property of the repository, independent of the agent: every claim
bound to a mechanism that fails, and the set of mechanisms itself bound (principle 09). Better Context
Architecture means fewer corrective guardrails in any harness.

## AGENTS.md

A file of embedded context placed at a meaningful boundary in a repository, holding only what cannot
be learned by reading the code: the source of truth, the invariants, the accepted tech debt, and the
rationale a spec leaves behind. It is an open format, released in August 2025 and stewarded by the
Agentic AI Foundation under the Linux Foundation since December 2025, adopted across tens of thousands
of projects. A repository may hold one per directory, and agents read the nearest one in the tree, so
the closest takes precedence. The standard fixes the file name and that nearest-wins rule, nothing
about the content; Context Architecture supplies the content discipline: only what the code cannot
say, each claim bound to a mechanism. Because the file sits next to the code, it is reviewed in the
same pull request, ages at the same rate, and is found by the same agent about to edit it. Claude Code
reads its own `CLAUDE.md` instead, so a `CLAUDE.md` that imports `AGENTS.md`, or a symlink, bridges
the two; most other agents read `CLAUDE.md` only as a fallback when `AGENTS.md` is absent. In Context
Architecture an `AGENTS.md` is the artifact of the second principle (Context Lives With Code).

## Spec-driven development

Writing intent as a specification before the code exists: the spec defines the what, not the how, with
acceptance criteria the implementation is checked against. Birgitta Böckeler (October 2025) names three
levels: spec-first (the spec is used, then discarded), spec-anchored (the spec persists and evolves),
and spec-as-source (the spec is the maintained artifact, the code its output). Tools differ: Spec Kit
and Kiro keep the spec as a living source of truth, Tessl pairs it with linked tests, OpenSpec archives
it. Context Architecture (sixth principle, Intent Becomes Mechanism) is spec-first by default: the spec
becomes tests, types, and lint, then is removed so it cannot drift. A spec that stays generative,
feeding code generation or a spec-driven loop, is kept, and then the rule applies to it too: it is a
claim the repository makes, so it needs a mechanism that fails when it and the code diverge. A spec no
check can fail is prose.

## Context rot

The term has two meanings. Chroma (July 2025) and Anthropic (September 2025) use it for a model's
recall degrading as its context window grows. This specification, like Treude and Baltes (June 2026),
uses it for the other decay: repository context that drifts from the code it describes, a doc that
cites a deleted file, names a renamed module, or contradicts the current behavior while still reading
as authoritative. A confident reader obeys it, so rotted context is worse than none. The rule at the
heart of Context Architecture exists to prevent this second kind: every claim a repository makes about
itself must be bound to a mechanism that fails when that claim stops being true.

## Mechanism

What a claim is bound to, that fails when the claim stops being true: a compiler error, a lint rule, an
automated test, or a review step. It is an architectural fitness function (Ford, Parsons, and Kua,
2017), what Böckeler (2026) calls a sensor, applied to a claim a repository makes about itself. Context
Architecture adds two things to that lineage: a prose claim (an `AGENTS.md` path, a README command) is
bound too, and the set of mechanisms is itself bound (principle 09).

## Hook

A script an agent's tool runs at a fixed point in its loop, before a tool call, after an edit, or when
the turn ends, that can block the action. It is configured in a file the repository commits
(`.claude/settings.json`, `.cursor/hooks.json`, `.github/hooks/`, `.codex/hooks.json`). In Context
Architecture a hook is a place a mechanism can fire early, inside the agent's loop rather than at CI.
It is not the authorization of principle 09, because the tool can be told to skip it and another agent
may not run it; the integration gate stays the floor.

## Skill

A packaged procedure an agent loads on demand, in the Agent Skills format (a `SKILL.md` file with
frontmatter). It holds the how, the repeatable steps, kept out of context until needed, next to the
what an `AGENTS.md` always carries. In Context Architecture a skill is one way capabilities are made
discoverable (fifth principle); a skill that cites a path or a script is a claim, bound by the same
doc-reference check.

## Progressive disclosure

Loading information in stages so context is spent only when needed: a table of contents, then the
chapter, then the appendix (Anthropic, October 2025, and the Agent Skills standard). Context
Architecture is a progressive-disclosure design: the root `AGENTS.md` is the table of contents, each
boundary's `AGENTS.md` is the chapter, the code is the appendix, and the first principle makes the file
tree itself the first level.

## Agent memory

Notes an agent's tool keeps for itself between sessions (Claude Code auto memory, Codex memories,
Copilot Memory). They are local to a machine or an account, unverified, and unshared with the
repository, so they go stale like any prose and nothing fails when they do. Context Architecture
designs for the reader without them, the only design that holds for every reader; what memory learns
and the repository should say is promoted into an `AGENTS.md` or a mechanism.

## Agentic engineering

The practice, named by Andrej Karpathy in 2026, of coordinating fallible agents while preserving
correctness, security, and maintainability: designing specs, supervising plans, inspecting diffs,
writing tests, and building evaluation loops. Agentic engineering is the work and the role; Context
Architecture is a property of the repository that work operates on. When the agentic engineer writes
tests and evaluation loops, the rule says which ones: one per claim the repository makes about itself.

## Agent readiness

How prepared a repository is for agents to work in it, as measured by scorecards and instruction
linters (for example Factory's Agent Readiness, agents-lint). These measure whether mechanisms are
present: a linter, tests, an `AGENTS.md`. Context Architecture asks more: that each mechanism fails
when its claim stops being true, and that the set of mechanisms is itself bound. A scorecard can be
green with tests that never fail.

## Where to go next

- The [specification](/): the rule, the autonomy spectrum, the mechanisms, and the nine principles.
- The [comparison](/comparison): Context Architecture vs. context engineering vs. harness
  engineering.
- The [guide](/guide): how to apply it to an existing codebase.

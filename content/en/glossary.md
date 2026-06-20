---
title: "Glossary: Context Architecture and adjacent terms"
description: "Concise, citable definitions of Context Architecture and the terms it is most often confused with: context engineering, harness engineering, AGENTS.md, spec-driven development, and Screaming Architecture. A specification by Sergio Azócar."
eyebrow: Glossary
definition: "Context Architecture is the design-time discipline of structuring a codebase so it is legible to people and AI agents. This glossary defines it alongside the adjacent terms it is most often confused with, so each can be cited precisely."
---

The terms around AI agents and code are used loosely and get confused. This glossary gives each one
a short, self-contained definition and says how it relates to Context Architecture. For the full
treatment of the three disciplines, see the [comparison](/comparison).

## Context Architecture

A software architecture for the age of AI agents: the practice of structuring a codebase so that its
intent and behavior are equally legible to people and AI agents. It treats the repository itself
(its file tree, boundaries, conventions, and embedded context) as a designed artifact, not an
accident of growth. It operates at design time, and it is the structural counterpart to context
engineering and harness engineering. Introduced by Sergio Azócar in October 2025.

## Context engineering

The runtime discipline of deciding what enters the model's context window at each step: which files,
instructions, and tool results are loaded. It designs the contents of the window. Context
Architecture designs the thing the window looks at, the codebase. Better Context Architecture means
there is less to compress at runtime.

## Harness engineering

The operational discipline of designing the environment an agent runs in: the execution loop, the
tools it can call, and the guardrails that keep it safe and let it self-correct. It designs the
agent's operating environment. Context Architecture designs the codebase that environment operates
on. Better Context Architecture means fewer corrective guardrails in the harness.

## AGENTS.md

A file of embedded context placed at a meaningful boundary in a repository, holding only what cannot
be learned by reading the code: the source of truth, the invariants, the accepted tech debt, and the
rationale a spec leaves behind. Because it sits next to the code, it is reviewed in the same pull
request, ages at the same rate, and is found by the same agent about to edit it. `CLAUDE.md` is the
tool-specific equivalent some agents read. In Context Architecture, an `AGENTS.md` is the artifact of
the second principle (Context Lives With Code), and each claim it makes should be bound to a
mechanism.

## Spec-driven development

Writing intent as a specification before the code exists: the spec defines the what, not the how,
with acceptance criteria the implementation is checked against. In Context Architecture (third
principle, Intent Becomes Mechanism), the spec is design-time scaffolding, not a durable artifact.
Once its acceptance criteria become tests, its contracts become types, and its conventions become
lint, it has done its job and is removed, so it cannot drift. It is kept only when it stays
generative, feeding code generation or a spec-driven loop.

## Screaming Architecture

The principle, named by Robert C. Martin in 2011, that a software system's structure should announce
what it does, not which framework built it: the top level should scream `billing`, `payments`,
`onboarding`, not `controllers`, `services`, `utils`. Context Architecture is its heir. It inherits
the ideal and extends it to a reader with no memory, the AI agent, for whom the structure must scream
even more legibly, because the agent will not paper over ambiguity with intuition.

## Context-rot

The silent decay of documentation as the code it describes changes: a doc that cites a deleted file,
names a renamed module, or contradicts the current behavior, while still reading as authoritative. A
confident reader obeys it, so rotted context is worse than none. The rule at the heart of Context
Architecture exists to prevent it: every claim a repository makes about itself must be bound to a
mechanism that fails when the claim stops being true.

## Where to go next

- The [specification](/): the rule, the four pillars, the mechanism, and the eight principles.
- The [comparison](/comparison): Context Architecture vs. context engineering vs. harness
  engineering.
- The [guide](/guide): how to apply it to an existing codebase.

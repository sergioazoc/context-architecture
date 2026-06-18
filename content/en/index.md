---
title: Context Architecture
description: Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. A specification by Sergio Azócar.
eyebrow: A specification
definition: Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. It treats the repository itself (its file tree, boundaries, conventions, and embedded context) as a designed artifact, not an accident of growth.
attribution: I introduced the term Context Architecture in October 2025, while restructuring Skyward's monorepo for people and AI-agent legibility. First published June 2026.
---

<!--
  IP NOTE: The principle set below (names + one-line statements) is a strong
  working draft derived from the author's practice, not the finalized canon.
  The structure is real and complete; the author will finalize wording.
  Do not invent additional principles or alter the methodology.
-->

## The rule

Context Architecture does not invent new parts. It takes what already works in the ecosystem and
organizes it under a single rule. That rule is the spine, and everything else derives from it.

::rule
Every claim a repository makes about itself must be bound to a mechanism that fails when that
claim stops being true.

#slogan
If a piece of context can rot silently, it is not architecture, it is documentation.
::

The rule is a test you can run on any repo, line by line. For each thing the repository asserts
about itself (where the source of truth lives, which pattern is correct, what must not be touched),
is there a compiler, a linter, a test, or a review step that breaks when that assertion becomes
false? If there is not, it is prose, and prose rots. A context claim with no mechanism behind it
_is_ the violation.

The contribution is not the parts. It is the rule that selects and sustains them, and the
consequence of that rule: context stops being a promise someone keeps by hand and becomes a
verifiable, self-sustaining property of the system.

## The problem

For a long time, good architecture was measured by one thing: how fast a new engineer understood
the codebase. Screaming Architecture put a name to the ideal. A project's structure should announce
what it does, not which framework built it.

That ideal still holds. The reader changed. Today a large share of the code that ships to production
is read, navigated, and modified by AI agents. So the architecture is built on one explicit design
assumption:

> Assume a reader who retains nothing between sessions and knows only what the repository makes
> explicit. AI agents satisfy this assumption exactly; a new human contributor approximates it.

From that assumption follow five failure modes. Each is a design defect of the repository, not a
limit of the model, which is why none of them is fixed by a better model or better prompts:

1. **Reimplementation.** The reader rebuilds what already exists, because the source of truth was
   not locatable.
2. **Invented structure.** It imposes its own organization, because none was imposed on it.
3. **Obedience to false documentation.** It cites deleted files or contradicts the current code,
   with full confidence.
4. **Deprecated-pattern propagation.** It copies the most visible pattern even when that pattern is
   obsolete.
5. **Random ambiguity resolution.** With two conventions coexisting, it uses the one from whichever
   file it read first.

The architecture exists so these five failures have nowhere to happen.

## How it works

The architecture satisfies the rule with two moves and a frontier: context is **written** (the four
pillars) and lives with the code it describes (principle 02); it is **verified** (the mechanism,
whose first instance is codifying conventions in lint and types, principle 05); and, in its mature
form, it is **fed** (the metabolism).

### The four pillars

On their own the pillars are good documentation, and documentation rots. They are only half the
work. Two of them make the code's own shape legible (structure and capabilities, which a reader
infers from the tree); two declare what the code cannot say about itself (embedded context and
written intent).

**Pillar 1. Structure Screams Intent.** The top level is organized by domain, not by
technology: `billing/`, `onboarding/`, `payments/`, not `controllers/`, `services/`, `utils/`.
Technical folders are fine one level down, inside the domain they serve; the framework just should
not be the axis the repository is organized around. A reader places a change before reading a line
of code.

**Pillar 2. Embedded context.** An `AGENTS.md` or `CLAUDE.md` at every meaningful boundary, holding
only what you cannot learn by reading the code: sources of truth, invariants, accepted tech debt, and the
rationale a spec leaves behind when it becomes mechanism (pillar 3). Because it sits next to the code, it ages with
it and is found by the same agent about to edit it. It does not live in a wiki that drifts somewhere
else.

**Pillar 3. Intent Becomes Mechanism.** The spec precedes the code: it defines the what, not the how, with
acceptance criteria the agent checks itself against. But the spec is design-time scaffolding, not a
durable artifact; once its intent lives in tests, types, and lint, it has done its job and is
removed. When intent only lives in the head of whoever was in the room, the agent has nothing to
align to.

**Pillar 4. Capabilities Are Discoverable.** Tools, skills, and commands at predictable paths, named
for what they do. A capability that exists but cannot be found does not exist for an agent: it
guarantees the thing gets re-implemented or skipped. Capabilities are invoked when needed, not
always, because context is finite: if you give an agent everything all the time, you give it
nothing. Which one to load at each moment is context engineering's job, at runtime; this pillar's
job is design-time, making them findable in the first place and binding that to a mechanism (below).

### The mechanism

This is the other half, and the line between Context Architecture and "good documentation
practices." Each claim the pillars make is bound to a mechanism that makes it fail when it stops
being true. Four layers, each catching a kind of drift:

- **The compiler** guards what it can: reintroducing a forbidden import alias breaks the typecheck.
- **The linter** guards structure: a file in the wrong folder is an immediate error with a message
  that cites the rule, not a comment in review.
- **The tests** guard against documentation that lies: if an `AGENTS.md` cites a deleted file, the
  suite goes red. The same layer guards discoverability: a capability index generated from the
  conventional paths (not hand-kept) cannot omit a real capability, and a stale entry turns the
  suite red.
- **Review** (human or AI) guards semantic truth, with an instruction that, on every change, asks
  whether it leaves any doc lying and requires fixing it in the same PR.

With the mechanism, context stops being a promise and becomes a property of the system. It is also
what gives the five failure modes nowhere to happen: invented structure is caught by the linter,
false documentation by the tests, deprecated patterns and ambiguity by codified conventions, and
reimplementation by discoverable capabilities and their index.

### The metabolism

The mature level, the one that separates a real Context Architecture from a well-intentioned one:
context is not only validated, it is fed. An architecture that validates itself cannot rot silently.
One that feeds itself absorbs new knowledge the moment it is created. When a PR introduces a source
of truth or an invariant, the review loop asks to document it right there. Context grows with the
system, not behind it.

::diagram-metabolism
::

### Why: the quality attribute

All of this serves a single quality attribute, and naming it is what makes the architecture an
architecture and not a set of good ideas:

> The time to the first correct change by a reader with no prior context.

Historically that reader was a new engineer. Now it is also an agent, and it is the most demanding
reader there is, because it will not paper over ambiguity with intuition. Optimizing for it is the
north star that justifies integrating the parts. It is not elegance, it is serving a concrete
reader.

## The principles

Every principle follows the same anatomy: a name, a one-line statement, the reasoning, the practice
that implements it, and an example. The regularity is part of the argument. This is a methodology,
not a collection of opinions. Each principle is a derivation of the rule, and each one lives in a
pillar or a level above:

| Principle    | Where it lives                      |
| ------------ | ----------------------------------- |
| 01 · 04 · 07 | Pillar 1: Structure Screams Intent      |
| 02           | Pillar 2: Embedded context              |
| 03           | Pillar 3: Intent Becomes Mechanism      |
| 06           | Pillar 4: Capabilities Are Discoverable |
| 05           | The mechanism (its first instance)  |
| 08           | The quality attribute (the why)     |

### 01 Structure Screams Intent

> A reader, person or agent, must infer what the system does from the file tree alone, never from
> the framework it happens to use.

A directory named `billing/` says more than one named `controllers/`. The first names a
responsibility in the problem domain. The second names a technical mechanism that could belong to
any system. When the top level of a repo screams `payments`, `onboarding`, `notifications`, both a
person and an agent can place a change before reading a line of code.

Framework-shaped trees do the opposite. They optimize for the convenience of the framework, not the
comprehension of the reader, and they force every newcomer to reconstruct the domain from scattered
evidence.

::diagram-tree
::

**Practice.** Organize the top level by domain capability, not by technical layer. Let the framework
live one level down, inside the capability it serves.

**Example.**

```text
src/
  billing/          # the domain at the top level
    controllers/    # the framework lives one level down,
    services/       # inside the domain it serves
    models/
  onboarding/
  payments/
# not: a top level of controllers/ services/ models/ utils/
```

### 02 Context Lives With Code

> Embedded context belongs at every meaningful boundary, colocated with what it describes, not
> exiled to a wiki that drifts.

Documentation that lives somewhere else goes stale somewhere else. The fix is proximity: an
`AGENTS.md` or `CLAUDE.md` at each boundary, saying what this part does, what it must not do, and
how to work inside it. Because it sits next to the code, it is reviewed in the same pull request,
ages at the same rate as the code, and is found by the same agent that is about to edit it.

**Practice.** Put an `AGENTS.md`/`CLAUDE.md` at the root and at every directory that owns a distinct
responsibility. Keep each one short and specific to its scope.

**Example.**

```text
billing/
  AGENTS.md       # invariants, gotchas, ownership for billing
  invoices/
  refunds/
```

### 03 Intent Becomes Mechanism

> Intent is written as a spec before code exists, then becomes mechanism: the code and the checks that
> enforce it. The spec is scaffolding, not a permanent artifact.

A spec is the source of truth at design time: it gives the code something to be checked against, and
an agent something to align to. But once the code exists, a prose spec that merely describes it is a
second source that can drift, and by the rule, a claim with no mechanism behind it is just
documentation. So the spec becomes mechanism: its acceptance criteria become tests, its contracts become
types and schemas, its conventions become lint. Its checkable intent is now enforced by something
that fails when the code diverges. What is left is the rationale, the why the code cannot hold, and
that moves into the embedded context (principle 02). Then the spec is removed, so it cannot rot. It
stays alive only when it is generative: feeding an iterative loop that keeps producing code and
validation, bound to a mechanism like regeneration or contract tests.

**Practice.** Write a spec before any non-trivial work. As the code lands, turn the spec into mechanism:
acceptance criteria into tests, contracts into types, conventions into lint; move the surviving why
into the nearest `AGENTS.md`; then delete the spec. Keep one in the repo only if it is generative
(codegen, declarative config, a spec-driven loop).

**Example.**

```text
# design time
specs/checkout-flow.md        # written first, deleted once it becomes mechanism
# after it becomes mechanism
tests/checkout-flow.test.ts   # acceptance criteria, now executable
types/checkout.ts             # contracts, now enforced
billing/AGENTS.md             # the why that outlives the spec
```

### 04 Boundaries Are Explicit and Named

> Every module, package, and ownership line is named so its responsibility is inferable. Ambiguous
> names are architectural debt.

A boundary that is not named is not enforced. `utils/`, `common/`, and `helpers/` are where
responsibility goes to die: they accrete unrelated code because nothing in the name resists it. A
named boundary (`pricing`, `auth`, `ingestion`) communicates a responsibility and creates pressure
to keep unrelated things out. Used with judgment they are not forbidden: a small, dependency-free
helper with no domain home (a date formatter, a result type) legitimately lives in a `shared/`. The
debt is reaching for the name to dodge deciding where something belongs, until the folder becomes a
junk drawer that grows without limit.

**Practice.** Name every package and module after the responsibility it owns. When you cannot name a
boundary precisely, that is a signal the boundary is wrong, not an excuse to call it `shared`.
Reserve `shared`/`utils` for the genuinely generic, and keep it small.

**Example.**

```text
packages/
  pricing-engine/
  auth-session/
  event-ingestion/
# not: packages/core/  packages/lib/
```

### 05 Conventions Are Codified, Not Implicit

> A convention that lives only in people's heads is invisible to an agent. Encode it in linting and
> types so the toolchain can check it.

People on a team pass conventions on by osmosis: code review, pairing, the occasional sigh. The
agent gets none of that. A convention it cannot read is a convention it will break. The way out is
to take conventions out of the culture and put them in the toolchain: lint rules, type constraints,
and CI checks that state the rule and enforce it in the same place. This principle is the first
instance of the mechanism: it is what every other pillar reaches for when it needs its claims to
hold.

**Practice.** For every "we always do it this way," ask whether a linter or the type system can
express it. If it can, encode it. This site's own toolchain uses `oxlint` with the
`oxlint-tailwindcss` plugin to lint its CSS conventions so they are checked automatically.

**Example.**

```text
.oxlintrc.json    # the convention, written down and enforced
```

### 06 Capabilities Are Discoverable

> Tools, skills, and commands are documented where an agent will look for them, not where a person
> happened to file them.

A capability that exists but cannot be found is, to an agent, a capability that does not exist.
Filing a useful script under a personal folder, or a deploy command in a forgotten README,
guarantees it gets re-implemented or skipped. Being discoverable means putting capabilities at the
predictable path and naming them after what they do.

**Practice.** Expose project capabilities (scripts, generators, agent skills) at conventional, named
locations. Prefer `package.json` scripts, a `skills/` directory, or documented commands over word of
mouth.

**Example.**

```text
scripts/
  deploy.sh
  seed-db.sh
package.json      # the "scripts" an agent reads first
```

### 07 The Repo Is Legible at Every Zoom Level

> From the file tree to the function body, each level of zoom communicates purpose. Legibility is
> fractal.

Legibility is not only a top-level property. A clear tree with opaque functions inside is legible at
one zoom and illegible at another. The same discipline that names directories should name functions,
types, and variables, so comprehension degrades gracefully as a reader descends, never falling off a
cliff at the file boundary.

**Practice.** Apply the same naming and structural clarity at every scale. A reader should be able
to stop zooming at any level and still know where they are.

**Example.**

```text
billing/refunds/issue-refund.ts
  → issueRefund(order, reason)   # purpose readable at the leaf
```

### 08 Optimize for the Newcomer, and the Newcomer Is Now an Agent

> The clearest test of architecture is how fast a stranger becomes productive. That stranger is
> increasingly a machine.

Every preceding principle reduces to one test: how fast can someone who has never seen this codebase
do correct work in it? For years that someone was a new hire. Now it is also an agent invoked cold,
with no memory of yesterday's session. Architecture that serves the cold newcomer serves everyone,
and the agent is the most demanding newcomer there is, because it will not paper over your ambiguity
with intuition.

**Practice.** Make time-to-first-correct-change your one metric, and optimize relentlessly for it.

**Example.**

```text
README.md         # screams the intent
AGENTS.md         # the rules of the house
specs/            # what to build, before building it
```

## The practices

Each principle maps to a concrete artifact you can add to a repo today.

| Principle                         | Artifact                                   |
| --------------------------------- | ------------------------------------------ |
| Structure Screams Intent          | Domain-first top-level directories         |
| Context Lives With Code           | `AGENTS.md` / `CLAUDE.md` per boundary     |
| Intent Becomes Mechanism          | Spec turns into tests, types, lint    |
| Boundaries Are Explicit and Named | Named packages; no `utils`/`common`        |
| Conventions Are Codified          | `oxlint`, type constraints, CI checks      |
| Capabilities Are Discoverable     | `scripts/`, `skills/`, documented commands |
| Legible at Every Zoom Level       | Naming discipline from tree to function    |
| Optimize for the Newcomer         | `README` + `AGENTS.md` + `specs/` at root  |

## The lineage

**Ancestor.** Screaming Architecture (Robert C. Martin, 2011). Context Architecture inherits it and
extends it to the age of agents: the structure no longer only has to scream to a human, but to a
reader with no memory.

**Mechanisms it adopts.** Spec-driven development (written intent before code) and TDD. TDD is the
spiritual ancestor of the rule: it verifies that the code does what it says. Context Architecture
generalizes that idea from behavior to all context: **tests verify that the code does what it says;
Context Architecture verifies that the repository tells the truth about itself.**

**Neighbors in other layers, distinct but enabled by it.** Context engineering (runtime: what enters
the model's context window at each moment) and harness engineering (operations: the environment the
agent runs in). Context Architecture does not absorb them. It sits below, at design time, and takes
work off them. Better Context Architecture means less to compress at runtime and fewer corrective
guardrails in the harness.

## Limits and cost

It is not a silver bullet, and saying so is part of the case.

**It applies to:** refactors at scale, mechanical migrations, features with a clear spec, test
generation, contributions where the context already exists.

**It does not apply to:** ill-defined problems, product decisions, debugging with no context, the
first prototype of something not yet understood. The limit that sums it up: the agent does not
replace judgment, it amplifies it where judgment is already clear.

::callout{color="neutral"}
**The cost.** Upfront structuring work, verification layers that are code and have to
be maintained, and a discipline tax on every PR. It is an investment that pays back in proportion to
how much agent or multi-person work the repository absorbs. On a throwaway project, the toll beats
the return.
::

## Case studies

Evidence, kept sober.

At **Skyward** I applied Context Architecture to the company's monorepo; it is where I have tested it
most. Once it was restructured for legibility, AI agents migrated the toolchain from Biome + `tsc` to
`oxlint` + `tsgo` on that same codebase, moved the public site from React Router to Nuxt, and built
large features from specs. Each of the changes that usually ripple across a
codebase went smoothly here, because the codebase was built to be understood: with the
conventions codified and the checks in place, an agent knows at once when something stops working.

**oxlint-tailwindcss** is a native `oxlint` plugin I built: principle 05 turned into code. A Tailwind
convention that usually lives only in people's heads becomes lint rules the toolchain checks. We run
it across Skyward's monorepo, and its CTO [publicly vouched for it](https://x.com/fforres/status/2044481779306823819){target="_blank" rel="nofollow noopener"}.
What Context Architecture adds comes first: writing the convention down as checkable rules, instead
of leaving it implicit, is the whole reason a plugin like this can exist.

## Frequently asked questions

### What is Context Architecture?

Context Architecture is the practice of structuring a codebase so that its intent and behavior are
equally legible to people and AI agents. It treats the repository (its file tree, boundaries,
conventions, and embedded context) as a designed artifact.

### Who created Context Architecture?

Sergio Azócar introduced the term in October 2025, while restructuring Skyward's monorepo for people and
AI-agent legibility.

### How is Context Architecture different from context engineering?

Context engineering is a runtime concern: what information enters the model's context window at each
moment. Context Architecture is a design-time concern: how the codebase itself is structured. One
designs the contents of the window; the other designs the thing the window looks at.

### How is it different from harness engineering?

Harness engineering designs the environment the agent operates in: the execution loop, the tools,
and the guardrails. Context Architecture designs the codebase the agent operates on. Better Context
Architecture takes work off the harness.

### Is this just good documentation?

No. Documentation is unverified and rots silently. Context Architecture binds every context claim to
a mechanism that fails when the claim stops being true. Context with enforcement differs in kind,
not degree, from documentation.

### Is it really an architecture?

Yes. It makes structural decisions that are expensive to reverse (where context lives, how
boundaries are named, what gets codified), optimizes a concrete quality attribute (legibility for
people and agents), and is verifiable with fitness functions. That is operating at the architectural
level.

### Do I need special tools to apply it?

No. Context Architecture is a discipline of structure, not a product. `AGENTS.md`, specs, named
boundaries, and codified conventions are practices you apply with the tools you already use.

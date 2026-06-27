---
title: Context Architecture
description: "Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it. A specification by Sergio Azócar."
eyebrow: A specification
definition: "Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when that claim stops being true."
attribution: I introduced the term Context Architecture in October 2025, while restructuring Skyward's monorepo for people and AI-agent legibility. First published June 2026.
---

## The rule

A software architecture for agents comes down to one rule.

::rule
Every claim a repository makes about itself must be bound to a mechanism that fails when that claim stops being true.
::

That is the whole architecture. Everything else is how you apply it.

The rule is evaluated against any repository, claim by claim. Take each thing the repository holds about itself (where the source of truth lives, what the correct pattern is, what must not be touched) and ask whether there is a compiler, a linter rule, an automated test, or a review step that breaks when that stops being true. If there is not, it is prose, and prose goes stale without anything noticing.

A claim is anything the repository holds about itself, not just the shape of its folders. "Prices are computed in this module and nowhere else" is a claim. "This operation responds within a certain time" is a claim. "This data format does not break for the people already using it" is a claim. They are all the same kind of thing: something the repository promises, and that at some point can stop being true.

The mechanism has to actually fail, not just exist. A performance test that never exercises the slow path does not satisfy the rule, it violates it. Either the claim is bound to something that goes red when it breaks, or it is not.

The rule applies to itself. The set of tests and rules that verify the repository is, in turn, a set of claims about the repository, so it too is bound to a mechanism that fails if it is weakened.

The architecture has to hold up with or without a person reviewing the code. When a person reviews, the mechanisms do the checking the person would otherwise do by hand. When there is no person, they are the reviewer.

## The problem

Architecture used to optimize one thing: how fast a new engineer could understand the code. The reader changed. Today much of the code that reaches production is read and written by an agent.

Writing code stopped being the bottleneck. Models write well, and they review themselves better every day. The bottleneck moved to verifying that a growing volume of changes does not break anything, at the speed the agent produces them.

A small error rate, multiplied by that volume and that speed, with no mechanism that fails when a claim is violated, is silent breakage at scale. It takes two forms. With a person reviewing, verification does not scale: code is generated faster than it can be read, and the person ends up approving code they did not actually read. Without a person, a change that looks correct gets integrated, because nothing failed when a claim that lived only in prose was violated.

The job of the architecture is not to make the agent wrong less often. The model handles that, and better every day. The job is to make every violated claim fail at once, in the place where it broke, instead of integrating without anything noticing. That is why the problem grows with better models instead of going away: the faster and more autonomous the agent, the more the repository has to verify itself.

> Design for a reader who remembers nothing between sessions and only knows what the repository says out loud. An agent meets that exactly. A new person approximates it.

## The autonomy spectrum

Context Architecture works with or without a person in the loop. Today the norm is someone orchestrating the agent; more of the work is moving to agents running on their own. The architecture has to serve the whole range.

| Level | Who reviews | What breaks without repository discipline |
| --- | --- | --- |
| Inline | a person approves each edit | the agent reimplements things that already exist and the person burns time fixing what the tools could have caught |
| Async | a person reviews the change before integrating it | review does not scale; the integration gate exists but enforces nothing, one click lets a change through |
| Autonomous | a person sets the rules, does not look at each change | if the mechanisms are missing, the definition of "done" is empty: the agent calls a change finished when it passes but is wrong |
| Orchestrated | nobody in the middle | the error multiplies at machine speed; the only arbiters are the repository's mechanisms |

What changes across the spectrum is who consumes the verification, not the verification. The same `AGENTS.md` and the same mechanisms work in an interactive session, in a change reviewed separately, and in an agent running on its own. When there is a person, the mechanisms absorb the routine checks, so the person spends attention on what needs judgment, not on re-checking a convention. When there is no person, the mechanisms are the reviewer.

## How it applies

Working with an agent is a continuous flow of code changes. The rule lives inside that flow, not off to the side. Every time a change introduces or modifies something the repository holds about itself (a new source of truth, an invariant, a convention), that something is bound to a mechanism in the same change. And every change that touches existing code meets the mechanisms already there: if it violates a claim, something goes red before it reaches production.

That is why the repository's context grows with the system instead of falling behind. It is not a setup you do once, it is a property maintained change by change. When a change adds a new claim and leaves it loose, review, whether by a person or an agent, catches it and requires it to be bound before the change is accepted.

Binding a claim is connecting it to something that fails when it stops being true. Context Architecture names the kinds of mechanism, not the tool:

- **The compiler** catches what can be expressed in types: reintroducing a forbidden import breaks the build.
- **The linter** catches problems of structure and convention: a file in the wrong folder fails the lint and cites the rule it breaks.
- **Automated tests** catch documentation that lies and behavior that strays from what is expected: an `AGENTS.md` that mentions a deleted file turns the tests red.
- **Review**, by a person or an agent, catches what the others do not see, the meaning: on each change it asks whether any document now says something false, and requires the fix in the same change.

The split with the infrastructure the agent runs on is clear: Context Architecture decides what gets verified and guarantees the mechanism exists and fails. The infrastructure runs it. Binding the claim belongs to the architecture; running that mechanism on each change belongs to the environment.

## The principles

Each principle is a property you can check, not an aspiration. Either it is true of your repository and bound to a mechanism, or it is not. If it cannot be bound to something that fails, it is not a principle.

### Let the repository say what it is

**01 · Structure Screams Intent.** The file tree says what the system does, not what framework built it. A `billing/` folder names a business responsibility; a `controllers/` folder names a technical detail that could belong to any system. The framework lives one level down, inside the domain it serves. That way a reader locates where a change goes before reading a single line.
_Mechanism: a linter rule that errors when a file lands in a folder that does not match its domain._

::diagram-tree
::

**02 · Context Lives With Code.** Context lives next to the code it describes, at every important boundary, not in a separate wiki that goes stale. It holds only what the code cannot say on its own: where the source of truth is, what invariants must be respected, what technical debt was accepted on purpose, and what behavioral limits apply to that part. Because it sits next to the code, it ages at the same pace and is found by the same agent that will edit it.
_Mechanism: a test that fails if an `AGENTS.md` mentions a file that no longer exists._

**03 · Boundaries Are Explicit and Named.** Each module and package is named for the responsibility it owns. Folders like `utils/`, `common/`, or `helpers/` collect anything, because the name rules nothing out.

Genuinely shared, domain-free code exists, and it has a place: a date formatter, a Result type, a reusable UI hook. It goes in a small `shared/`, with no dependencies toward any domain, and it stays small. The debt is not having shared things, it is using the generic name to avoid deciding where something that does have an owner goes. If you cannot name a boundary precisely, that is usually a sign the boundary is drawn wrong, not that you need another generic folder.
_Mechanism: a rule that forbids a module from importing across another boundary through paths that are not allowed, and breaks the build when it happens._

**04 · The Repo Is Legible at Every Zoom Level.** Legibility is not only a top-level property, it reaches into the body of every function. You can have a clean root, `billing/`, `payments/`, and three folders down a `helpers.ts` with a `process(data)` function that does not say what it processes or what it returns. That is where legibility falls off. The same discipline that made you name `billing/` at the root has to name `applyLateFee(invoice)` at the leaf, and call `invoice` what is now `data`.
_Mechanism: linter rules on names and complexity limits._

**05 · Capabilities Are Discoverable.** The project's tools, scripts, and commands live in predictable places with names that say what they do: the `package.json` scripts, a `scripts/` folder, a skills folder. A capability that exists but that an agent cannot find does not exist for that agent: it reimplements it from scratch.

The list of capabilities is not written by hand, it is generated from those predictable places. A hand-written list is one more claim that goes stale: someone adds a script and forgets to note it. A list generated from the conventional folders cannot leave out something that is there, and if it goes out of date, a test catches it and goes red.
_Mechanism: the list generated from the conventional paths, and a test that fails if a real capability does not appear in it._

### Bind every claim to a mechanism

**06 · Intent Becomes Mechanism.** Intent is written as a spec before the code, then turned into the code and into the tests and rules that enforce it, and the spec is removed once its content already lives there. What stays is the intent and its verification, not the code that satisfies it: as long as the tests pin down the behavior, that code can be regenerated. A spec is kept only if it still generates something (code, configuration); if not, it is removed, so no second description is left to go stale.
_Mechanism: the tests, the types, and the rules the spec was turned into._

**07 · Conventions Are Codified, Not Implicit.** A convention that lives only in people's heads is invisible to an agent, and the agent will break it. Take it out of the culture and put it in the tools that review the code: linter rules, type constraints, automated validations in CI that state the rule and enforce it in the same place.
_Mechanism: the linter rules and the type constraints._

**08 · Behavior Is Verifiable, Not Asserted.** Every claim about how the system behaves (how long an operation may take, what data must not cross a certain boundary, what format must not break for the people already using it) is bound to an automated test that lives in the repository and goes red when the behavior strays from what was promised. A time limit written in a document goes stale; the same limit bound to a test that fails when it is exceeded is architecture. The test lives in the repository and runs before the change is integrated. If the system in production also fires an alert when something degrades, that is already the job of the environment it runs in, not of the architecture.
_Mechanism: an automated behavior test (performance, data contract, security) that lives in the repository and fails when the behavior deviates._

**09 · The Verification Surface Is Itself Bound.** The set of tests and rules that verify the repository is, in turn, a set of claims about the repository, so it too is bound. An agent can rewrite the code freely, but it cannot weaken or delete a test, a rule, or a validation to get a change through. Without a person reviewing, this is the principle that matters most: the cheapest way to make a validation pass is to remove it.
_Mechanism: a validation that goes red if the set of tests and rules changes without the authorization the repository defined._

## What Context Architecture does not do

An honest architecture says what it is not.

It is not an isolation or permissions system. The isolated environment the agent runs in, the network connections coming in and going out, the agent's credentials and identity are matters for the infrastructure, not for the repository's architecture.

It is not the machinery that runs the controls. The automated validations, the branch protection, the required reviewers already exist and apply the same way to an agent's change. Context Architecture decides what they must check, the infrastructure runs them.

It is not regulatory compliance. It is agnostic to regulations. That a company needs a person's signature because of a rule is the company's decision and the company's problem.

It does not impose tools. It names the kinds of mechanism, the repository picks the product. `oxlint` or `eslint`, it makes no difference.

It does not make the agent smarter or fix its hallucinations. It makes the truth of the repository checkable automatically, so the agent's error fails at once and where it happened, instead of integrating without anything noticing.

## Limits and cost

It does not apply everywhere.

It applies to repositories that absorb work from agents or from several people: refactors at scale, migrations, features with a clear spec. It applies from the first commit (a repository can be born legible) and to one that grew without design, which is then restructured in steps, never all at once.

Do not apply it to the first prototype of something you do not understand yet, nor to a poorly defined problem. Structuring is an investment that pays in proportion to the work the repository absorbs. On a throwaway project, the cost outweighs the return.

There is a cost: structuring up front, maintaining the tests and rules that are code and have to be cared for, an extra discipline on every change. But that work is mechanical, well specified, and repetitive, which is exactly what an agent does well. The person writes the intent and signs what they decide to sign, the agent maintains the mechanisms.

Context Architecture guarantees that a claim is bound to something that fails, not that the claim is the right one nor that the mechanism is sufficient. Knowing what to claim is still human judgment, the one scarce resource this architecture does not supply. That is why the set of verifications is the part that gets reviewed the most, not the part that gets delegated the most.

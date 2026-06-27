---
title: How to apply Context Architecture
description: "A hands-on guide to making a repository legible to people and AI agents: structure it so it says what it is, then bind every claim it makes about itself to a mechanism that fails when the claim stops being true. Works from the first commit and on a repo that already grew. A specification by Sergio Azócar."
eyebrow: Guide
definition: Context Architecture is applied two ways. On a new repository, you start it legible: the structure says what the system does and every claim is bound to a mechanism from the first commit. On a repository that already grew, you rework it in small steps, never with a big-bang rewrite. Either way, you bind every claim the repo makes about itself to a check that fails when the claim stops being true.
---

The [specification](/) says what Context Architecture is and why. This page is the part you do with
your hands.

It applies in two situations, and you pick your path by which one you are in.

You are starting a new repository. You want it born legible: the structure says what the system does,
and every claim it makes about itself is bound to a mechanism from the first commit. Nothing has
drifted yet, so the work is to keep drift from ever starting. Jump to
[starting a repo legible](#path-a-start-a-repo-legible).

You have a repository that already grew. It started clean and grew for three years. Conventions
drifted. The docs stopped matching the code. The folder names tell you which framework built the
thing, not what the thing does. Hand it to a reader with no memory, someone on their first day or an
agent started cold, and ask for one change: they cannot tell what anything means, where the change
goes, or which of two competing patterns is current. Nobody designed it to be read. Jump to
[reworking a repo that grew](#path-b-rework-a-repo-that-grew).

Both paths converge on the same end state and the same loop. The difference is only the starting
point and the cost. Born legible is cheaper, you pay as you go. Reworked is more expensive, you pay
down what already accrued, in steps.

## The loop, either way

Working with an agent is a continuous flow of code changes. Context Architecture lives inside that
flow, not off to the side. Every change does two things:

1. **Write the claim.** When a change introduces or modifies something the repo holds about itself, a
   source of truth, an invariant, a convention, you write that claim down where it belongs.
2. **Verify it.** You bind that claim to a mechanism that fails when it stops being true, in the same
   change.

Repeat on every change. A new repo runs this loop from commit one. An existing repo runs it too, plus
a backlog of claims that were never bound, which you work through in steps. That is the whole
difference between the two paths.

This is why the context grows with the system instead of trailing behind it. It is not a setup you do
once, it is a property maintained change by change. When a change adds a claim and leaves it loose,
review, by a person or an agent, catches it and requires it bound before the change is accepted.

## The one reader to design for

::callout{color="neutral"}
Assume a reader who keeps nothing between sessions and knows only what the repo states out loud. An
AI agent is exactly that reader. A new teammate is close. The question underneath all of it is one:
how long until that reader makes a correct change.
::

## Before you start: is it worth it?

It has a real cost. The structure up front, the checks that are themselves code you have to keep
green, and a small tax on every change to keep each claim tied to a mechanism.

It pays off in proportion to how much agent or multi-person work the repo takes on. Worth it on a
codebase that absorbs refactors, migrations, spec-driven features, agent contributions. Not worth it
on a throwaway prototype or a problem you have not figured out yet. There the tax costs more than it
returns, and skipping it is the right call. Saying that out loud is part of the discipline.

This holds for both paths. A new repo you know is throwaway does not need the discipline either.

## Path A: start a repo legible

A new project starts with the structure its framework hands it. That structure names the framework,
not the product, and the drift starts the day the second person commits. Starting legible means you
do not inherit that default and then fight it later.

You are building in the order the principles fall, and each piece ships with its mechanism:

1. **Lay out the top level by domain, not by framework layer.** `billing/`, `onboarding/`,
   `payments/`, not `controllers/`, `services/`, `utils/`. The framework lives one level down, inside
   the domain it serves. Doing this on day one costs nothing; doing it after three years is the most
   expensive move there is.

2. **Name every boundary for what it owns.** No `utils/`, `common/`, `helpers/` as a default dumping
   ground. A small `shared/` for genuinely generic, dependency-free code is fine, and it stays small.
   The mechanism: a lint rule that errors when a file lands in a folder that does not match its
   domain, and an import rule that breaks the build when a module reaches across a boundary it should
   not.

3. **Put a root `AGENTS.md` in from the first commit**, and one at each boundary as you create it. It
   holds only what the code cannot say on its own: the source of truth, the invariants, the tech debt
   you took on purpose. The mechanism: a test that fails if an `AGENTS.md` cites a path that no longer
   exists.

4. **Codify each convention the moment you decide it**, instead of writing it in a doc and hoping.
   The first time you would leave a review comment, make it a lint rule or a type instead. A
   convention an agent cannot read is a convention it will break.

5. **Bind behavior to a test, not to a sentence.** The first time you write "this operation responds
   within a certain time" or "this format must not break for current users," that line ships with the
   automated test that goes red when it stops holding.

6. **Generate the capability list, do not hand-maintain it.** From the first script, keep scripts and
   commands in predictable, named places and generate the list from those paths, with a test that
   fails if a real capability is missing from it.

7. **Bind the verification surface itself.** The set of tests and rules is a claim too. Protect it so
   a change cannot weaken or delete a check to get itself through.

Done this way, the five failure modes below never get a chance to accrue. You are not undoing drift,
you are refusing to start it. When you finish setup, you are already running [the loop](#the-loop-either-way):
each new change writes its claims and binds them in the same change.

## Path B: rework a repo that grew

You are not building a new city, you are putting street names on one that already sprawled. Do it in
small steps. You do not stop everything and restructure at once. You land one bounded, reversible
change at a time, and each one ships with the mechanism that keeps its claim honest. No big-bang
rewrite.

The order runs cheapest and safest first:

1. Read the repo as a cold reader, and name the failure modes you hit.
2. Fix the docs that lie.
3. Put `AGENTS.md` at the top boundaries.
4. Turn your most-repeated review comment into a lint rule.
5. Break up one junk-drawer folder.
6. Make the capabilities findable.
7. Move toward a domain-first layout, last, and only if it earns the churn.

There is no separate final step to "turn on" the loop. Once a change writes its claims and binds
them, you are already running [the loop](#the-loop-either-way). The steps below are the backlog of
claims the repo never bound; the loop is what stops a new one from going loose again.

The rest of this path is one step per section, then one full example.

### Step 1: audit the repo as a cold reader

Open the repo as if you had never seen it and remember nothing. Read the top-level tree, then the
boundaries, then a handful of leaf files. At each level, one question: could I make a correct change
here without asking anyone? Every "no" is a defect you just found.

The defects come in five shapes. These are diagnostic signals, the symptoms you look for when a repo
is silent about itself, not a fixed law. A better model lowers how often each one happens, but it does
not remove them where the repo states nothing out loud: with no source of truth to find, even a strong
model reimplements; with two live conventions and nothing saying which is current, it still has to
guess.

1. **Reimplementation.** The source of truth was not findable, so the reader rebuilds what already exists.
2. **Invented structure.** Nothing was imposed, so the reader imposes its own.
3. **Obedience to false docs.** It cites deleted files or contradicts the current code, with full confidence.
4. **Deprecated-pattern spread.** It copies the loudest pattern even when that pattern is dead.
5. **Coin-flip on ambiguity.** Two conventions coexist, so it picks whichever it read first.

Write down, per principle, a verdict and the evidence. Do it by hand, or load the
[Context Architecture skill](/skill) into your agent and let it write the report.

**What this looks like.** On a payments service, the first pass finds refund logic spread across three
folders (reimplementation waiting to happen), a `README` pointing at a deploy script that was deleted
months ago (false docs), and two date helpers with different signatures (a coin-flip). Three failure
modes named before you touch a line.

### Step 2: fix context-rot first

Start by stopping the docs from lying. A doc that cites a deleted file or contradicts the code is
worse than no doc at all, because a confident reader does what it says.

Find it by hand or by script: pull every file path, command, symbol, and link out of your `README`,
your `AGENTS.md` and `CLAUDE.md` files, and your design docs, and check that each one still exists or
still runs. Fix each lie against what the code actually does today.

Then make the rot impossible to bring back. Add a test that asserts every path the docs cite still
exists on disk. Now "this doc is accurate" is a claim with a mechanism behind it, instead of a hope.

**What this looks like.** The `README` documents a `deploy.sh` that was deleted a year ago. You drop
the dead reference, write down the real command, and add that path-check test. The next time someone
moves a file out from under a doc, the suite goes red in the same change, not in production six weeks
later.

### Step 3: place AGENTS.md at the top boundaries

Context belongs next to the code it describes, at every boundary that owns something. Put there, it
ages at the same rate as the code and gets read by the same agent about to edit it. Start at the root
and the two or three busiest directories. That is where each `AGENTS.md` buys the most legibility.

Write down only what you cannot get from reading the code: the source of truth, the invariants, the
tech debt you accepted on purpose, and the reasoning a spec left behind. Keep each one short.

```markdown
# AGENTS.md (billing)

Owns invoicing, refunds, and the dunning schedule.

## Source of truth
Prices come from the `pricing-engine` package, never hard-coded here.

## Invariants
- A refund never exceeds the captured amount. Enforced by `refunds/guard.test.ts`.
- All money is integer cents, no floats. Enforced by the `no-float-money` lint rule.

## Accepted tech debt
The legacy `chargeV1` path stays until the 2026-Q3 migration. Do not extend it.
```

Look at the invariants: each one names the mechanism that enforces it. That is the whole point. An
invariant with nothing behind it is just a new line that can rot. If the mechanism does not exist yet,
write it in the same change, or phrase the line as a known gap, not a guarantee.

### Step 4: codify the loudest convention

Take the comment you leave most often in review, the one that lives only in your team's heads, and put
it in the toolchain. A convention an agent cannot read is a convention it will break, every time.

This is the move the rest of the steps lean on. When a claim needs to hold, this is how it holds:
a lint rule that states the convention and fails in the same place, or a type that makes the wrong
thing refuse to compile.

**What this looks like.** The comment you leave most is "import from the package root, not deep
paths." Today it lives in reviewers' heads, so an agent breaks it on its first commit.

```text
# before: a convention that lives in reviewers' heads
"always import from the package root, never deep paths"

# after: the convention, written down and enforced
.oxlintrc.json   # a no-restricted-imports rule that fails the deep path in CI
```

Once the rule is in the linter, the deep path fails on the spot, with a message that cites the rule,
not a reviewer who happened to be paying attention that day.

### Step 5: name a junk-drawer boundary

`utils/`, `common/`, `helpers/`, `core/`, `lib/`. This is where responsibility goes to die. Nothing in
the name pushes back on unrelated code, so the folder grows forever. Pick the worst one and split it
into folders whose names each say what they own.

```text
# before
src/utils/        # 40 unrelated files

# after
src/pricing/      # the price math that was hiding in utils
src/auth-session/ # the session helpers that were hiding in utils
src/shared/       # what is genuinely generic, kept small and dependency-free
```

The name is doing the work. A folder called `pricing` resists code that is not about pricing, because
it stops fitting. If you cannot name a boundary precisely, the boundary is wrong, and `shared` is not
the answer. A tiny `shared/` for a date formatter or a result type is fine. Reaching for the generic
name to dodge the question of where something belongs is the debt.

### Step 6: make capabilities discoverable

A capability an agent cannot find is, to that agent, a capability that does not exist. It just gets
rebuilt, or skipped. Move your scripts, generators, and commands to predictable, named places, and
name them for what they do: `package.json` scripts, a `scripts/` or `skills/` directory, commands you
actually wrote down.

Better, generate the list of capabilities from those conventional paths instead of keeping it by hand,
and test that the list is complete. A hand-kept list is one more claim waiting to rot.

**What this looks like.** Three deploy and seed scripts live in one engineer's home directory and a
Slack thread nobody can find. You move them into `scripts/` with names that say what they do and list
them in `package.json`. The next agent finds them where it looks first, instead of writing a fourth.

### Step 7: move toward a domain-first structure (last)

The top level should say what the system does, not which framework built it: `billing/`, `onboarding/`,
`payments/`, not `controllers/`, `services/`, `utils/`. The framework lives one level down, inside the
domain it serves.

This is the expensive move and the one most likely to break imports, so it goes last and goes in
slices. Often a partial move plus a root `AGENTS.md` that spells out the structure you are migrating
toward buys more legibility, per file moved, than reshuffling everything at once.

```text
# before: organized by technical layer
src/
  controllers/
  services/
  models/
  utils/

# after: organized by domain, framework one level down
src/
  billing/
    controllers/   # the framework, inside the domain it serves
    services/
    models/
  onboarding/
  payments/
```

Keep it from sliding back with a lint rule that stops domain code from leaking into a layer folder,
and keep the target structure in the root `AGENTS.md` so a reader who lands mid-migration knows which
way is forward.

## A worked example, end to end

This walks Path B, the harder one. A service that started as one framework app and grew for three
years. The tree screams the framework, not the product, and the only doc is a `README` that is half
wrong.

```text
# before
src/
  controllers/      # 22 files, mixed domains
  services/         # 18 files, mixed domains
  models/
  utils/            # the junk drawer
  helpers/          # a second junk drawer
README.md           # points at a deploy script deleted last year
```

Ask an agent to "add a partial-refund flow" here and watch it hit three of the five failure modes in
one task: it cannot find where refunds live (split across `controllers/`, `services/`, `models/`), it
rebuilds money math that already sits in `utils/`, and it follows the `README` to a deploy script that
is gone.

The fix, in the order above, with no big-bang commit:

1. **Context-rot.** Drop the dead deploy reference from the `README`, write the real command, add a
   test that every path the `README` and `AGENTS.md` cite still exists.
2. **Embedded context.** A root `AGENTS.md` (what the service owns, the structure it is migrating
   toward) and one in the busiest area.
3. **Codify.** The most-repeated review comment was "money is integer cents." That becomes a
   `no-float-money` lint rule.
4. **Name.** Split `utils/` and `helpers/`: money math becomes `money/`, session code becomes
   `auth-session/`, the genuinely generic remainder stays in a small `shared/`.
5. **Discoverable.** The ad-hoc scripts move into `scripts/` with real names, listed in `package.json`.
6. **Domain-first, in slices.** Move `refunds` first: a `billing/refunds/` that keeps its controller,
   service, and model together. The next agent asked about refunds finds them in one place.

```text
# after
src/
  billing/
    AGENTS.md       # invariants and the source of truth for billing
    refunds/        # controller + service + model, together
    invoices/
  auth-session/
  money/            # the math that was buried in utils, now named and enforced
  shared/           # small, generic, dependency-free
scripts/            # named, listed in package.json
AGENTS.md           # the rules of the house, and the structure being migrated toward
README.md           # accurate, and a test keeps it that way
```

Now the same task lands in `billing/refunds/`, against an `AGENTS.md` that states the refund invariant,
reusing the `money/` package the lint rule already points at. Each claim the repo makes is bound to a
mechanism, and from here the loop keeps it that way: the next change that adds a claim binds it in the
same change. The failure modes have nowhere left to happen.

## Run it with the skill

Step 1 and most of the moves above are things an agent can run. The
[Context Architecture skill](/skill) is a single file you load into your agent: it reads the repo as a
cold reader, finds the docs that lie, and hands back the backlog in the order above. Point it at your
repository and start with what it flags first.

## Where to go next

- The [specification](/): the rule, the autonomy spectrum, the mechanism kinds, and the nine
  principles in full.
- The [comparison](/comparison) with context engineering and harness engineering: which layer each one
  designs, and why this one sits below them at design time.
- The [skill](/skill): to run the work with your own agent.
- The [glossary](/glossary): the terms used across the specification, defined.

---
title: Context Architecture vs. context engineering vs. harness engineering
description: Three disciplines, three stances on the codebase. Context Architecture designs the codebase itself at design time, independent of any agent, the counterpart to context engineering (runtime) and harness engineering (the agent's operating loop). A specification by Sergio Azócar.
eyebrow: Comparison
definition: Context engineering designs the contents of the context window. Harness engineering designs everything wrapped around one agent. Context Architecture designs the codebase itself, at design time and independent of any agent.
---

The terms get confused easily because they all touch AI agents and code. They are not competitors.
They take different stances on the codebase. The distinction is best drawn with one question: what
does each one design?

## The three disciplines

| Discipline               | What it designs                                 | Layer                                   | Question it answers                                                  |
| ------------------------ | ----------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| Context engineering      | The contents of the context window              | Runtime                                 | What does the model see right now?                                   |
| Harness engineering      | The guides and sensors wrapped around one agent | The agent's operating loop              | How does this agent get steered and corrected?                      |
| **Context Architecture** | **The codebase itself**                         | **Software architecture (design-time)** | **How is the system structured so people and agents understand it?** |

::diagram-layers
::

Some vendors use "context architecture" for the first row, the runtime layout of the context window.
This specification calls that context engineering and reserves Context Architecture for the codebase.

## The codebase as input vs. the codebase as object

The other disciplines treat the codebase as an _input_. The harness reads it. Context engineering
compresses it into a window. The agent navigates it. In every case the codebase is a given,
something to be consumed.

Context Architecture treats the codebase as the _object of design_. It asks how the repo should be
structured in the first place, before any agent reads it.

This is the line that still separates the disciplines now that harness engineering has moved toward
the repository. As OpenAI and Thoughtworks use the term today, the harness includes the AGENTS.md an
agent reads and the linters that enforce structure, and Thoughtworks treats a coding agent's harness
as a form of context engineering. The stance is what divides them: the harness and context
engineering consume the codebase for one agent at one moment; Context Architecture designs the
codebase, and its rule holds whatever agent or harness reads the result.

And there is a causal relationship between the layers. A codebase with good Context Architecture takes
work off every other one: less to compress at runtime, fewer corrective guardrails in the harness,
fewer errors to patch across sessions. Structure done well at design time pays off at every layer
downstream.

## Harness engineering, as OpenAI uses it

OpenAI's account of harness engineering (February 2026) describes an AGENTS.md kept to about a hundred
lines as a map, a docs directory treated as the system of record, custom linters whose messages steer
the agent, and background jobs that collect stale docs. Thoughtworks (Böckeler, April 2026) splits the
same work into guides and sensors, and names architectural fitness functions among them. That is most
of Context Architecture's territory, described as a practice with one toolchain, months before this
specification was published.

Context Architecture is not that practice; it is the rule the practice meets or misses. OpenAI's
"promote the rule into code" and Böckeler's sensors are mechanisms in the sense used here. What this
specification adds is that the rule applies to the prose claims too, an AGENTS.md that cites a deleted
file is a violation, and to the set of mechanisms itself (principle 09), which no harness practice
binds.

## Readiness scores and instruction linters

A repository's fitness for agents is now scored. Factory's Agent Readiness grades pillars across
levels; agent-ready and agents-lint check for hooks, rulesets, dead paths, and stale scripts. These
are close cousins of Context Architecture and useful next to it, but they measure presence: is there a
linter, are there tests, is there an AGENTS.md. Context Architecture asks whether each mechanism fails
when its claim stops being true, and whether the checklist itself is bound. A scorecard can read green
with tests that never fail; the rule cannot.

## An analogy

Harness engineering designs the vehicle, its safety controls, and the driver's own notes about the
roads. Context engineering decides which map to load for each trip. Context Architecture is the
urbanism of the city itself: streets with clear names and neighborhoods with internal logic let any
driver, person or agent, navigate without a sophisticated GPS.

A well-planned city is not a function you bolt onto a bad one. It is the substrate that makes every
trip through it cheaper. That is Context Architecture's relationship to the layers above.

## Related work, dated

Context Architecture states its lineage rather than claim novelty over it. Each of these predates or
runs parallel to the specification and supports one part of it.

- **Ford, Parsons, and Kua, 2017.** Architectural fitness functions: an objective check bound to an
  architectural characteristic. The lineage of the word "mechanism" here.
- **Anthropic, September 2025.** File hierarchies, naming conventions, and timestamps are signals an
  agent reads, which is principles 01 and 04.
- **Simon Willison, September and October 2025.** A robust, stable test suite lets agentic tools fly,
  and an AGENTS.md should carry real command examples (principles 05 and 08).
- **Birgitta Böckeler, October 2025 and 2026.** The spec-driven taxonomy (principle 06) and the
  harness sensors, including fitness functions, that this page draws on.
- **OpenAI, February 2026.** Harness engineering: AGENTS.md as a map, docs as the system of record,
  and "promote the rule into code" (principles 01, 02, 07).
- **Gloaguen et al., 2026.** Repository overview files do not generally raise task success and add
  over 20% to inference cost, which is why principle 02 keeps an AGENTS.md to what the code cannot say.
- **Thoughtworks Technology Radar, 2026.** AGENTS.md, agent instruction bloat, feedback sensors, and
  codebase cognitive debt, the field's names for what the rule binds.

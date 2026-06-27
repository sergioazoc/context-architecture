---
title: Context Architecture vs. context engineering vs. harness engineering
description: Three disciplines, three objects of design. Context Architecture designs the codebase itself, the design-time counterpart to context engineering (runtime) and harness engineering (the agent's operating environment). A specification by Sergio Azócar.
eyebrow: Comparison
definition: Context engineering designs the contents of the context window. Harness engineering designs the agent's execution environment. Context Architecture designs the codebase itself, at design time.
---

The terms get confused easily because they all touch AI agents and code. They are not competitors.
They operate on different objects, at different layers. The distinction is best drawn with one
question: what does each one design?

## The three disciplines

| Discipline               | What it designs                    | Layer                                   | Question it answers                                                   |
| ------------------------ | ---------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Context engineering      | The contents of the context window | Runtime                                 | What does the model see right now?                                    |
| Harness engineering      | The agent's execution environment  | Infrastructure / operations             | How does the agent operate safely and self-correct?                   |
| **Context Architecture** | **The codebase itself**            | **Software architecture (design-time)** | **How do I structure the system so people and agents understand it?** |

::diagram-layers
::

## The codebase as input vs. the codebase as object

The other disciplines treat the codebase as an _input_. The harness reads it. Context engineering
compresses it into a window. The agent navigates it. In every case the codebase is a given,
something to be consumed.

Context Architecture treats the codebase as the _object of design_. It asks how the repo should be
structured in the first place, before any agent reads it.

And there is a causal relationship between the two. A codebase with good Context Architecture takes
work off every other layer: less to compress at runtime, fewer corrective guardrails in the harness,
fewer errors to patch across sessions. Structure done well at design time pays off at every layer
downstream.

## An analogy

Harness engineering designs the vehicle and its safety controls. Context engineering decides which
map to load for each trip. Context Architecture is the urbanism of the city itself: streets with
clear names and neighborhoods with internal logic let any driver, person or agent, navigate without
a sophisticated GPS.

A well-planned city is not a function you bolt onto a bad one. It is the substrate that makes every
trip through it cheaper. That is Context Architecture's relationship to the layers above.

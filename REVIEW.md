# Review rules

Read by AI reviewers (Claude Code Review, CodeRabbit) and by people. On every change, flag as
important any of the following, and require the fix in the same change.

- A doc left lying: an `AGENTS.md`, the `README`, a content page, or a `SKILL.md` that cites a path,
  command, component, route, or URL that no longer exists or no longer matches the code.
- A new claim left loose: a source of truth, an invariant, a convention, or a boundary added without
  the mechanism that fails when it stops being true.
- The verification surface weakened: a lint rule dropped below `error`, a CI step removed, a test
  deleted, or a deny rule loosened, unless the pull request states it is intended (principle 09).
  The maintainer's merge is the only authorization, so the intent must be on the record.
- EN and ES out of parity, or an em dash, an emoji, or marketing copy, against the house rules in the
  root `AGENTS.md`.

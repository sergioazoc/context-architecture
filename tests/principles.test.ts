import { describe, it, expect } from 'vitest'
import { read } from './repo'

// The canonical nine principles, in order. The manifesto, the Spanish mirror's
// markers, and the distributable SKILL.md must agree, so a rename or a
// renumbering during a rewrite cannot drift silently (the failure the audit caught).
const CANON = [
  'Structure Screams Intent',
  'Context Lives With Code',
  'Boundaries Are Explicit and Named',
  'The Repo Is Legible at Every Zoom Level',
  'Capabilities Are Discoverable',
  'Intent Becomes Mechanism',
  'Conventions Are Codified, Not Implicit',
  'Behavior Is Verifiable, Not Asserted',
  'The Verification Surface Is Itself Bound',
]
const num = (i: number): string => String(i + 1).padStart(2, '0')

describe('principle numbering is canonical and consistent', () => {
  it('the English manifesto lists principles 01-09 with the canonical names in order', () => {
    const body = read('content/en/index.md')
    CANON.forEach((name, i) => {
      expect(body, `manifesto principle ${num(i)}`).toContain(`**${num(i)} · ${name}.**`)
    })
  })

  it('the SKILL.md restates the same nine names under the same numbers', () => {
    const skill = read('skills/context-architecture/SKILL.md')
    CANON.forEach((name, i) => {
      expect(skill, `skill principle ${num(i)}`).toContain(`**${num(i)} · ${name}.**`)
    })
  })
})

import { describe, it, expect } from 'vitest'
import { readdirSync } from 'node:fs'
import { read, exists, ROOT } from './repo'

// Principle 02 / context-rot: a doc must not cite a file that no longer exists.
// We scan the repo's self-describing docs (the AGENTS.md set, the README, the
// SKILL.md) for backtick tokens that point at a real repo file (first path
// segment is an actual top-level entry and the token has a file extension), and
// assert each resolves. Illustrative example paths (billing/, src/utils/,
// scripts/deploy.sh) are excluded because their first segment is not a real
// top-level entry, so they never match.
const DOCS = [
  'AGENTS.md',
  'README.md',
  'app/AGENTS.md',
  'content/AGENTS.md',
  'server/AGENTS.md',
  'skills/AGENTS.md',
  'skills/context-architecture/SKILL.md',
]
const topLevel = new Set(readdirSync(ROOT))

function repoPathsIn(md: string): string[] {
  const tokens = [...md.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())
  return [...new Set(tokens)].filter((t) => {
    if (/\s/.test(t)) return false // a command or sentence, not a path
    const clean = t.replace(/^\.\//, '')
    const first = clean.split('/')[0]
    const hasExt = /\.[a-z0-9]+$/i.test(clean)
    return hasExt && topLevel.has(first)
  })
}

describe('doc references resolve (principle 02)', () => {
  for (const doc of DOCS) {
    it(`${doc} cites only files that exist`, () => {
      const missing = repoPathsIn(read(doc))
        .map((p) => p.replace(/^\.\//, ''))
        .filter((p) => !exists(p))
      expect(missing, `${doc} cites missing paths`).toEqual([])
    })
  }
})

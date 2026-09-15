import { describe, it, expect } from 'vitest'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { walk, read, ROOT } from './repo'

// Size is a claim too (guide step 3): the concatenated AGENTS.md chain an agent
// loads from the root down to a leaf must fit the tightest tool budget, or a
// reader on that tool silently loses the deeper files. Codex caps the whole chain
// at 32 KiB; Windsurf and Antigravity cap a single rule file at 12,000 characters.
const CHAIN_BUDGET = 32 * 1024
const FILE_BUDGET = 12_000

const agentsMds = walk('.', (p) => p.endsWith('AGENTS.md')).map((p) => p.replace(/^\.\//, ''))
const dirOf = (p: string): string => (p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '')

// The AGENTS.md files an agent reads for a leaf directory: every AGENTS.md whose
// directory is an ancestor of, or equal to, the leaf.
const chainFor = (leafDir: string): string[] =>
  agentsMds.filter((p) => {
    const d = dirOf(p)
    return d === '' || leafDir === d || leafDir.startsWith(`${d}/`)
  })

describe('AGENTS.md size budgets (guide step 3)', () => {
  it('no single AGENTS.md exceeds the 12,000-character rule-file cap', () => {
    const over = agentsMds.filter((p) => read(p).length > FILE_BUDGET)
    expect(over, 'AGENTS.md files over 12,000 characters').toEqual([])
  })

  it('no root-to-leaf AGENTS.md chain exceeds the 32 KiB Codex cap', () => {
    const leafDirs = [...new Set(agentsMds.map(dirOf))]
    const over = leafDirs
      .map((leaf) => ({
        leaf: leaf || '(root)',
        bytes: chainFor(leaf).reduce((n, p) => n + statSync(join(ROOT, p)).size, 0),
      }))
      .filter((x) => x.bytes > CHAIN_BUDGET)
    expect(over, 'AGENTS.md chains over 32 KiB').toEqual([])
  })
})

import { describe, it, expect } from 'vitest'
import { walk, read } from './repo'

// House rules (root AGENTS.md): no em dashes and no emoji anywhere. This binds
// both, across the shipped Markdown and the code comments. CLAUDE.md files are
// symlinks to their AGENTS.md, so they are skipped to avoid double-counting.
const isMd = (p: string): boolean => p.endsWith('.md') && !p.endsWith('CLAUDE.md')
const isCode = (p: string): boolean => /\.(ts|vue|css)$/.test(p)

const MD_FILES = [
  ...walk('content', isMd),
  ...walk('app', isMd),
  ...walk('server', isMd),
  ...walk('skills', isMd),
  'AGENTS.md',
  'README.md',
]
// The site's production code plus its CI and config files. tests/ is excluded
// because this very test holds the em dash character it searches for, like the
// rule line in the docs.
const CODE_FILES = [
  ...walk('app', isCode),
  ...walk('server', isCode),
  ...walk('.github', (p) => p.endsWith('.yml')),
  'nuxt.config.ts',
  'content.config.ts',
  'vitest.config.ts',
  'wrangler.jsonc',
  '.oxlintrc.json',
  '.claude-plugin/marketplace.json',
]
const EMOJI = /\p{Extended_Pictographic}/u

const emDashLines = (files: string[], allowRuleLine: boolean): string[] => {
  const offenders: string[] = []
  for (const file of files) {
    read(file)
      .split('\n')
      .forEach((line, i) => {
        // The one line stating the rule has to show the character it forbids.
        if (line.includes('—') && !(allowRuleLine && /em dash/i.test(line))) {
          offenders.push(`${file}:${i + 1}`)
        }
      })
  }
  return offenders
}

describe('house wording conventions', () => {
  it('uses no em dashes in shipped Markdown (except the rule that names it)', () => {
    expect(emDashLines(MD_FILES, true), 'Markdown lines with an em dash').toEqual([])
  })

  it('uses no em dashes in code comments', () => {
    expect(emDashLines(CODE_FILES, false), 'code lines with an em dash').toEqual([])
  })

  it('uses no emoji', () => {
    const offenders = [...MD_FILES, ...CODE_FILES].filter((f) => EMOJI.test(read(f)))
    expect(offenders, 'files with emoji').toEqual([])
  })

  // The design brief was removed (principle 06). Its "§N" section pointers must not
  // survive in docs or comments, where they cite something no longer in the tree.
  it('has no dangling section pointers (§) from the removed design brief', () => {
    const offenders: string[] = []
    for (const file of [...MD_FILES, ...CODE_FILES]) {
      read(file)
        .split('\n')
        .forEach((line, i) => {
          if (line.includes('§')) offenders.push(`${file}:${i + 1}`)
        })
    }
    expect(offenders, 'lines with a dangling § pointer').toEqual([])
  })
})

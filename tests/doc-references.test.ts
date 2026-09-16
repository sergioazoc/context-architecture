import { describe, it, expect } from 'vitest'
import { readdirSync, existsSync, lstatSync, readlinkSync } from 'node:fs'
import { join } from 'node:path'
import { read, exists, walk, ROOT } from './repo'

// Principle 02 / context-rot: a doc must not cite a repo path, component, or
// command that no longer exists. We scan the repo's self-describing docs (the
// AGENTS.md set and the README) and assert every citation resolves: full paths
// (first segment is a real top-level entry), bare source filenames (resolved by
// basename), directories, and the components and composables app/AGENTS.md names.
// The distributable SKILL.md is standalone and full of illustrative paths
// (billing/, refunds/guard.test.ts), so it is scanned only by the conservative
// first-segment rule, under which those examples never match.
const topLevel = new Set(readdirSync(ROOT))

// Source-code extensions: safe to resolve by bare basename, since a rename would
// break the citation. Markdown, JSON and text are not, because they have
// illustrative or generated instances (llms.txt is emitted, not committed), so
// they are resolved only when cited with a real top-level directory in the path.
const CODE_EXT = new Set(['ts', 'vue', 'css', 'mjs', 'mts', 'cjs'])

// Every file basename in the tracked tree, for a citation like `app.config.ts`
// that names a source file without its directory.
const basenames = new Set(walk('.', () => true).map((p) => p.split('/').pop() as string))

// The repo's own boundary docs describe THIS repo, so every path they cite must
// resolve. Discovered by walking, not hand-listed, so a new AGENTS.md is covered.
const AGENTS_MDS = walk('.', (p) => p.endsWith('AGENTS.md')).map((p) => p.replace(/^\.\//, ''))
const REPO_DOCS = [...AGENTS_MDS, 'README.md']
const STANDALONE_DOCS = ['skills/context-architecture/SKILL.md']

const backtickTokens = (md: string): string[] =>
  [...new Set([...md.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim()))].filter((t) => !/\s/.test(t))

const extOf = (t: string): string => (/\.([a-z0-9]+)$/i.exec(t)?.[1] ?? '').toLowerCase()

// The repo paths a doc cites that do not exist on disk. `loose` enables
// basename resolution of bare source filenames (only for the repo's own docs).
function missingIn(md: string, loose: boolean): string[] {
  const missing: string[] = []
  for (const raw of backtickTokens(md)) {
    const t = raw.replace(/^\.\//, '')
    // Skip brace-expansion and glob patterns (content/{en,es}/, tests/**/*.test.ts):
    // they document a set of paths, not one literal file.
    if (/[{}*]/.test(t)) continue
    if (t.includes('/')) {
      const first = t.split('/')[0]
      const isDir = t.endsWith('/')
      if (topLevel.has(first) && (extOf(t) !== '' || isDir)) {
        if (!exists(t.replace(/\/$/, ''))) missing.push(t)
      }
    } else if (loose && CODE_EXT.has(extOf(t))) {
      if (!basenames.has(t)) missing.push(t)
    }
  }
  return missing
}

describe('doc references resolve (principle 02)', () => {
  for (const doc of REPO_DOCS) {
    it(`${doc} cites only files that exist`, () => {
      expect(missingIn(read(doc), true), `${doc} cites missing paths`).toEqual([])
    })
  }
  for (const doc of STANDALONE_DOCS) {
    it(`${doc} cites only files that exist`, () => {
      expect(missingIn(read(doc), false), `${doc} cites missing paths`).toEqual([])
    })
  }

  // The check must be able to fail (the rule applies to the mechanism itself).
  it('flags a citation to a file that does not exist', () => {
    expect(missingIn('see `app/does-not-exist.ts` here', true)).toContain('app/does-not-exist.ts')
  })
})

describe('app/AGENTS.md names real components and composables (principle 02)', () => {
  const components = new Set(
    walk('app/components', (p) => p.endsWith('.vue')).map((p) =>
      (p.split('/').pop() as string).replace(/\.vue$/, ''),
    ),
  )
  const composables = new Set(
    walk('app/composables', (p) => p.endsWith('.ts')).map((p) =>
      (p.split('/').pop() as string).replace(/\.ts$/, ''),
    ),
  )
  const doc = read('app/AGENTS.md')

  it('every component it names in backticks (except Nuxt UI) has a .vue file', () => {
    const cited = [...doc.matchAll(/`([A-Z][A-Za-z0-9]+)`/g)].map((m) => m[1])
    const missing = cited.filter((c) => !/^U[A-Z]/.test(c) && !components.has(c))
    expect(missing, 'cited components with no .vue file').toEqual([])
  })

  it('every use* composable it names has a .ts file', () => {
    const cited = [...new Set([...doc.matchAll(/\buse[A-Z][A-Za-z0-9]+/g)].map((m) => m[0]))]
    const missing = cited.filter((c) => !composables.has(c))
    expect(missing, 'cited composables with no .ts file').toEqual([])
  })
})

describe('the repo structure claims hold (principles 05, 06, 09)', () => {
  it('every test file is documented in the root AGENTS.md', () => {
    const agents = read('AGENTS.md')
    const missing = walk('tests', (p) => p.endsWith('.test.ts'))
      .map((p) => p.split('/').pop() as string)
      .filter((name) => !agents.includes(name))
    expect(missing, 'test files not cited in AGENTS.md').toEqual([])
  })

  it('has no specs/ directory (principle 06)', () => {
    expect(exists('specs')).toBe(false)
  })

  it('every nested AGENTS.md is named in the root map', () => {
    const rootDoc = read('AGENTS.md')
    const nested = AGENTS_MDS.filter((p) => p !== 'AGENTS.md')
    const missing = nested.filter((p) => !rootDoc.includes(p))
    expect(missing, 'nested AGENTS.md not linked from the root').toEqual([])
  })
})

describe('the CLAUDE.md bridge holds (principle 02)', () => {
  for (const doc of AGENTS_MDS) {
    it(`${doc} has a CLAUDE.md that bridges to it`, () => {
      const claudePath = doc.replace(/AGENTS\.md$/, 'CLAUDE.md')
      expect(exists(claudePath), `${claudePath} is missing`).toBe(true)
      const abs = join(ROOT, claudePath)
      if (lstatSync(abs).isSymbolicLink()) {
        expect(readlinkSync(abs), `${claudePath} must link to AGENTS.md`).toBe('AGENTS.md')
      } else {
        expect(read(claudePath).trim(), `${claudePath} must import @AGENTS.md`).toBe('@AGENTS.md')
      }
    })
  }
})

const OUT = join(ROOT, '.output/public')
describe.skipIf(!existsSync(OUT))('config file references resolve in the build', () => {
  it('every /...(txt|md|xml) path in the config exists in the prerendered output', () => {
    // Single-segment served artifacts only (/skill.md, /llms-full.txt), so a
    // deep path mentioned in a comment (server/routes/skill.md.ts) is not misread
    // as a URL. This is the check that catches the /llms_full.txt-style typo.
    const refs = new Set<string>()
    for (const f of ['nuxt.config.ts', 'public/_headers', 'wrangler.jsonc']) {
      for (const m of read(f).matchAll(/(?<![\w/.])\/[a-z0-9][a-z0-9_-]*\.(?:txt|md|xml)\b/gi)) {
        refs.add(m[0])
      }
    }
    const missing = [...refs].filter((r) => !existsSync(join(OUT, r.replace(/^\//, ''))))
    expect(missing, 'config cites files absent from the build').toEqual([])
  })
})

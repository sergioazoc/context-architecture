import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { read, ROOT } from './repo'
import { CANONICAL_DEFINITION, SITE_DESCRIPTION } from '../app/site-definition'

// Citability (the site's second outcome) depends on every surface carrying one
// definition, including the mechanism clause that distinguishes it. This binds
// that: the frontmatter definition and the glossary body carry it verbatim, the
// feed and meta descriptions start with it, the README opens with it, and the
// prerendered HTML never ships a divergent wording. app/composables emit the same
// string, so a change there flows here through app/site-definition.ts.
const flat = (s: string): string => s.replace(/\s+/g, ' ').trim()

describe('one canonical definition across surfaces (citability)', () => {
  for (const locale of ['en', 'es'] as const) {
    const canonical = CANONICAL_DEFINITION[locale]
    it(`content/${locale}/index.md carries the canonical definition verbatim`, () => {
      expect(flat(read(`content/${locale}/index.md`))).toContain(canonical)
    })
    it(`content/${locale}/glossary.md carries the canonical definition verbatim`, () => {
      expect(flat(read(`content/${locale}/glossary.md`))).toContain(canonical)
    })
  }

  it('the shared site and llms description starts with the canonical definition', () => {
    expect(SITE_DESCRIPTION.startsWith(CANONICAL_DEFINITION.en)).toBe(true)
  })

  it('the README opens with the canonical definition', () => {
    const firstParagraph = flat(read('README.md').split('\n\n')[1] ?? '')
    expect(firstParagraph.startsWith(CANONICAL_DEFINITION.en)).toBe(true)
  })
})

const OUT = join(ROOT, '.output/public')
describe.skipIf(!existsSync(OUT))('the prerendered HTML ships one wording (citability)', () => {
  it('the English home carries the canonical clause and not the divergent one', () => {
    const body = readFileSync(join(OUT, 'index.html'), 'utf8')
    expect(body).toContain('fails when that claim stops being true')
    expect(body).not.toContain('fails when the claim stops being true')
  })
  it('the Spanish home carries the canonical clause', () => {
    const body = readFileSync(join(OUT, 'es/index.html'), 'utf8')
    expect(body).toContain('falla cuando esa afirmación deja de ser cierta')
  })
})

import { describe, it, expect } from 'vitest'
import { read, contentPages } from './repo'

// content/AGENTS.md rule: any change to an English file is mirrored in its Spanish
// counterpart. This binds that prose claim to a mechanism.
const PAGES = ['index', 'comparison', 'guide', 'glossary', 'skill']
const MDC = ['::rule', '::diagram-tree', '::diagram-layers', '::callout']
const headingCount = (s: string): number => (s.match(/^#{2,3} /gm) ?? []).length
const usesTag = (s: string, tag: string): boolean => new RegExp(`^${tag}$`, 'm').test(s)

describe('content parity (EN/ES)', () => {
  it('exposes the same set of pages in both locales', () => {
    expect(contentPages('es')).toEqual(contentPages('en'))
  })

  it('both manifestos carry the nine numbered principles', () => {
    for (const locale of ['en', 'es'] as const) {
      const body = read(`content/${locale}/index.md`)
      for (let n = 1; n <= 9; n++) {
        expect(body, `${locale} missing principle 0${n}`).toContain(`**0${n} ·`)
      }
    }
  })

  it('each page uses the same MDC components in both locales', () => {
    for (const page of PAGES) {
      const en = read(`content/en/${page}.md`)
      const es = read(`content/es/${page}.md`)
      for (const tag of MDC) {
        expect(usesTag(es, tag), `${page}: ${tag} parity`).toBe(usesTag(en, tag))
      }
    }
  })

  it('each page has the same heading count in both locales', () => {
    for (const page of PAGES) {
      expect(headingCount(read(`content/es/${page}.md`)), `${page} heading parity`).toBe(
        headingCount(read(`content/en/${page}.md`)),
      )
    }
  })
})

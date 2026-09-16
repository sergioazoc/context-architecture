import { describe, it, expect } from 'vitest'
import { read, contentPages } from './repo'

// content/AGENTS.md rule: any change to an English file is mirrored in its Spanish
// counterpart. This binds that prose claim to a mechanism.
const PAGES = ['index', 'comparison', 'guide', 'glossary', 'skill']
const MDC = ['::rule', '::diagram-tree', '::diagram-layers', '::callout']
const headingCount = (s: string): number => (s.match(/^#{2,3} /gm) ?? []).length
const usesTag = (s: string, tag: string): boolean => new RegExp(`^${tag}$`, 'm').test(s)
const count = (s: string, re: RegExp): number => (s.match(re) ?? []).length

// Top-level frontmatter keys, sorted, so EN and ES declare the same fields.
const fmKeys = (s: string): string[] => {
  const m = /^---\n([\s\S]*?)\n---/.exec(s)
  return m ? [...m[1].matchAll(/^([a-zA-Z][\w-]*):/gm)].map((x) => x[1]).sort() : []
}

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

  // Heading count alone lets a paragraph, a mechanism line, a table row, a code
  // span, or a link vanish in translation. These structural counts catch that: a
  // mechanism line dropped in ES, or a table row lost, turns the suite red.
  it('each page keeps the same structural counts in both locales', () => {
    for (const page of PAGES) {
      const en = read(`content/en/${page}.md`)
      const es = read(`content/es/${page}.md`)
      // Mechanism markers are locale-specific strings, so compare their counts.
      expect(count(es, /^_Mecanismo:/gm), `${page} mechanism lines`).toBe(
        count(en, /^_Mechanism:/gm),
      )
      expect(count(es, /^\|/gm), `${page} table rows`).toBe(count(en, /^\|/gm))
      expect(count(es, /^```/gm), `${page} fenced blocks`).toBe(count(en, /^```/gm))
      expect(count(es, /\]\(\//g), `${page} internal links`).toBe(count(en, /\]\(\//g))
      expect(count(es, /`[^`]+`/g), `${page} code spans`).toBe(count(en, /`[^`]+`/g))
    }
  })

  it('each page declares the same frontmatter keys in both locales', () => {
    for (const page of PAGES) {
      expect(fmKeys(read(`content/es/${page}.md`)), `${page} frontmatter keys`).toEqual(
        fmKeys(read(`content/en/${page}.md`)),
      )
    }
  })
})

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './repo'

// The schema.org graph is the project's #2 outcome (citability / GEO). The root
// AGENTS.md promises DefinedTerm + Person(sameAs) + TechArticle as the floor; this
// binds that promise to the prerendered output so a silent schema regression fails.
// Runs after `pnpm generate` (CI builds before testing); skipped without a build.
const OUT = join(ROOT, '.output/public')
const built = existsSync(OUT)
const html = (p: string): string => readFileSync(join(OUT, p), 'utf8')

function jsonLdTypes(file: string): string[] {
  const blocks = [
    ...html(file).matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs),
  ]
  const found: string[] = []
  const collect = (v: unknown): void => {
    if (Array.isArray(v)) v.forEach(collect)
    else if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>
      if (typeof o['@type'] === 'string') found.push(o['@type'])
      Object.values(o).forEach(collect)
    }
  }
  for (const b of blocks) {
    try {
      collect(JSON.parse(b[1]))
    } catch {
      // A block that is not plain JSON is not part of the schema graph we assert.
    }
  }
  return found
}

const jsonLdBlockCount = (file: string): number =>
  [...html(file).matchAll(/<script type="application\/ld\+json"[^>]*>/g)].length

describe.skipIf(!built)('structured data floor (citability / GEO)', () => {
  for (const [page, file] of [
    ['English', 'index.html'],
    ['Spanish', 'es/index.html'],
  ] as const) {
    it(`${page} home emits DefinedTerm, Person, and TechArticle`, () => {
      const types = jsonLdTypes(file)
      for (const type of ['DefinedTerm', 'Person', 'TechArticle']) {
        expect(types, `${page} JSON-LD must contain ${type}`).toContain(type)
      }
    })
  }

  it('the DefinedTerm carries the canonical definition and the Person carries sameAs', () => {
    const en = html('index.html')
    expect(en).toContain('bound to a mechanism that fails when that claim stops being true')
    expect(en).toContain('"sameAs"')
    expect(en).toContain('sergioazocar.com')
  })

  it('the DefinedTerm disambiguates the term and the TechArticle carries the coinage date', () => {
    const en = html('index.html')
    // Sets the repository sense apart from the other public senses of the phrase.
    expect(en).toContain('disambiguatingDescription')
    // The coinage date (repo created on GitHub), the verifiable priority signal.
    expect(en).toContain('"dateCreated"')
    expect(en).toContain('2025-10-28')
  })

  it('the graph anchors the entity: Wikidata mentions and a filled-out author', () => {
    const en = html('index.html')
    // Anchor to existing knowledge-graph entities so an engine can resolve the term.
    expect(en).toContain('wikidata.org/entity/Q137916163') // context engineering
    // The author entity carries what he is known for and where he works.
    expect(en).toContain('knowsAbout')
    expect(en).toContain('worksFor')
  })

  it('each page emits a single JSON-LD graph, not cross-referencing blocks', () => {
    // The term nodes and @nuxtjs/seo's WebSite/WebPage/Person share one @graph, so
    // every cross-@id reference resolves inside one block.
    for (const file of ['index.html', 'es/index.html', 'glossary/index.html']) {
      expect(jsonLdBlockCount(file), `${file} should have one ld+json block`).toBe(1)
    }
  })
})

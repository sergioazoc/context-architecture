import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { read, ROOT } from './repo'

// The GEO surface is a set of claims the site makes about how it is served and
// what it allows. Bind the ones that live in files: the agent-facing artifacts
// declare a charset, the sitemap redirect points at the index, and the built
// robots.txt states the content signals (so a dashboard default that flipped
// ai-train, or a lost header, fails here).
describe('the GEO surface holds', () => {
  const headers = read('public/_headers')

  it('every agent-facing artifact declares a charset in _headers', () => {
    for (const block of [
      '/skill.md\n  Content-Type: text/markdown; charset=utf-8',
      '/raw/*\n  Content-Type: text/markdown; charset=utf-8',
      '/llms.txt\n  Content-Type: text/plain; charset=utf-8',
      '/llms-full.txt\n  Content-Type: text/plain; charset=utf-8',
    ]) {
      expect(headers, `_headers must declare ${block.split('\n')[0]}`).toContain(block)
    }
  })

  it('the sitemap redirect points at the index', () => {
    expect(read('public/_redirects')).toMatch(/\/sitemap\.xml\s+\/sitemap_index\.xml\s+301/)
  })
})

const OUT = join(ROOT, '.output/public')
describe.skipIf(!existsSync(OUT))('the built robots.txt states the content signals', () => {
  it('declares search, ai-input, and ai-train, and blocks nothing', () => {
    const txt = read('.output/public/robots.txt')
    expect(txt).toContain('Content-Signal: search=yes, ai-input=yes, ai-train=yes')
    expect(txt, 'robots.txt must not disallow everything').not.toMatch(/^Disallow: \/$/m)
  })
})

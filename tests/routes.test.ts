import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { walk, read, contentPages, ROOT } from './repo'
import { PAGES, enPath, esPath, prerenderRoutes } from '../app/site-routes'

// app/site-routes.ts is the single source for the site's routes. These tests bind
// it to the content tree and to the prerendered output, so the router, the
// prerender list, and the pages under content/ cannot drift apart (principle 05).
const OUT = join(ROOT, '.output/public')

// Every page route the site exposes, both locales, from the shared derivation.
const pageRoutes = [...PAGES.map(enPath), ...PAGES.map(esPath)]
const knownRoutes = new Set(pageRoutes)

// The static file a route prerenders to: '/' -> index.html, '/es/comparacion' ->
// es/comparacion/index.html.
const htmlFile = (route: string): string =>
  route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`

describe('site routes are derived from the content tree (principle 05)', () => {
  it('the page list matches the content files in both locales', () => {
    const expected = [...PAGES].map((p) => `${p}.md`).sort()
    expect(contentPages('en')).toEqual(expected)
    expect(contentPages('es')).toEqual(expected)
  })

  it('every page has one English route and one Spanish route, with no collisions', () => {
    expect(pageRoutes).toHaveLength(PAGES.length * 2)
    expect(new Set(pageRoutes).size).toBe(pageRoutes.length)
  })

  it('the prerender list carries every page route plus the raw skill and the 404 shell', () => {
    const routes = prerenderRoutes()
    for (const r of pageRoutes) expect(routes, `prerender missing ${r}`).toContain(r)
    expect(routes).toContain('/skill.md')
    expect(routes).toContain('/404')
  })

  it('every internal content link points at a real route', () => {
    const offenders: string[] = []
    for (const page of walk('content', (p) => p.endsWith('.md') && !p.endsWith('AGENTS.md'))) {
      for (const m of read(page).matchAll(/\]\((\/[^)\s#]*)/g)) {
        if (!knownRoutes.has(m[1])) offenders.push(`${page}: ${m[1]}`)
      }
    }
    expect(offenders, 'content links to unknown routes').toEqual([])
  })
})

describe.skipIf(!existsSync(OUT))('the prerendered output has every route', () => {
  it('each page route emitted an index.html', () => {
    const missing = pageRoutes.filter((r) => !existsSync(join(OUT, htmlFile(r))))
    expect(missing, 'routes with no prerendered HTML').toEqual([])
  })
})

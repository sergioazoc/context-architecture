import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ROOT } from './repo'

// Principle 08 (the no-JavaScript claim, app/AGENTS.md): the person view must read
// with JavaScript disabled. Because the site is SSG, the rule AND the body (the
// principles) must be present in the static HTML, not hydrated in by JS. Runs
// after `pnpm generate` (in CI the build precedes the tests); skipped without one.
const OUT = join(ROOT, '.output/public')
const built = existsSync(OUT)
const html = (p: string): string => readFileSync(join(OUT, p), 'utf8')

const HOME = {
  en: {
    file: 'index.html',
    rule: 'must be bound to a mechanism that fails when that claim stops being true',
    principle: 'Structure Screams Intent',
  },
  es: {
    file: 'es/index.html',
    rule: 'debe estar ligada a un mecanismo que falla cuando esa afirmación deja de ser verdad',
    principle: 'La estructura grita la intención',
  },
} as const

describe.skipIf(!built)('prerendered content reads without JavaScript (principle 08)', () => {
  for (const locale of ['en', 'es'] as const) {
    const { file, rule, principle } = HOME[locale]
    it(`the ${locale} home ships the rule in static HTML`, () => {
      expect(html(file)).toContain(rule)
    })
    it(`the ${locale} home ships the principle bodies, not an empty shell`, () => {
      const body = html(file)
      expect(body, `${locale} missing a principle body`).toContain(principle)
      expect(body, `${locale} missing the numbered markers`).toContain('01 ·')
    })
    // The /raw/**.md mirror (emitted by @nuxt/content's llms feature) is the view an
    // LLM fetches. It is documented in the root AGENTS.md, so bind that it exists and
    // carries the rule; if the feature is turned off, this goes red.
    it(`the ${locale} raw markdown mirror carries the rule`, () => {
      const raw = readFileSync(join(OUT, `raw/${locale}.md`), 'utf8')
      expect(raw, `raw/${locale}.md missing the rule`).toContain(rule)
    })
  }

  // The htmlAttrs.lang fallback is 'en' for the SPA-fallback 404.html, but each
  // prerendered locale must still emit its own lang, or the per-locale claim is
  // false. This binds that (the reason seo.validateAppHead is turned off).
  it('each prerendered page emits the right html lang', () => {
    expect(html('index.html'), 'English home must be lang="en"').toContain('lang="en"')
    expect(html('es/index.html'), 'Spanish home must be lang="es"').toContain('lang="es"')
    expect(html('404.html'), '404 fallback must be lang="en"').toContain('lang="en"')
  })
})

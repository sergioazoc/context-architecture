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
  }
})

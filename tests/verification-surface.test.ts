import { describe, it, expect } from 'vitest'
import { read } from './repo'

// Principle 09: the verification surface is itself a set of claims, so it is
// bound. These assertions fail if the lint rules are weakened or the CI steps
// that run the checks are removed, which is the cheapest way to make a red check
// go green.
describe('the verification surface is itself bound (principle 09)', () => {
  it('the oxlint CSS rules stay at "error", not weakened to warn/off', () => {
    const cfg = JSON.parse(read('.oxlintrc.json')) as {
      jsPlugins?: string[]
      rules?: Record<string, string>
    }
    const mustError = [
      'tailwindcss/no-unknown-classes',
      'tailwindcss/no-duplicate-classes',
      'tailwindcss/no-conflicting-classes',
      'tailwindcss/no-deprecated-classes',
      'tailwindcss/no-unnecessary-whitespace',
    ]
    for (const rule of mustError) {
      expect(cfg.rules?.[rule], `${rule} must stay "error"`).toBe('error')
    }
    expect(cfg.jsPlugins ?? []).toContain('oxlint-tailwindcss')
  })

  it('CI runs lint, format:check, typecheck, test, and the build', () => {
    const ci = read('.github/workflows/deploy.yml')
    for (const cmd of [
      'pnpm lint',
      'pnpm format:check',
      'pnpm typecheck',
      'pnpm test',
      'pnpm generate',
    ]) {
      expect(ci, `CI must run ${cmd}`).toContain(cmd)
    }
  })
})

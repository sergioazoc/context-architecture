import { describe, it, expect } from 'vitest'
import { read } from './repo'

// Principle 09: the verification surface is itself a set of claims, so it is
// bound. These assertions fail if the lint rules are weakened or the CI steps
// that run the checks are removed, which is the cheapest way to make a red check
// go green.
describe('the verification surface is itself bound (principle 09)', () => {
  it('the oxlint rules stay at "error", not weakened to warn/off', () => {
    const cfg = JSON.parse(read('.oxlintrc.json')) as {
      jsPlugins?: string[]
      rules?: Record<string, unknown>
    }
    // A rule is "at error" whether it is the string "error" or ["error", options].
    const atError = (v: unknown): boolean => v === 'error' || (Array.isArray(v) && v[0] === 'error')
    const mustError = [
      // CSS conventions (principle 07).
      'tailwindcss/no-unknown-classes',
      'tailwindcss/no-duplicate-classes',
      'tailwindcss/no-conflicting-classes',
      'tailwindcss/no-deprecated-classes',
      'tailwindcss/no-unnecessary-whitespace',
      // One accent color, no hard-coded colors outside the tokens (principle 07).
      'tailwindcss/no-hardcoded-colors',
      // Complexity and size limits on functions (principle 04).
      'max-depth',
      'max-params',
      'complexity',
      'max-lines-per-function',
    ]
    for (const rule of mustError) {
      expect(atError(cfg.rules?.[rule]), `${rule} must stay at "error"`).toBe(true)
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

  it('CI runs the checks on pull requests, not only on push', () => {
    // The checks are only an integration gate if they run before merge.
    const ci = read('.github/workflows/deploy.yml')
    expect(ci, 'CI must trigger on pull_request').toMatch(/pull_request:/)
  })
})

// The authorization principle 09 names is declared in the repo: CODEOWNERS marks
// the verification surface, and the vitest config keeps collecting every test so a
// deleted test file is not silently uncovered. A branch ruleset that requires Code
// Owner review and the CI check is the external half (see the root AGENTS.md).
describe('the authorization is declared (principle 09)', () => {
  it('CODEOWNERS covers the verification surface', () => {
    const owners = read('.github/CODEOWNERS')
    for (const path of ['/tests/', '/.oxlintrc.json', '/.github/', '/vitest.config.ts']) {
      expect(owners, `CODEOWNERS must cover ${path}`).toContain(path)
    }
  })

  it('the test runner still collects every test file', () => {
    expect(read('vitest.config.ts')).toContain("include: ['tests/**/*.test.ts']")
  })
})

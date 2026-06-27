import { describe, it, expect } from 'vitest'
import { read } from './repo'

// Principle 05: a capability that cannot be found does not exist for an agent.
// The package.json scripts are the project's capabilities; the core ones must be
// documented, and no doc may cite a command that is not a real script.
const pkg = JSON.parse(read('package.json')) as { scripts?: Record<string, string> }
const scripts = Object.keys(pkg.scripts ?? {})
const docs = read('README.md') + '\n' + read('AGENTS.md')

describe('capabilities are discoverable (principle 05)', () => {
  it('the core commands exist and are documented', () => {
    const core = ['dev', 'lint', 'typecheck', 'test', 'generate', 'deploy', 'format']
    for (const cmd of core) {
      expect(scripts, `package.json must define "${cmd}"`).toContain(cmd)
      expect(docs, `"pnpm ${cmd}" must be documented`).toContain(`pnpm ${cmd}`)
    }
  })

  it('no documented pnpm command is missing from package.json', () => {
    const referenced = [...docs.matchAll(/pnpm ([a-z][a-z0-9:-]*)/g)].map((m) => m[1])
    const unknown = [...new Set(referenced)].filter(
      (c) => c !== 'install' && c !== 'exec' && !scripts.includes(c),
    )
    expect(unknown, 'docs cite undefined pnpm scripts').toEqual([])
  })
})

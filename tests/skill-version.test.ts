import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { read } from './repo'

// House rule (skills/AGENTS.md): every change to the distributable SKILL.md ships with a
// version bump in .claude-plugin/marketplace.json. Claude Code dedupes an installed plugin
// by version, so an unchanged version is served from cache and existing installs never see
// the new content. This binds that rule: each published version is pinned to a hash of the
// SKILL.md it ships. Change SKILL.md and the last test fails until you bump the version in
// marketplace.json and register the new hash below. It is the rule the site argues for,
// applied to the skill's own release: a claim (this version is this content) tied to a check
// that fails when it stops being true.
const RELEASED: Record<string, string> = {
  '0.2.0': '403ddf0aea322dbe9095050af8d69c1612d44fd5b7c37815e6a6a4bcbe58b4ad',
}

const sha256 = (s: string): string => createHash('sha256').update(s).digest('hex')

describe('skill version is bound to skill content', () => {
  const marketplace = JSON.parse(read('.claude-plugin/marketplace.json'))
  const metaVersion: string = marketplace.metadata.version
  const pluginVersion: string = marketplace.plugins[0].version

  it('declares one version (metadata and the plugin entry agree)', () => {
    expect(pluginVersion, 'plugin entry version must equal metadata version').toBe(metaVersion)
  })

  it('registers a hash for the current version', () => {
    expect(RELEASED[pluginVersion], `register a hash for version ${pluginVersion}`).toBeTypeOf(
      'string',
    )
  })

  it('matches the SKILL.md content the current version publishes', () => {
    const actual = sha256(read('skills/context-architecture/SKILL.md'))
    expect(
      actual,
      `SKILL.md changed: bump the version in marketplace.json and register its hash here. ` +
        `Current ${pluginVersion} content hashes to ${actual}.`,
    ).toBe(RELEASED[pluginVersion])
  })
})

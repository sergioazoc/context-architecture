import { describe, it, expect } from 'vitest'
import { statSync } from 'node:fs'
import { join } from 'node:path'
import { read, ROOT } from './repo'

// The distributable skill's conformance to the Agent Skills spec (agentskills.io)
// is a claim the repo makes about its one deliverable. Bind it: the name matches
// the folder and the spec pattern, the description fits the 1024-character cap,
// metadata values are strings, only standard keys appear, and the body stays
// within the progressive-disclosure budget (the spec recommends under ~5000
// tokens; 20 KiB is that ceiling) so the skill installs and loads everywhere. A
// non-standard key or an over-long description makes it silently fail to load.
const DIR = 'skills/context-architecture'
const FOLDER = 'context-architecture'
const NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const ALLOWED_KEYS = new Set([
  'name',
  'description',
  'license',
  'compatibility',
  'metadata',
  'allowed-tools',
])
const MAX_DESC = 1024
const MAX_LINES = 500
const MAX_BYTES = 20 * 1024

const src = read(`${DIR}/SKILL.md`)
const fm = /^---\n([\s\S]*?)\n---\n/.exec(src)?.[1] ?? ''
const topKeys = [...fm.matchAll(/^([A-Za-z][\w-]*):/gm)].map((m) => m[1])
const name = (/^name:\s*(.+)$/m.exec(fm)?.[1] ?? '').trim()
const descBlock = /description: >-\n([\s\S]*?)\n(?=[A-Za-z][\w-]*:)/.exec(fm)
const description = descBlock
  ? descBlock[1]
      .split('\n')
      .map((l) => l.trim())
      .join(' ')
      .trim()
  : ''

describe('the skill conforms to the Agent Skills spec', () => {
  it('name matches the folder and the spec pattern', () => {
    expect(name).toBe(FOLDER)
    expect(NAME_RE.test(name)).toBe(true)
    expect(name.length).toBeLessThanOrEqual(64)
  })

  it('description is present and within 1024 characters', () => {
    expect(description.length).toBeGreaterThan(0)
    expect(description.length).toBeLessThanOrEqual(MAX_DESC)
  })

  it('frontmatter uses only standard top-level keys', () => {
    const unknown = topKeys.filter((k) => !ALLOWED_KEYS.has(k))
    expect(unknown, 'non-standard SKILL.md frontmatter keys').toEqual([])
  })

  it('metadata values are all strings', () => {
    const meta = /\nmetadata:\n((?:[ \t]+.*\n?)*)/.exec(fm)
    const lines = meta ? meta[1].split('\n').filter((l) => l.trim()) : []
    const nonString = lines.filter((l) => !/^[ \t]+[\w-]+:\s*\S/.test(l))
    expect(lines.length, 'metadata block should have entries').toBeGreaterThan(0)
    expect(nonString, 'metadata entries that are not key: value strings').toEqual([])
  })

  it('the body stays within the progressive-disclosure budget', () => {
    expect(statSync(join(ROOT, `${DIR}/SKILL.md`)).size).toBeLessThanOrEqual(MAX_BYTES)
    expect(src.split('\n').length).toBeLessThanOrEqual(MAX_LINES)
  })
})

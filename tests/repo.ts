import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Vitest runs from the repo root, so cwd is the repository being verified.
export const ROOT = process.cwd()

export const read = (p: string): string => readFileSync(join(ROOT, p), 'utf8')
export const exists = (p: string): boolean => existsSync(join(ROOT, p))

const SKIP = new Set(['node_modules', '.nuxt', '.output', '.git', 'dist', '.data', '.cache'])

// Recursively list repo-relative file paths (posix separators) under `dir` that pass `filter`.
export function walk(dir: string, filter: (p: string) => boolean): string[] {
  const out: string[] = []
  if (!existsSync(join(ROOT, dir))) return out
  for (const name of readdirSync(join(ROOT, dir))) {
    if (SKIP.has(name)) continue
    const rel = `${dir}/${name}`
    if (statSync(join(ROOT, rel)).isDirectory()) out.push(...walk(rel, filter))
    else if (filter(rel)) out.push(rel)
  }
  return out
}

// The .md basenames a locale exposes as pages (AGENTS.md is boundary context, not a page).
export const contentPages = (locale: 'en' | 'es'): string[] =>
  walk(`content/${locale}`, (p) => p.endsWith('.md') && !p.endsWith('AGENTS.md'))
    .map((p) => p.split('/').pop() as string)
    .sort()

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// Serves the canonical skill artifact (skills/context-architecture/SKILL.md) as raw
// markdown at /skill.md, so an agent can fetch it in one request
// (curl https://context-architecture.dev/skill.md). Prerendered to a static asset: the
// read happens at build (Node, cwd = project root), and Cloudflare then serves the file
// directly. That file is the single source; there is no committed copy to drift, which
// is the rule this site argues for.
export default defineEventHandler(async (event) => {
  const body = await readFile(
    resolve(process.cwd(), 'skills/context-architecture/SKILL.md'),
    'utf8',
  )
  // This header is set for completeness, but the prerendered asset is served by
  // Workers Assets, which infers the type from the extension and drops it. The
  // effective `text/markdown; charset=utf-8` comes from public/_headers.
  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return body
})

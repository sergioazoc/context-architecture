/**
 * Single source of truth for site-wide metadata (footer, schema.org, SEO).
 * Colocated, explicit, machine-readable: the architecture this site argues for.
 */
export interface SiteMeta {
  /** ISO date the manifesto was first published. */
  publishedISO: string
  /** ISO timestamp of the last build (stamped via runtimeConfig.public.buildDate). */
  modifiedISO: string
  /**
   * Date the term "Context Architecture" was introduced: the day the
   * `context-architecture` repo was created on GitHub and the name was defined.
   */
  introducedISO: string
  introduced: string
  /** Public source repository for this site (its own first case study). */
  repo: string
  authorUrl: string
}

export function useSiteMeta(): SiteMeta {
  // dateModified tracks the build, not a hand-edited date (updated every CI deploy).
  const { buildDate } = useRuntimeConfig().public
  return {
    publishedISO: '2026-06-17',
    modifiedISO: buildDate,
    introducedISO: '2025-10-28',
    introduced: 'October 2025',
    repo: 'https://github.com/sergioazoc/context-architecture',
    authorUrl: 'https://sergioazocar.com',
  }
}

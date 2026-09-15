// Single source of truth for the site's routes, derived from the content pages
// and their localized slugs. nuxt.config imports this for i18n.pages and the
// prerender list, and tests/routes.test.ts checks it against content/{en,es}.
// One derivation means the router and the prerendered output cannot disagree
// with the content tree (principle 05, capabilities and structure are generated,
// not hand-kept).

// The content pages, by their file basename under content/<locale>/.
export const PAGES = ['index', 'comparison', 'guide', 'glossary', 'skill'] as const

// The Spanish slug for each page whose URL differs from the English one. index
// maps to the locale root and skill keeps its English slug, so neither is listed.
// @nuxtjs/i18n prepends the /es prefix, so these are declared without it.
export const ES_SLUGS: Record<string, string> = {
  comparison: 'comparacion',
  guide: 'guia',
  glossary: 'glosario',
}

// i18n.pages config: only the pages whose Spanish slug differs from the route
// name. The slug is typed as a leading-slash path, which @nuxtjs/i18n requires.
export const i18nPages: Record<string, { es: `/${string}` }> = Object.fromEntries(
  Object.entries(ES_SLUGS).map(([name, es]) => [name, { es: `/${es}` as `/${string}` }]),
)

// The English path for a page ('' for index becomes '/').
export const enPath = (page: string): string => (page === 'index' ? '/' : `/${page}`)

// The Spanish path for a page under /es.
export const esPath = (page: string): string =>
  page === 'index' ? '/es' : `/es/${ES_SLUGS[page] ?? page}`

// Every route the site prerenders: both locales' pages, the 404 shell, and the
// raw skill artifact served by server/routes/skill.md.ts.
export function prerenderRoutes(): string[] {
  return ['/404', '/skill.md', ...PAGES.map(enPath), ...PAGES.map(esPath)]
}

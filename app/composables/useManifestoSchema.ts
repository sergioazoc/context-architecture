/**
 * Page-specific structured data for the manifesto: a JSON-LD graph with
 * DefinedTermSet, DefinedTerm, TechArticle, and the Person who introduced the
 * term. The @nuxtjs/seo module already injects the sitewide WebSite + WebPage +
 * Person identity; here we cross-link its WebPage to the term so the page's
 * declared subject is the term, not the author.
 */

// The canonical definition: kept verbatim and identical across the citable
// surfaces (the hero `definition` frontmatter, this DefinedTerm node, the glossary
// term, and the llms.txt canonical section) so a generative engine extracts one
// definition. Exported so useGlossarySchema reuses the same string (single source).
export const CANONICAL_DEFINITION: Record<string, string> = {
  en: 'Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when that claim stops being true.',
  es: 'Context Architecture es una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea legible para el agente que escribe el código y para las personas que responden por él, y esté atado a un mecanismo que falla cuando esa afirmación deja de ser cierta.',
}

export function useManifestoSchema(
  page: Ref<{ title?: string; description?: string } | null | undefined>,
) {
  const { locale } = useI18n()
  const site = useSiteConfig()
  const route = useRoute()
  const meta = useSiteMeta()

  const base = (site.url || 'https://context-architecture.dev').replace(/\/$/, '')

  // Point the canonical WebPage's subject at the term itself, the single strongest
  // GEO signal for a definitional site. Merges by @id into the WebPage that
  // @nuxtjs/seo already emits, cross-linking it to our DefinedTerm node.
  useSchemaOrg([
    defineWebPage({
      about: { '@id': `${base}/#context-architecture` },
      mainEntity: { '@id': `${base}/#context-architecture` },
    }),
  ])

  useHead(() => {
    const lang = locale.value
    const pageUrl = `${base}${route.path}`

    // Reuse the sitewide Person identity emitted by @nuxtjs/seo (#identity)
    // instead of defining a second Person node (one author, one @id).
    const author = `${base}/#identity`

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'DefinedTermSet',
        '@id': `${base}/#termset`,
        name: 'Context Architecture',
        url: `${base}/`,
        hasDefinedTerm: { '@id': `${base}/#context-architecture` },
      },
      {
        '@type': 'DefinedTerm',
        '@id': `${base}/#context-architecture`,
        name: 'Context Architecture',
        description: CANONICAL_DEFINITION[lang] ?? CANONICAL_DEFINITION.en,
        inDefinedTermSet: { '@id': `${base}/#termset` },
      },
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        headline: page.value?.title ?? 'Context Architecture',
        description: page.value?.description ?? '',
        inLanguage: lang,
        author: { '@id': author },
        creator: { '@id': author },
        copyrightHolder: { '@id': author },
        copyrightYear: 2026,
        about: { '@id': `${base}/#context-architecture` },
        datePublished: meta.publishedISO,
        dateModified: meta.modifiedISO,
        license: 'https://creativecommons.org/licenses/by/4.0/',
      },
    ]

    return {
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }),
        },
      ],
    }
  })
}

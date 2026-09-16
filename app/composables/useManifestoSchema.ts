/**
 * Page-specific structured data for the manifesto: a JSON-LD graph with
 * DefinedTermSet, DefinedTerm, TechArticle, and the Person who introduced the
 * term. The @nuxtjs/seo module already injects the sitewide WebSite + WebPage +
 * Person identity; this composable cross-links its WebPage to the term so the page's
 * declared subject is the term, not the author.
 */

// The canonical definition lives in app/site-definition.ts, the single source
// imported by nuxt.config.ts and the schema composables alike. Re-exported here so
// useGlossarySchema keeps importing it from this module.
import { CANONICAL_DEFINITION } from '../site-definition'

export { CANONICAL_DEFINITION }

// Sets the repository sense of "Context Architecture" apart from the other public
// senses of the phrase (a data-platform metadata layer, an agent's runtime context
// window, information architecture for AI products), so knowledge graphs do not
// merge them.
const DISAMBIGUATION: Record<string, string> = {
  en: 'Not the runtime layout of an agent context window (system prompt, memory, retrieved data), which this specification calls context engineering, nor a data-platform metadata layer, nor information architecture for AI products. Context Architecture designs the repository.',
  es: 'No es la disposición en runtime de la ventana de contexto de un agente (system prompt, memoria, datos recuperados), que esta especificación llama context engineering, ni una capa de metadatos de una plataforma de datos, ni la arquitectura de información para productos de IA. Context Architecture diseña el repositorio.',
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
  // @nuxtjs/seo already emits, cross-linking it to the DefinedTerm node defined here.
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
        // Distinguishes the term from the other public senses of the phrase, so a
        // generative engine attributes the repository sense to this entity.
        disambiguatingDescription: DISAMBIGUATION[lang] ?? DISAMBIGUATION.en,
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
        // Anchor the article to existing knowledge-graph entities, so an engine can
        // place the term next to the concepts it extends (Wikidata: software
        // architecture, AI agent, context engineering).
        mentions: [
          { '@id': 'https://www.wikidata.org/entity/Q846636' },
          { '@id': 'https://www.wikidata.org/entity/Q132451509' },
          { '@id': 'https://www.wikidata.org/entity/Q137916163' },
        ],
        image: `${base}/icon.png`,
        mainEntityOfPage: { '@id': `${pageUrl}#webpage` },
        isPartOf: { '@id': `${base}/#website` },
        // The term was coined (the repo created on GitHub) in October 2025, before
        // this specification was first published in June 2026. dateCreated carries
        // the coinage date, the verifiable priority signal.
        dateCreated: meta.introducedISO,
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

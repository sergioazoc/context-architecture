/**
 * Page-specific structured data for the manifesto (brief §10): a JSON-LD graph
 * with DefinedTermSet, DefinedTerm, TechArticle, an optional FAQPage and the
 * Person who introduced the term. The @nuxtjs/seo module already injects the
 * sitewide WebSite + WebPage + Person identity; here we cross-link its WebPage
 * to the term so the page's declared subject is the term, not the author.
 *
 * `faq` defaults to true; pass `{ faq: false }` on pages whose visible body does
 * not render the FAQ (e.g. /comparison), so the FAQPage markup never asserts
 * questions that are not on the page (Google structured-data policy).
 */
interface Faq {
  q: string
  a: string
}

const FAQ: Record<string, Faq[]> = {
  en: [
    {
      q: 'What is Context Architecture?',
      a: 'Context Architecture is a software architecture for the age of AI agents: the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. It treats the repository (its file tree, boundaries, conventions, and embedded context) as a designed artifact.',
    },
    {
      q: 'Who created Context Architecture?',
      a: "Sergio Azócar introduced the term in October 2025, while restructuring Skyward's monorepo for people and AI-agent legibility.",
    },
    {
      q: 'How is Context Architecture different from context engineering?',
      a: "Context engineering is a runtime concern: what information enters the model's context window. Context Architecture is a design-time concern: how the codebase itself is structured.",
    },
    {
      q: 'How is it different from harness engineering?',
      a: 'Harness engineering designs the environment the agent operates in: the execution loop, the tools, and the guardrails. Context Architecture designs the codebase the agent operates on. Better Context Architecture takes work off the harness.',
    },
    {
      q: 'Is this just good documentation?',
      a: 'No. Documentation is unverified and rots silently. Context Architecture binds every context claim to a mechanism that fails when the claim stops being true. Context with enforcement differs in kind, not degree, from documentation.',
    },
    {
      q: 'Is it really an architecture?',
      a: 'Yes. It makes structural decisions that are expensive to reverse (where context lives, how boundaries are named, what gets codified), optimizes a concrete quality attribute (legibility for people and agents), and is verifiable with fitness functions. That is operating at the architectural level.',
    },
    {
      q: 'Do I need special tools to apply it?',
      a: 'No. Context Architecture is a discipline of structure, not a product. AGENTS.md, specs, named boundaries, and codified conventions are practices you apply with the tools you already use.',
    },
  ],
  es: [
    {
      q: '¿Qué es Context Architecture?',
      a: 'Context Architecture es una arquitectura de software para la era de los agentes de IA: la práctica de estructurar un codebase para que su intención y comportamiento sean igual de legibles para personas y agentes de IA. Trata el repositorio (su árbol de archivos, fronteras, convenciones y contexto embebido) como un artefacto diseñado.',
    },
    {
      q: '¿Quién creó Context Architecture?',
      a: 'Sergio Azócar introdujo el término en octubre de 2025, mientras reestructuraba el monorepo de Skyward para la legibilidad de personas y agentes de IA.',
    },
    {
      q: '¿En qué se diferencia de context engineering?',
      a: 'Context engineering es un asunto de runtime: qué información entra a la ventana de contexto del modelo. Context Architecture es un asunto de diseño: cómo está estructurado el codebase.',
    },
    {
      q: '¿En qué se diferencia de harness engineering?',
      a: 'Harness engineering diseña el entorno donde opera el agente: el bucle de ejecución, las herramientas y los guardrails. Context Architecture diseña el codebase sobre el que opera el agente. Una mejor Context Architecture le baja el trabajo al harness.',
    },
    {
      q: '¿Esto no es solo buena documentación?',
      a: 'No. La documentación es no verificada y se pudre en silencio. Context Architecture liga toda afirmación de contexto a un mecanismo que falla cuando la afirmación deja de ser verdad. El contexto con enforcement difiere de la documentación en categoría, no en grado.',
    },
    {
      q: '¿Es de verdad una arquitectura?',
      a: 'Sí. Toma decisiones estructurales caras de revertir (dónde vive el contexto, cómo se nombran las fronteras, qué se codifica), optimiza un atributo de calidad concreto (la legibilidad para personas y agentes) y es verificable con fitness functions. Eso es operar al nivel arquitectónico.',
    },
    {
      q: '¿Necesito herramientas especiales para aplicarlo?',
      a: 'No. Context Architecture es una disciplina de estructura, no un producto. AGENTS.md, specs, fronteras nombradas y convenciones codificadas son prácticas que aplicas con las herramientas que ya usas.',
    },
  ],
}

// The canonical definition: kept verbatim and identical across the three citable
// surfaces (the hero `definition` frontmatter, this DefinedTerm node, and the
// llms.txt canonical section) so a generative engine extracts one definition.
const DEFINITION: Record<string, string> = {
  en: 'Context Architecture is a software architecture for the age of AI agents: the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. It treats the repository itself (its file tree, boundaries, conventions, and embedded context) as a designed artifact, not an accident of growth.',
  es: 'Context Architecture es una arquitectura de software para la era de los agentes de IA: la práctica de estructurar un codebase para que su intención y comportamiento sean igual de legibles para personas y agentes de IA. Trata el repositorio mismo (su árbol de archivos, fronteras, convenciones y contexto embebido) como un artefacto diseñado, no como un accidente de su crecimiento.',
}

export function useManifestoSchema(
  page: Ref<{ title?: string; description?: string } | null | undefined>,
  options: { faq?: boolean } = {},
) {
  const { faq = true } = options
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
    // instead of defining a second Person node — one author, one @id.
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
        description: DEFINITION[lang] ?? DEFINITION.en,
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

    if (faq) {
      graph.push({
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: (FAQ[lang] ?? FAQ.en ?? []).map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      })
    }

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

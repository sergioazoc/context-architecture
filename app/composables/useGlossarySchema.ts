/**
 * Structured data for the glossary page: a DefinedTermSet whose members are the
 * terms the page defines (Context Architecture and the adjacent terms it is most
 * confused with), each a DefinedTerm. This is the page's GEO payload: a generative
 * engine asked to define any of these terms can extract a self-contained answer.
 *
 * The canonical "Context Architecture" term reuses the sitewide @id
 * (`#context-architecture`) and the single CANONICAL_DEFINITION string, so the term
 * is one entity across the whole site. The Person identity (#identity) and TechArticle
 * mirror useManifestoSchema; the FAQPage is intentionally absent (no FAQ on this page).
 */
import { CANONICAL_DEFINITION } from './useManifestoSchema'

interface Term {
  id: string
  name: string
  description: string
}

const TERMS: Record<string, Term[]> = {
  en: [
    {
      id: 'context-architecture',
      name: 'Context Architecture',
      description: CANONICAL_DEFINITION.en!,
    },
    {
      id: 'context-engineering',
      name: 'Context engineering',
      description:
        "Context engineering is the runtime discipline of deciding what information enters the model's context window at each moment: which files, instructions, and tool results are loaded for a given step. It designs the contents of the window; Context Architecture designs the codebase the window looks at.",
    },
    {
      id: 'harness-engineering',
      name: 'Harness engineering',
      description:
        "Harness engineering is the operational discipline of designing the environment an agent runs in: the execution loop, the tools it can call, and the guardrails that keep it safe and let it self-correct. It designs the agent's operating environment; Context Architecture designs the codebase that environment operates on.",
    },
    {
      id: 'agents-md',
      name: 'AGENTS.md',
      description:
        'AGENTS.md is a file of embedded context placed at a meaningful boundary in a repository, holding only what cannot be learned by reading the code: the source of truth, the invariants, the accepted tech debt, and the rationale a spec left behind. CLAUDE.md is the tool-specific equivalent some agents read.',
    },
    {
      id: 'spec-driven-development',
      name: 'Spec-driven development',
      description:
        'Spec-driven development is writing intent as a specification before the code exists: the spec defines the what, not the how, with acceptance criteria the implementation is checked against. In Context Architecture the spec is design-time scaffolding, removed once its criteria become tests, its contracts become types, and its conventions become lint.',
    },
    {
      id: 'screaming-architecture',
      name: 'Screaming Architecture',
      description:
        'Screaming Architecture, named by Robert C. Martin in 2011, is the principle that a software system’s structure should announce what it does, not which framework built it. Context Architecture is its heir, extending the ideal to a reader with no memory: the AI agent.',
    },
    {
      id: 'context-rot',
      name: 'Context-rot',
      description:
        'Context-rot is the silent decay of documentation as the code it describes changes: a doc that cites a deleted file, names a renamed module, or contradicts current behavior while still reading as authoritative. The rule at the heart of Context Architecture exists to prevent it.',
    },
  ],
  es: [
    {
      id: 'context-architecture',
      name: 'Context Architecture',
      description: CANONICAL_DEFINITION.es!,
    },
    {
      id: 'context-engineering',
      name: 'Context engineering',
      description:
        'Context engineering es la disciplina de runtime que decide qué información entra a la ventana de contexto del modelo en cada momento: qué archivos, instrucciones y resultados de herramientas se cargan para un paso dado. Diseña los contenidos de la ventana; Context Architecture diseña el codebase que la ventana mira.',
    },
    {
      id: 'harness-engineering',
      name: 'Harness engineering',
      description:
        'Harness engineering es la disciplina operacional que diseña el entorno donde corre un agente: el bucle de ejecución, las herramientas que puede invocar y los guardrails que lo mantienen seguro y le permiten autocorregirse. Diseña el entorno de operación del agente; Context Architecture diseña el codebase sobre el que ese entorno opera.',
    },
    {
      id: 'agents-md',
      name: 'AGENTS.md',
      description:
        'AGENTS.md es un archivo de contexto embebido ubicado en una frontera con significado dentro de un repositorio, que contiene solo lo que no se puede aprender leyendo el código: la fuente de verdad, los invariantes, la deuda técnica aceptada y la razón que un spec dejó atrás. CLAUDE.md es el equivalente específico de herramienta que leen algunos agentes.',
    },
    {
      id: 'spec-driven-development',
      name: 'Spec-driven development',
      description:
        'Spec-driven development es escribir la intención como una especificación antes de que el código exista: el spec define el qué, no el cómo, con criterios de aceptación contra los que se verifica la implementación. En Context Architecture el spec es andamiaje de tiempo de diseño, eliminado una vez que sus criterios se vuelven tests, sus contratos se vuelven tipos y sus convenciones se vuelven lint.',
    },
    {
      id: 'screaming-architecture',
      name: 'Screaming Architecture',
      description:
        'Screaming Architecture, nombrado por Robert C. Martin en 2011, es el principio de que la estructura de un sistema de software debería anunciar qué hace, no qué framework lo construyó. Context Architecture es su heredera, extendiendo el ideal a un lector sin memoria: el agente de IA.',
    },
    {
      id: 'context-rot',
      name: 'Context-rot',
      description:
        'Context-rot es el deterioro silencioso de la documentación a medida que el código que describe cambia: un doc que cita un archivo borrado, nombra un módulo renombrado o contradice el comportamiento actual mientras todavía se lee como autoritativo. La regla en el corazón de Context Architecture existe para prevenirlo.',
    },
  ],
}

export function useGlossarySchema(
  page: Ref<{ title?: string; description?: string } | null | undefined>,
) {
  const { locale } = useI18n()
  const site = useSiteConfig()
  const route = useRoute()
  const meta = useSiteMeta()

  const base = (site.url || 'https://context-architecture.dev').replace(/\/$/, '')

  useSchemaOrg([
    defineWebPage({
      about: { '@id': `${base}/#context-architecture` },
      mainEntity: { '@id': `${base}/#glossary` },
    }),
  ])

  useHead(() => {
    const lang = locale.value
    const pageUrl = `${base}${route.path}`
    const author = `${base}/#identity`
    const terms = TERMS[lang] ?? TERMS.en ?? []

    const graph: Record<string, unknown>[] = [
      {
        '@type': 'DefinedTermSet',
        '@id': `${base}/#glossary`,
        name: lang === 'es' ? 'Glosario de Context Architecture' : 'Context Architecture glossary',
        url: pageUrl,
        hasDefinedTerm: terms.map((t) => ({ '@id': `${base}/#${t.id}` })),
      },
      ...terms.map((t) => ({
        '@type': 'DefinedTerm',
        '@id': `${base}/#${t.id}`,
        name: t.name,
        description: t.description,
        inDefinedTermSet: { '@id': `${base}/#glossary` },
      })),
      {
        '@type': 'TechArticle',
        '@id': `${pageUrl}#article`,
        headline: page.value?.title ?? 'Glossary',
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

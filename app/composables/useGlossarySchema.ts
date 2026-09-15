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
        'Harness engineering is the discipline of designing everything wrapped around one agent: the loop, the tools, the guides, and the sensors. As OpenAI and Thoughtworks use the term (2026), the harness reaches into the repository too, the AGENTS.md read as a map and the linters that enforce structure. Context Architecture is the rule those guides and sensors satisfy or miss, independent of the agent.',
    },
    {
      id: 'agents-md',
      name: 'AGENTS.md',
      description:
        'AGENTS.md is a file of embedded context placed at a meaningful boundary in a repository, holding only what cannot be learned by reading the code: the source of truth, the invariants, the accepted tech debt, and the rationale a spec left behind. It is an open format stewarded by the Agentic AI Foundation, and agents read the nearest one in the tree. Claude Code reads its own CLAUDE.md, bridged by an @AGENTS.md import or a symlink.',
    },
    {
      id: 'spec-driven-development',
      name: 'Spec-driven development',
      description:
        'Spec-driven development is writing intent as a specification before the code exists: the spec defines the what, not the how, with acceptance criteria the implementation is checked against. Böckeler (2025) names three levels, spec-first, spec-anchored, spec-as-source. In Context Architecture the spec is design-time scaffolding, removed once its criteria become tests, its contracts become types, and its conventions become lint; it is kept only when it stays generative, and then it too is bound by a mechanism that fails when it and the code diverge.',
    },
    {
      id: 'context-rot',
      name: 'Context rot',
      description:
        'Context rot has two senses. Chroma (July 2025) and Anthropic (September 2025) use it for a model’s recall degrading as its context window grows; this specification, like Treude and Baltes (June 2026), uses it for repository context that drifts from the code it describes, a doc that cites a deleted file or contradicts current behavior while still reading as authoritative. The rule at the heart of Context Architecture exists to prevent the second kind.',
    },
    {
      id: 'mechanism',
      name: 'Mechanism',
      description:
        'What a claim is bound to, that fails when the claim stops being true: a compiler error, a lint rule, an automated test, or a review step. It is an architectural fitness function (Ford, Parsons, and Kua, 2017) applied to a claim a repository makes about itself. Context Architecture also binds prose claims and the set of mechanisms itself (principle 09).',
    },
    {
      id: 'hook',
      name: 'Hook',
      description:
        'A script an agent’s tool runs at a fixed point in its loop, and that can block the action, configured in a file the repository commits (.claude/settings.json, .cursor/hooks.json, .codex/hooks.json). In Context Architecture a hook is where a mechanism can fire early, inside the agent’s loop rather than at CI; it is not the authorization of principle 09, because the tool can skip it.',
    },
    {
      id: 'skill',
      name: 'Skill (Agent Skills)',
      description:
        'A packaged procedure an agent loads on demand, in the Agent Skills format (a SKILL.md file with frontmatter). It holds the repeatable how, kept out of context until needed, next to the what an AGENTS.md carries. In Context Architecture a skill is principle 05 applied to a procedure, and a skill that cites a path is a claim bound like any other.',
    },
    {
      id: 'progressive-disclosure',
      name: 'Progressive disclosure',
      description:
        'Loading information in stages so context is spent only when needed: a table of contents, then the chapter, then the appendix (Anthropic, October 2025, and the Agent Skills standard). Context Architecture is such a design: the root AGENTS.md is the table of contents, each boundary’s AGENTS.md the chapter, the code the appendix, and the first principle makes the file tree the first level.',
    },
    {
      id: 'agent-memory',
      name: 'Agent memory',
      description:
        'Notes an agent’s tool keeps for itself between sessions (Claude Code auto memory, Codex memories, Copilot Memory). They are local to a machine or account, unverified, and unshared with the repository, so they go stale like any prose. Context Architecture designs for the reader without them, and what memory learns is promoted into an AGENTS.md or a mechanism.',
    },
    {
      id: 'agentic-engineering',
      name: 'Agentic engineering',
      description:
        'The practice, named by Andrej Karpathy in 2026, of coordinating fallible agents while preserving correctness, security, and maintainability: designing specs, inspecting diffs, writing tests, and building evaluation loops. Agentic engineering is the work; Context Architecture is a property of the repository that work operates on.',
    },
    {
      id: 'agent-readiness',
      name: 'Agent readiness',
      description:
        'How prepared a repository is for agents, measured by scorecards and instruction linters (Factory’s Agent Readiness, agents-lint). They measure whether mechanisms are present; Context Architecture asks whether each one fails when its claim stops being true, and whether the checklist itself is bound. A scorecard can read green with tests that never fail.',
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
        'Harness engineering es la disciplina de diseñar todo lo que envuelve a un agente: el bucle, las herramientas, las guías y los sensores. Tal como usan el término OpenAI y Thoughtworks (2026), el harness también alcanza el repositorio, el AGENTS.md que se lee como mapa y los linters que aplican la estructura. Context Architecture es la regla que esas guías y sensores cumplen o no, independiente del agente.',
    },
    {
      id: 'agents-md',
      name: 'AGENTS.md',
      description:
        'AGENTS.md es un archivo de contexto embebido ubicado en una frontera con significado dentro de un repositorio, que contiene solo lo que no se puede aprender leyendo el código: la fuente de verdad, los invariantes, la deuda técnica aceptada y la razón que un spec dejó atrás. Es un formato abierto custodiado por la Agentic AI Foundation, y los agentes leen el más cercano en el árbol. Claude Code lee su propio CLAUDE.md, con un import @AGENTS.md o un symlink como puente.',
    },
    {
      id: 'spec-driven-development',
      name: 'Spec-driven development',
      description:
        'Spec-driven development es escribir la intención como una especificación antes de que el código exista: el spec define el qué, no el cómo, con criterios de aceptación contra los que se verifica la implementación. Böckeler (2025) nombra tres niveles, spec-first, spec-anchored, spec-as-source. En Context Architecture el spec es andamiaje de tiempo de diseño, eliminado una vez que sus criterios se vuelven tests, sus contratos se vuelven tipos y sus convenciones se vuelven lint; se conserva solo cuando sigue siendo generativo, y entonces también queda atado por un mecanismo que falla cuando él y el código divergen.',
    },
    {
      id: 'context-rot',
      name: 'Context rot',
      description:
        'Context rot tiene dos sentidos. Chroma (julio de 2025) y Anthropic (septiembre de 2025) lo usan para la degradación del recuerdo del modelo a medida que crece su ventana de contexto; esta especificación, como Treude y Baltes (junio de 2026), lo usa para el contexto del repositorio que se aleja del código que describe, un doc que cita un archivo borrado o contradice el comportamiento actual mientras todavía se lee como autoritativo. La regla en el corazón de Context Architecture existe para prevenir el segundo sentido.',
    },
    {
      id: 'mechanism',
      name: 'Mechanism',
      description:
        'Aquello a lo que se ata una afirmación, que falla cuando la afirmación deja de ser cierta: un error de compilación, una regla de linter, una prueba automatizada o un paso de revisión. Es una architectural fitness function (Ford, Parsons y Kua, 2017) aplicada a una afirmación que el repositorio hace sobre sí mismo. Context Architecture también ata las afirmaciones en prosa y el propio conjunto de mecanismos (principio 09).',
    },
    {
      id: 'hook',
      name: 'Hook',
      description:
        'Un script que la herramienta del agente corre en un punto fijo de su bucle, y que puede bloquear la acción, configurado en un archivo que el repositorio versiona (.claude/settings.json, .cursor/hooks.json, .codex/hooks.json). En Context Architecture un hook es donde un mecanismo puede disparar antes, dentro del bucle del agente en vez de en CI; no es la autorización del principio 09, porque la herramienta puede saltarlo.',
    },
    {
      id: 'skill',
      name: 'Skill (Agent Skills)',
      description:
        'Un procedimiento empaquetado que el agente carga bajo demanda, en el formato Agent Skills (un archivo SKILL.md con frontmatter). Contiene el cómo repetible, fuera del contexto hasta que se necesita, junto al qué que un AGENTS.md lleva. En Context Architecture un skill es el principio 05 aplicado a un procedimiento, y un skill que cita una ruta es una afirmación atada como cualquier otra.',
    },
    {
      id: 'progressive-disclosure',
      name: 'Progressive disclosure',
      description:
        'Cargar la información por etapas para gastar contexto solo cuando hace falta: una tabla de contenidos, luego el capítulo, luego el apéndice (Anthropic, octubre de 2025, y el estándar Agent Skills). Context Architecture es un diseño así: el AGENTS.md raíz es la tabla de contenidos, el AGENTS.md de cada frontera el capítulo, el código el apéndice, y el primer principio hace del árbol de archivos el primer nivel.',
    },
    {
      id: 'agent-memory',
      name: 'Agent memory',
      description:
        'Notas que la herramienta del agente guarda para sí entre sesiones (Claude Code auto memory, Codex memories, Copilot Memory). Son locales a una máquina o cuenta, no verificadas y no compartidas con el repositorio, así que se desactualizan como cualquier prosa. Context Architecture diseña para el lector que no las tiene, y lo que la memoria aprende se promueve a un AGENTS.md o a un mecanismo.',
    },
    {
      id: 'agentic-engineering',
      name: 'Agentic engineering',
      description:
        'La práctica, nombrada por Andrej Karpathy en 2026, de coordinar agentes falibles preservando corrección, seguridad y mantenibilidad: diseñar specs, inspeccionar diffs, escribir tests y construir bucles de evaluación. Agentic engineering es el trabajo; Context Architecture es una propiedad del repositorio sobre el que ese trabajo opera.',
    },
    {
      id: 'agent-readiness',
      name: 'Agent readiness',
      description:
        'Cuán preparado está un repositorio para agentes, medido por scorecards y linters de instrucciones (el Agent Readiness de Factory, agents-lint). Miden si los mecanismos están presentes; Context Architecture pregunta si cada uno falla cuando su afirmación deja de ser cierta, y si el propio checklist está atado. Un scorecard puede salir en verde con tests que nunca fallan.',
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

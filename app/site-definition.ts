// The canonical, citable definition of Context Architecture, kept verbatim and
// identical across every surface a generative engine reads: the hero and glossary
// frontmatter, the schema.org DefinedTerm, the llms.txt canonical section, the
// site and llms descriptions, and the README. One source so an engine extracts
// one definition (tests/canonical-definition.test.ts binds it). This is a pure
// module with no Nuxt dependencies, so nuxt.config.ts and the schema composables
// import it alike.
export const CANONICAL_DEFINITION: Record<string, string> = {
  en: 'Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when that claim stops being true.',
  es: 'Context Architecture es una arquitectura de software para la era de los agentes de IA: estructura un repositorio para que todo lo que afirma sobre sí mismo, su estructura, su comportamiento y quién puede cambiarlo, sea legible para el agente que escribe el código y para las personas que responden por él, y esté atado a un mecanismo que falla cuando esa afirmación deja de ser cierta.',
}

// The attribution suffix appended where the definition doubles as a page or feed
// description (meta description, site.description, llms.description).
export const ATTRIBUTION_SUFFIX: Record<string, string> = {
  en: ' A specification by Sergio Azócar.',
  es: ' Una especificación de Sergio Azócar.',
}

// site.description and llms.description add the dated authorship to the canonical
// definition. English is canonical; the /es WebSite description is localized in
// the schema layer.
export const SITE_DESCRIPTION =
  CANONICAL_DEFINITION.en +
  ' A specification by Sergio Azócar, who introduced the term in October 2025.'

// The Spanish mirror's WebSite description, so the /es schema is not in English.
export const SITE_DESCRIPTION_ES =
  CANONICAL_DEFINITION.es +
  ' Una especificación de Sergio Azócar, quien introdujo el término en octubre de 2025.'

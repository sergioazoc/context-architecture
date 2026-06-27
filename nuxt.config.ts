// https://nuxt.com/docs/api/configuration/nuxt-config

// Stamped once per build (fresh on every CI deploy); feeds dateModified
// (schema.org + OpenGraph) and the sitemap lastmod.
const BUILD_DATE = new Date().toISOString()

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },

  // Nota: @nuxt/icon, @nuxt/fonts y @nuxtjs/color-mode los registra
  // automáticamente @nuxt/ui, por eso no se listan aquí (se configuran
  // más abajo con sus respectivas claves `icon`, `fonts`, `colorMode`).
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/scripts',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'nuxt-llms',
  ],

  css: ['~/assets/css/main.css'],

  // Favicon en la identidad del sitio (SVG escalable + .ico legacy + apple-touch).
  // SVG primero para que los navegadores modernos lo prefieran.
  app: {
    head: {
      // Default lang/dir for the SPA-fallback document (404.html); real prerendered
      // pages override it reactively per locale. Browser UI tint follows the
      // "ink on paper" background per color scheme.
      htmlAttrs: { lang: 'en', dir: 'ltr' },
      meta: [
        { name: 'theme-color', content: '#f8f8f6', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#16181a', media: '(prefers-color-scheme: dark)' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  // Configuración global del sitio. Alimenta a @nuxtjs/seo (sitemap, robots,
  // og-image, schema-org), nuxt-llms, etc.
  site: {
    url: 'https://context-architecture.dev',
    name: 'Context Architecture',
    description:
      'Context Architecture is a software architecture for the age of AI agents: it structures a repository so every claim it makes about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when the claim stops being true. A specification by Sergio Azócar, who introduced the term in October 2025.',
    // English is canonical (matches i18n.defaultLocale); the /es mirror is the alternate.
    defaultLocale: 'en',
  },

  // Build-time values exposed to the app. `buildDate` is stamped on every build
  // (including GitHub CI deploys) and feeds dateModified in schema.org + OG.
  runtimeConfig: {
    public: {
      buildDate: BUILD_DATE,
      // Google Analytics 4 Measurement ID. Empty by default; set via the
      // NUXT_PUBLIC_GA_ID env var in the build environment (Cloudflare). GA only
      // loads when this is present (see app/plugins/analytics.client.ts).
      gaId: '',
    },
  },

  // --- Nuxt UI v4 ---------------------------------------------------------
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
    },
  },

  // --- @nuxt/icon ---------------------------------------------------------
  icon: {
    // Sirve los iconos como bundle local (mejor para SSG, sin llamadas a la
    // API de Iconify en runtime). Usa los sets instalados como devDeps.
    serverBundle: 'local',
  },

  // --- @nuxt/fonts --------------------------------------------------------
  // Self-hosted en build, font-display: swap por defecto. Subsets latin +
  // latin-ext para el español. IBM Plex Serif (lectura) + Mono (estructura).
  fonts: {
    provider: 'google',
    families: [
      { name: 'IBM Plex Serif', weights: [400, 500, 600], subsets: ['latin', 'latin-ext'] },
      { name: 'IBM Plex Mono', weights: [400, 500, 600], subsets: ['latin', 'latin-ext'] },
    ],
  },

  // --- @nuxtjs/color-mode (vía Nuxt UI) -----------------------------------
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },

  // --- @nuxt/content v3 ---------------------------------------------------
  content: {
    build: {
      markdown: {
        // Resalta el código con Shiki en ambos modos de color.
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  // --- @nuxt/image --------------------------------------------------------
  image: {
    // En un sitio 100% estático no hay servidor IPX en runtime; las imágenes
    // del directorio public se sirven tal cual. Cambia el provider si usas
    // un CDN de imágenes (p.ej. Cloudflare Images).
    provider: 'none',
  },

  // --- @nuxtjs/i18n v10 ---------------------------------------------------
  // Inglés canónico sin prefijo; español espejo bajo /es/.
  i18n: {
    defaultLocale: 'en',
    // Required for @nuxtjs/i18n to emit absolute hreflang alternate links.
    baseUrl: 'https://context-architecture.dev',
    strategy: 'prefix_except_default',
    // En SSG la redirección automática por idioma no es fiable, se desactiva.
    detectBrowserLanguage: false,
    // Localized route slugs: the Spanish mirror reads in Spanish (e.g. /es/comparacion),
    // not the English slug under a /es prefix. Paths are declared here without the locale
    // prefix; the module prepends it per `strategy`. The content path (the .md file at
    // content/es/comparison.md) stays decoupled from the route slug, so only the URL changes.
    customRoutes: 'config',
    pages: {
      comparison: {
        es: '/comparacion',
      },
      guide: {
        es: '/guia',
      },
      glossary: {
        es: '/glosario',
      },
    },
    // No global message files: every UI string lives in its component's
    // <i18n> block (principle 02, Context Lives With Code).
    locales: [
      { code: 'en', language: 'en', name: 'English' },
      { code: 'es', language: 'es', name: 'Español' },
    ],
  },

  // --- nuxt-og-image (vía @nuxtjs/seo) ------------------------------------
  ogImage: {
    // Las familias de @nuxt/fonts (IBM Plex Serif + Mono) se incluyen solas en
    // el renderer de OG, así que la imagen las usa directo sin config extra.
    // El renderer NO se configura aquí: nuxt-og-image v6 lo deriva del sufijo
    // del archivo del componente. `app/components/OgImage/NuxtSeo.takumi.vue`
    // selecciona Takumi (Rust → PNG directo, sin paso por SVG; @takumi-rs/core
    // en build/prerender, @takumi-rs/wasm en edge). `renderer` está excluido de
    // `defaults` en los tipos del módulo, por eso aquí solo van las dimensiones.
    defaults: {
      // Dimensión recomendada para OG/Twitter (1.91:1).
      width: 1200,
      height: 630,
    },
  },

  // --- @nuxtjs/sitemap (vía @nuxtjs/seo) ----------------------------------
  // lastmod por defecto = fecha de build (se regenera en cada deploy).
  sitemap: {
    defaults: {
      lastmod: BUILD_DATE,
    },
  },

  // --- nuxt-llms (dogfooding visible: /llms.txt) --------------------------
  llms: {
    domain: 'https://context-architecture.dev',
    title: 'Context Architecture',
    description:
      'Context Architecture is a software architecture for the age of AI agents: it structures a repository so every claim it makes about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when the claim stops being true. A specification by Sergio Azócar, who introduced the term in October 2025.',
    // Emits /llms_full.txt with the entire manifesto inlined.
    full: {
      title: 'Context Architecture: full specification',
      description:
        'The complete Context Architecture specification: the rule, the problem, the autonomy spectrum, the write-and-verify loop, the nine principles, what it does not do, and its limits.',
    },
    sections: [
      {
        title: 'Canonical definition',
        description:
          'Context Architecture is a software architecture for the age of AI agents: it structures a repository so that everything it claims about itself, its structure, its behavior, and who can change it, is legible to the agent writing the code and to the people who answer for it, and bound to a mechanism that fails when that claim stops being true. It is the design-time counterpart to context engineering (runtime) and harness engineering (the agent operating environment). Introduced by Sergio Azócar in October 2025.',
        links: [
          { title: 'The manifesto', href: 'https://context-architecture.dev/' },
          {
            title: 'Context Architecture vs. context engineering vs. harness engineering',
            href: 'https://context-architecture.dev/comparison',
          },
        ],
      },
      {
        title: 'The rule',
        description:
          'The whole architecture reduces to one rule: every claim a repository makes about itself must be bound to a mechanism that fails when that claim stops being true. A claim is anything the repository holds about itself, not just the shape of its folders: where the source of truth lives, what pattern is correct, how long an operation may take, what data must not cross a boundary. The mechanism must actually fail, not just exist; a check that cannot fail violates the rule. The rule applies to itself: the set of tests and rules that verify the repository is also bound, so it cannot be weakened to get a change through. Design for a reader who retains nothing between sessions and knows only what the repository says out loud (an agent meets this exactly). When no person reviews the code, the mechanisms are the reviewer.',
      },
      {
        title: 'The problem',
        description:
          'Writing code stopped being the bottleneck; verifying that a growing volume of changes does not break anything, at the speed an agent produces them, is. A small error rate times that volume and speed, with no mechanism that fails when a claim is violated, is silent breakage at scale. With a person reviewing, verification does not scale. Without a person, a change that looks correct gets integrated because nothing failed. The job of the architecture is not to make the agent wrong less often (the model handles that), but to make every violated claim fail at once, where it broke. The problem grows with better models, it does not go away.',
      },
      {
        title: 'The autonomy spectrum',
        description:
          'Context Architecture works with or without a person in the loop, across the whole range: inline (a person approves each edit), async (a person reviews the change before integrating), autonomous (a person sets the rules and does not look at each change), and orchestrated (nobody in the middle). What changes across the spectrum is who consumes the verification, not the verification: the same AGENTS.md and the same mechanisms serve all of them. With a person, the mechanisms absorb the routine review; without a person, they are the reviewer.',
      },
      {
        title: 'How it applies',
        description:
          'Working with an agent is a continuous flow of code changes, and the rule lives inside that flow. When a change introduces a claim (a source of truth, an invariant, a convention), it is bound to a mechanism in the same change; when a change touches existing code, it meets the mechanisms already there. Binding means connecting a claim to something that fails when it stops being true. Context Architecture names the kinds of mechanism, not the tool: the compiler (a forbidden import breaks the build), the linter (a misplaced file fails the lint), automated tests (an AGENTS.md citing a deleted file turns the tests red), and review by a person or an agent (catches the meaning). Context Architecture decides what gets verified and guarantees the mechanism exists and fails; the infrastructure runs it.',
      },
      {
        title: 'The principles',
        description:
          'Each principle is a property you can check, bound to a mechanism, not an aspiration. ' +
          'Let the repository say what it is: 01 Structure Screams Intent (the file tree says what the system does, not what framework built it); 02 Context Lives With Code (context at every boundary, next to the code, not in a wiki that goes stale); 03 Boundaries Are Explicit and Named (named for the responsibility they own; genuinely shared code goes in a small shared/, the debt is using a generic name to avoid deciding); 04 The Repo Is Legible at Every Zoom Level (from the tree to the function body); 05 Capabilities Are Discoverable (tools and commands at predictable paths, listed by a generated index that cannot leave one out). ' +
          'Bind every claim to a mechanism: 06 Intent Becomes Mechanism (the spec is written before the code, becomes the code and the checks that enforce it, then is removed; the durable artifact is the intent and its verification); 07 Conventions Are Codified, Not Implicit (lint rules and type constraints); 08 Behavior Is Verifiable, Not Asserted (latency, security, and data contracts bound to an automated test in the repository that goes red when behavior deviates); 09 The Verification Surface Is Itself Bound (an agent cannot weaken or delete a check to get a change through).',
      },
      {
        title: 'What it does not do, and how to apply it',
        description:
          'Context Architecture is not an isolation or permissions system, not the machinery that runs the controls, not regulatory compliance, and it does not impose tools (it names the kinds of mechanism, the repository picks the product). It does not make the agent smarter; it makes the truth of the repository checkable so the agent error fails at once instead of integrating silently. It applies from the first commit (a repository can be born legible) and to one that grew without design, restructured in steps. The skill is an agent-agnostic procedure (a single Markdown file, served raw at /skill.md) that audits a repository against the principles and proposes a prioritized backlog.',
        links: [
          {
            title: 'How to apply Context Architecture',
            href: 'https://context-architecture.dev/guide',
          },
          {
            title: 'The Context Architecture skill (agent-agnostic)',
            href: 'https://context-architecture.dev/skill',
          },
          { title: 'The skill, raw markdown', href: 'https://context-architecture.dev/skill.md' },
          {
            title: 'Glossary: Context Architecture and adjacent terms',
            href: 'https://context-architecture.dev/glossary',
          },
        ],
      },
    ],
  },

  // --- nuxt-schema-org (vía @nuxtjs/seo) ----------------------------------
  // Identidad del autor para atribución verificable.
  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Sergio Azócar',
      url: 'https://sergioazocar.com',
      // Cross-profile links disambiguate the author entity for generative
      // engines and knowledge graphs. Verified from sergioazocar.com.
      sameAs: [
        'https://sergioazocar.com',
        'https://github.com/sergioazoc',
        'https://x.com/sergioazoc',
        'https://www.linkedin.com/in/sergio-azocar',
        'https://dev.to/sergioazoc',
      ],
    },
  },

  // --- Nitro / prerender (SSG) --------------------------------------------
  // `nuxt generate` prerenderiza todo a `.output/public`, que luego sirve
  // Cloudflare Workers como static assets (ver wrangler.jsonc).
  nitro: {
    prerender: {
      crawlLinks: true,
      // Crawling from the footer nav reaches every page, but list them (both
      // locales) explicitly so a prerender never silently drops one. `/skill.md`
      // is the raw skill artifact served by server/routes/skill.md.ts.
      routes: [
        '/',
        '/404',
        '/skill.md',
        '/comparison',
        '/guide',
        '/glossary',
        '/skill',
        '/es',
        '/es/comparacion',
        '/es/guia',
        '/es/glosario',
        '/es/skill',
      ],
    },
    hooks: {
      // Emit the prerendered /404 page as 404.html (the document Cloudflare's
      // not_found_handling serves) instead of 404/index.html.
      'prerender:generate'(route) {
        if (route.route === '/404') route.fileName = '404.html'
      },
    },
  },
})

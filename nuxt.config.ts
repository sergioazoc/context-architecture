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
      'Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. A specification by Sergio Azócar, who introduced the term in October 2025.',
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
  // Inglés canónico sin prefijo; español espejo bajo /es/ (brief §9).
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
    },
    // No global message files: every UI string lives in its component's
    // <i18n> block (Context Lives With Code, §02).
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
      'Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. A specification by Sergio Azócar, who introduced the term in October 2025.',
    // Emits /llms_full.txt with the entire manifesto inlined.
    full: {
      title: 'Context Architecture — full specification',
      description:
        'The complete Context Architecture specification: canonical definition, the eight principles, the practices, the case studies, and the comparison with adjacent disciplines.',
    },
    sections: [
      {
        title: 'Canonical definition',
        description:
          'Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents. It treats the repository itself (its file tree, boundaries, conventions, and embedded context) as a designed artifact, not an accident of growth. It is the structural, design-time counterpart to context engineering (runtime) and harness engineering (the agent operating environment), and the heir to Screaming Architecture for the age of AI agents. Introduced by Sergio Azócar in October 2025.',
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
          'The whole architecture reduces to one invariant: every claim a repository makes about itself must be bound to a mechanism that fails when that claim stops being true. The slogan: if a piece of context can rot silently, it is not architecture, it is documentation. The rule assumes a reader who retains nothing between sessions and knows only what the repository makes explicit (AI agents satisfy this exactly), and it exists to remove five failure modes: reimplementation, invented structure, obedience to false documentation, deprecated-pattern propagation, and random ambiguity resolution.',
      },
      {
        title: 'How it works',
        description:
          'Context is written (the four pillars), verified (the mechanism), and, in its mature form, fed (the metabolism). ' +
          'The four pillars: 1 Structure Screams Intent, 2 Embedded Context at every boundary, 3 Intent Becomes Mechanism (a spec written before code, then turned into tests, types, and lint, and removed), 4 Capabilities Are Discoverable (at predictable paths, bound to a generated, drift-checked index). Context lives with the code (where it is written) and conventions are codified (the mechanism\'s first instance) run across all four. ' +
          'The mechanism is four layers that make a claim fail when it stops being true: the compiler, the linter, the tests, and review (human or AI); together they leave the five failure modes nowhere to happen. ' +
          'The metabolism: when a PR introduces a source of truth, the review loop asks to document it in the same PR, so context grows with the system. ' +
          'It all serves one quality attribute: the time to the first correct change by a reader with no prior context.',
      },
      {
        title: 'The principles',
        description:
          'The methodology is eight principles. ' +
          '01 Structure Screams Intent: a reader, person or agent, must infer what the system does from the file tree alone, never from the framework it happens to use. ' +
          '02 Context Lives With Code: embedded context belongs at every meaningful boundary, colocated with what it describes, not exiled to a wiki that drifts. ' +
          '03 Intent Becomes Mechanism: intent is written as a spec before code exists, then becomes the code and the checks that enforce it (acceptance criteria become tests, contracts become types, conventions become lint); the spec is scaffolding, removed once that is done, kept only when it is generative. ' +
          '04 Boundaries Are Explicit and Named: every module, package, and ownership line is named so its responsibility is inferable; ambiguous names are architectural debt. ' +
          '05 Conventions Are Codified, Not Implicit: encode conventions in linting and types so the toolchain can check them. ' +
          '06 Capabilities Are Discoverable: tools, skills, and commands live at predictable paths, bound to a generated, drift-checked index, so an agent finds them instead of re-implementing them; choosing which to load at runtime is context engineering\'s job. ' +
          '07 The Repo Is Legible at Every Zoom Level: from the file tree to the function body, each level of zoom communicates purpose; legibility is fractal. ' +
          '08 Optimize for the Newcomer, and the Newcomer Is Now an Agent: the clearest test of architecture is how fast a stranger becomes productive, and that stranger is increasingly a machine.',
      },
    ],
  },

  // --- nuxt-schema-org (vía @nuxtjs/seo) ----------------------------------
  // Identidad del autor para atribución verificable (brief §10).
  schemaOrg: {
    identity: {
      type: 'Person',
      name: 'Sergio Azócar',
      url: 'https://sergioazocar.com',
      // Cross-profile links disambiguate the author entity for generative
      // engines and knowledge graphs (§11). Verified from sergioazocar.com.
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
      // Prerender the /404 page so its content (not the blank SPA-fallback shell)
      // is what Cloudflare serves for unknown routes — readable with no JS.
      routes: ['/', '/404'],
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

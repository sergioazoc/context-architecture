export default defineAppConfig({
  // Nuxt UI base palette. The actual colors are overridden by the
  // --ca-* design tokens mapped onto --ui-* variables in main.css; here we
  // only pick the scale names Nuxt UI generates utilities from.
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
    },

    // --- Prose ("ink on paper") -------------------------------------------
    // The manifesto is rendered by Nuxt UI's prose components. The reading
    // typography lives here as Tailwind utilities (no hand-written CSS): serif
    // headings carry hierarchy by weight, mono for structure, one accent for
    // links. These overrides extend the Nuxt UI defaults, so only the deltas
    // from "ink on paper" are listed. Values mirror the former .ca-doc block.
    prose: {
      // Sections. Hairline rule on top, generous space above, serif weight.
      h2: {
        slots: {
          base: 'font-serif text-2xl font-semibold tracking-[-0.01em] leading-[1.15] mt-14 mb-4 pt-6 border-t border-default',
        },
      },
      // Principles / questions.
      h3: {
        slots: {
          base: 'font-serif text-xl font-semibold leading-[1.2] mt-9 mb-3',
        },
      },
      h4: {
        slots: {
          base: 'font-serif text-lg font-semibold mt-7 mb-2',
        },
      },
      // Reading column: body measure + comfortable leading.
      p: {
        base: 'my-4 max-w-(--ca-measure) leading-[1.65] text-pretty',
      },
      // Links: the one accent, underlined (not bordered).
      a: {
        base: 'text-primary font-normal underline decoration-1 underline-offset-2 border-b-0 hover:text-(--ca-accent-ink) transition-colors',
      },
      // Inline code: hairline box on the code surface, inherits text color.
      code: {
        base: 'text-[0.85em] font-normal px-[0.35em] py-[0.1em] rounded-[2px]',
        variants: {
          color: {
            neutral: 'border border-default bg-(--ca-code-bg) text-default',
          },
        },
      },
      // Code blocks: same surface, hairline, no decorative chrome.
      pre: {
        slots: {
          base: 'font-mono text-sm leading-[1.6] border border-default bg-(--ca-code-bg) rounded-[2px] px-5 py-4',
        },
      },
      // Quotes: accent rule, muted text, never italic.
      blockquote: {
        base: 'border-s-2 border-(--ca-accent) ps-5 not-italic text-muted',
      },
      // Tables: minimal, hairline bottom rules only; mono uppercase headers.
      table: {
        slots: {
          root: 'relative my-6 overflow-x-auto',
          base: 'w-full text-sm border-collapse',
        },
      },
      th: {
        base: 'py-[0.6rem] px-3 text-left font-mono text-xs font-medium uppercase tracking-[0.04em] text-muted border-t-0 border-e-0 first:border-s-0 border-b border-default',
      },
      td: {
        base: 'py-[0.6rem] px-3 text-sm align-top border-e-0 first:border-s-0 border-b border-default',
      },
      ul: {
        base: 'ps-5 my-4',
      },
      ol: {
        base: 'ps-5 my-4',
      },
      li: {
        base: 'my-[0.35rem] max-w-(--ca-measure) leading-[1.65]',
      },
      strong: {
        base: 'font-semibold text-highlighted',
      },
      // Limit/cost note: Nuxt UI's neutral callout already uses our tokens
      // (border = rule, surface = paper). Only the geometry needs the
      // "ink on paper" treatment: hairline radius, our padding, our rhythm.
      callout: {
        slots: {
          base: 'my-8 rounded-[2px] px-5 py-4',
        },
      },
    },
  },
})

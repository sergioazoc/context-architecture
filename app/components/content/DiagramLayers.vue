<script setup lang="ts">
// The layers map (§12.1): three disciplines, three layers. Context
// Architecture is the design-time foundation the others rest on.
// Hairlines + mono labels + currentColor so it inverts cleanly in dark mode.
const { locale } = useI18n()

const t = computed(() => {
  const en = {
    caption: 'Three disciplines, three layers. Context Architecture is the design-time foundation.',
    runtime: 'RUNTIME',
    ops: 'OPERATIONS',
    design: 'DESIGN-TIME',
    ce: 'Context engineering',
    ceSub: 'what the model sees now',
    he: 'Harness engineering',
    heSub: 'how the agent operates',
    ca: 'Context Architecture',
    caSub: 'how the codebase is structured',
    foundation: 'reduces the work of every layer above',
  }
  const es = {
    caption: 'Tres disciplinas, tres capas. Context Architecture es la base de diseño.',
    runtime: 'RUNTIME',
    ops: 'OPERACIÓN',
    design: 'DISEÑO',
    ce: 'Context engineering',
    ceSub: 'qué ve el modelo ahora',
    he: 'Harness engineering',
    heSub: 'cómo opera el agente',
    ca: 'Context Architecture',
    caSub: 'cómo se estructura el codebase',
    foundation: 'reduce el trabajo de cada capa superior',
  }
  return locale.value === 'es' ? es : en
})
</script>

<template>
  <figure class="my-10 text-default">
    <svg
      viewBox="0 0 640 290"
      role="img"
      :aria-label="t.caption"
      class="w-full"
      fill="none"
      font-family="'IBM Plex Mono', ui-monospace, monospace"
    >
      <!-- Runtime: context engineering -->
      <rect
        x="80"
        y="8"
        width="540"
        height="64"
        rx="2"
        stroke="currentColor"
        stroke-opacity="0.35"
      />
      <text x="20" y="44" font-size="10" fill="currentColor" fill-opacity="0.55">
        {{ t.runtime }}
      </text>
      <text x="100" y="36" font-size="15" fill="currentColor">{{ t.ce }}</text>
      <text x="100" y="56" font-size="11" fill="currentColor" fill-opacity="0.6">
        {{ t.ceSub }}
      </text>

      <!-- Operations: harness engineering -->
      <rect
        x="80"
        y="88"
        width="540"
        height="64"
        rx="2"
        stroke="currentColor"
        stroke-opacity="0.35"
      />
      <text x="20" y="124" font-size="10" fill="currentColor" fill-opacity="0.55">{{ t.ops }}</text>
      <text x="100" y="116" font-size="15" fill="currentColor">{{ t.he }}</text>
      <text x="100" y="136" font-size="11" fill="currentColor" fill-opacity="0.6">
        {{ t.heSub }}
      </text>

      <!-- Design-time: Context Architecture (the foundation) -->
      <rect
        x="80"
        y="168"
        width="540"
        height="72"
        rx="2"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
      />
      <text x="20" y="208" font-size="10" style="fill: var(--ca-accent)">{{ t.design }}</text>
      <text x="100" y="198" font-size="15" style="fill: var(--ca-accent)" font-weight="600">
        {{ t.ca }}
      </text>
      <text x="100" y="220" font-size="11" fill="currentColor" fill-opacity="0.7">
        {{ t.caSub }}
      </text>

      <!-- Upward leverage arrow -->
      <line
        x1="350"
        y1="168"
        x2="350"
        y2="156"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
      />
      <path
        d="M346 159 L350 152 L354 159"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <text x="362" y="262" font-size="11" style="fill: var(--ca-accent)">
        ↑ {{ t.foundation }}
      </text>
    </svg>
    <figcaption class="mt-3 font-mono text-xs text-muted">{{ t.caption }}</figcaption>
  </figure>
</template>

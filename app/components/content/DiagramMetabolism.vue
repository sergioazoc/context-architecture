<script setup lang="ts">
// The metabolism cycle (§8.3): a PR introduces a source of truth, the review
// loop asks to document it in that same PR, and the context grows with the
// system. Hairlines + mono labels + currentColor; the closing loop is accent,
// because feeding the context is the move that makes the architecture mature.
const { locale } = useI18n()

const t = computed(() => {
  const en = {
    caption: 'The metabolism: context is not just validated, it is fed. New truth is documented the moment it is created.',
    s1a: 'A PR introduces',
    s1b: 'a source of truth',
    s2a: 'Review asks to',
    s2b: 'document it, same PR',
    s3a: 'Context grows',
    s3b: 'with the system',
    loop: 'every change feeds it',
  }
  const es = {
    caption: 'El metabolismo: el contexto no solo se valida, se alimenta. La verdad nueva se documenta en el momento en que se crea.',
    s1a: 'Un PR introduce',
    s1b: 'una fuente de verdad',
    s2a: 'El review pide',
    s2b: 'documentarla, mismo PR',
    s3a: 'El contexto crece',
    s3b: 'con el sistema',
    loop: 'cada cambio lo alimenta',
  }
  return locale.value === 'es' ? es : en
})
</script>

<template>
  <figure class="my-10 text-default">
    <svg
      viewBox="0 0 640 200"
      role="img"
      :aria-label="t.caption"
      class="w-full"
      fill="none"
      font-family="'IBM Plex Mono', ui-monospace, monospace"
    >
      <!-- Step 1 -->
      <rect
        x="10"
        y="20"
        width="170"
        height="64"
        rx="2"
        stroke="currentColor"
        stroke-opacity="0.4"
      />
      <text x="95" y="48" text-anchor="middle" font-size="12" fill="currentColor">{{ t.s1a }}</text>
      <text
        x="95"
        y="66"
        text-anchor="middle"
        font-size="12"
        fill="currentColor"
        fill-opacity="0.65"
      >
        {{ t.s1b }}
      </text>

      <!-- Arrow 1 → 2 -->
      <line x1="184" y1="52" x2="230" y2="52" stroke="currentColor" stroke-opacity="0.5" />
      <path
        d="M224 48 L230 52 L224 56"
        stroke="currentColor"
        stroke-opacity="0.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Step 2 -->
      <rect
        x="235"
        y="20"
        width="170"
        height="64"
        rx="2"
        stroke="currentColor"
        stroke-opacity="0.4"
      />
      <text x="320" y="48" text-anchor="middle" font-size="12" fill="currentColor">
        {{ t.s2a }}
      </text>
      <text
        x="320"
        y="66"
        text-anchor="middle"
        font-size="12"
        fill="currentColor"
        fill-opacity="0.65"
      >
        {{ t.s2b }}
      </text>

      <!-- Arrow 2 → 3 -->
      <line x1="409" y1="52" x2="455" y2="52" stroke="currentColor" stroke-opacity="0.5" />
      <path
        d="M449 48 L455 52 L449 56"
        stroke="currentColor"
        stroke-opacity="0.5"
        stroke-linejoin="round"
        stroke-linecap="round"
      />

      <!-- Step 3 (accent) -->
      <rect
        x="460"
        y="20"
        width="170"
        height="64"
        rx="2"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
      />
      <text x="545" y="48" text-anchor="middle" font-size="12" style="fill: var(--ca-accent)">
        {{ t.s3a }}
      </text>
      <text x="545" y="66" text-anchor="middle" font-size="12" style="fill: var(--ca-accent)">
        {{ t.s3b }}
      </text>

      <!-- Closing loop: step 3 → back into step 1 -->
      <path
        d="M545 84 L545 150 L95 150 L95 90"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
        fill="none"
      />
      <path
        d="M91 96 L95 88 L99 96"
        style="stroke: var(--ca-accent)"
        stroke-width="1.5"
        stroke-linejoin="round"
        stroke-linecap="round"
        fill="none"
      />
      <text x="320" y="167" text-anchor="middle" font-size="11" style="fill: var(--ca-accent)">
        {{ t.loop }}
      </text>
    </svg>
    <figcaption class="mt-3 font-mono text-xs text-muted">{{ t.caption }}</figcaption>
  </figure>
</template>

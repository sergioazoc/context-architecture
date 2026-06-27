<script setup lang="ts">
// The signature block: the single invariant. It must be the first thing the eye
// finds. Accent left border, serif for the statement. The bilingual text comes
// from the slot (each locale's .md provides its own); only the label is localized.
const { locale } = useI18n()
const label = computed(() => (locale.value === 'es' ? 'La regla' : 'The rule'))
</script>

<template>
  <aside
    class="my-10 border-l-2 border-(--ca-accent) pl-5 sm:pl-6"
    role="note"
    :aria-label="label"
  >
    <p class="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-muted">{{ label }}</p>
    <div class="font-serif text-xl leading-[1.3] text-highlighted sm:text-2xl">
      <slot />
    </div>
  </aside>
</template>

<script setup lang="ts">
// The signature block (§7): the single invariant plus the slogan. It must be
// the first thing the eye finds (§16). Accent left border, serif for the
// statement, mono for the slogan. The bilingual text comes from the slot
// (each locale's .md provides its own); only the label is localized here.
const { locale } = useI18n()
const label = computed(() => (locale.value === 'es' ? 'La invariante' : 'The invariant'))
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
    <div v-if="$slots.slogan" class="mt-4 font-mono text-sm text-muted">
      <slot name="slogan" />
    </div>
  </aside>
</template>

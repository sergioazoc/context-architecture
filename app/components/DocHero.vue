<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  definition?: string
  attribution?: string
}>()

const view = defineModel<'human' | 'agent'>('view', { default: 'human' })
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
    <div class="max-w-(--ca-measure)">
      <p v-if="eyebrow" class="font-mono text-xs uppercase tracking-[0.08em] text-muted">
        {{ eyebrow }}
      </p>
      <h1
        class="mt-4 font-serif text-3xl font-semibold tracking-tight text-highlighted sm:text-4xl"
      >
        {{ title }}
      </h1>
      <p
        v-if="definition"
        class="mt-6 font-serif text-lg leading-[1.5] text-toned sm:text-xl"
      >
        {{ definition }}
      </p>
      <p v-if="attribution" class="mt-6 max-w-[58ch] font-mono text-xs leading-relaxed text-muted">
        {{ attribution }}
      </p>
    </div>

    <div class="mt-10">
      <ViewToggle v-model="view" />
    </div>
  </section>
</template>

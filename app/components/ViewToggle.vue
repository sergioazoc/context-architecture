<script setup lang="ts">
// The signature element (§7): the same document, read by two kinds of reader.
// Built on Nuxt UI primitives (UFieldGroup connects the borders); the active
// segment is the one filled (neutral solid = inverted), the other outlined.
const model = defineModel<'human' | 'agent'>({ default: 'human' })
const { t } = useI18n({ useScope: 'local' })

const options = [
  { value: 'human', icon: 'i-lucide-book-open' },
  { value: 'agent', icon: 'i-lucide-terminal' },
] as const
</script>

<template>
  <div class="inline-flex items-center gap-3">
    <span class="font-mono text-xs uppercase tracking-[0.08em] text-muted">{{ t('label') }}</span>
    <UFieldGroup>
      <UButton
        v-for="o in options"
        :key="o.value"
        :icon="o.icon"
        :label="t(o.value)"
        color="neutral"
        :variant="model === o.value ? 'solid' : 'outline'"
        :aria-pressed="model === o.value"
        class="font-mono text-xs"
        @click="model = o.value"
      />
    </UFieldGroup>
  </div>
</template>

<i18n lang="json">
{
  "en": { "label": "Read as", "human": "Person", "agent": "Agent" },
  "es": { "label": "Leer como", "human": "Persona", "agent": "Agente" }
}
</i18n>

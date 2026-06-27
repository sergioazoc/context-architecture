<script setup lang="ts">
// Agent view: the raw Markdown source an agent consumes, shared by every
// document page. Owns its own translation (principle 02, Context Lives With Code).
defineProps<{ source: string }>()
const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <div>
    <p class="mb-5 max-w-[70ch] font-mono text-xs leading-relaxed text-muted">
      {{ t('agentNote') }}
    </p>
    <pre
      class="font-mono text-sm leading-[1.7] whitespace-pre-wrap break-words [tab-size:2] text-muted"
      >{{ source }}</pre
    >
  </div>
</template>

<i18n lang="json">
{
  "en": { "agentNote": "The raw source an agent consumes. The same document, one representation away." },
  "es": { "agentNote": "El contexto crudo que consume un agente. El mismo documento, a una representación de distancia." }
}
</i18n>

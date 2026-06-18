<script setup lang="ts">
import type { ContentTocLink } from '@nuxt/ui'

defineProps<{
  toc?: ContentTocLink[]
  /** Hide the TOC (e.g. in agent view, where anchors don't resolve). */
  showToc?: boolean
}>()

const { t } = useI18n({ useScope: 'local' })
</script>

<template>
  <!-- Nuxt UI's grid: centered article, sticky TOC in the right column.
       UContentToc owns the scroll-spy and active highlight (no custom JS). -->
  <div class="mx-auto max-w-6xl px-6">
    <UPage>
      <slot />

      <template v-if="showToc !== false && toc?.length" #right>
        <UContentToc
          :title="t('title')"
          :links="toc"
          highlight
          :ui="{
            root: 'lg:top-[calc(var(--ui-header-height,4rem)+2rem)]',
            title: 'font-mono text-xs uppercase tracking-[0.08em] text-muted',
            link: 'font-mono text-xs',
          }"
        />
      </template>
    </UPage>
  </div>
</template>

<i18n lang="json">
{
  "en": { "title": "On this page" },
  "es": { "title": "En esta página" }
}
</i18n>

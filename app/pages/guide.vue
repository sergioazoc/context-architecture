<script setup lang="ts">
import enRaw from '~~/content/en/guide.md?raw'
import esRaw from '~~/content/es/guide.md?raw'

const { locale } = useI18n()

const rawByLocale: Record<string, string> = { en: enRaw, es: esRaw }

const { data: page } = await useAsyncData(
  () => `guide-${locale.value}`,
  () => queryCollection('docs').path(`/${locale.value}/guide`).first(),
  { watch: [locale] },
)

const view = ref<'human' | 'agent'>('human')
const raw = computed(() => rawByLocale[locale.value] ?? enRaw)
const toc = computed(() => page.value?.body?.toc?.links ?? [])

const meta = useSiteMeta()

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogType: 'article',
  articleAuthor: ['Sergio Azócar'],
  articlePublishedTime: meta.publishedISO,
  articleModifiedTime: meta.modifiedISO,
})

defineOgImageComponent('NuxtSeoTakumi', {
  title: locale.value === 'es' ? 'Guía de Context Architecture' : 'Context Architecture guide',
  description:
    locale.value === 'es'
      ? 'Arrancar un repo legible o reordenar uno que creció, paso a paso'
      : 'Start a repo legible or rework one that grew, step by step',
})

// A guide page; reuse the manifesto's structured data (DefinedTerm + TechArticle +
// Person identity).
useManifestoSchema(page)
</script>

<template>
  <div>
    <DocHero
      v-model:view="view"
      :eyebrow="page?.eyebrow"
      :title="page?.title ?? 'Guide'"
      :definition="page?.definition"
    />

    <DocShell :toc="toc" :show-toc="view === 'human'">
      <ContentRenderer v-if="view === 'human' && page" :value="page" />
      <RawSourceView v-else :source="raw" />
    </DocShell>
  </div>
</template>

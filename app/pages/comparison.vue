<script setup lang="ts">
import enRaw from '~~/content/en/comparison.md?raw'
import esRaw from '~~/content/es/comparison.md?raw'

const { locale } = useI18n()

const rawByLocale: Record<string, string> = { en: enRaw, es: esRaw }

const { data: page } = await useAsyncData(
  () => `comparison-${locale.value}`,
  () => queryCollection('docs').path(`/${locale.value}/comparison`).first(),
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
  title: 'Context Architecture vs. context engineering vs. harness engineering',
  description:
    locale.value === 'es'
      ? 'Tres disciplinas, tres objetos de diseño'
      : 'Three disciplines, three objects of design',
})

// The comparison page is a high-GEO surface; give it the manifesto's structured
// data (DefinedTerm + TechArticle + Person identity).
useManifestoSchema(page)
</script>

<template>
  <div>
    <DocHero
      v-model:view="view"
      :eyebrow="page?.eyebrow"
      :title="page?.title ?? 'Comparison'"
      :definition="page?.definition"
    />

    <DocShell :toc="toc" :show-toc="view === 'human'">
      <ContentRenderer v-if="view === 'human' && page" :value="page" />
      <RawSourceView v-else :source="raw" />
    </DocShell>
  </div>
</template>

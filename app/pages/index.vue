<script setup lang="ts">
import enRaw from '~~/content/en/index.md?raw'
import esRaw from '~~/content/es/index.md?raw'

const { locale } = useI18n()

const rawByLocale: Record<string, string> = { en: enRaw, es: esRaw }

const { data: page } = await useAsyncData(
  () => `manifesto-${locale.value}`,
  () => queryCollection('docs').path(`/${locale.value}`).first(),
  { watch: [locale] },
)

const view = ref<'human' | 'agent'>('human')
const raw = computed(() => rawByLocale[locale.value] ?? enRaw)
const toc = computed(() => page.value?.body?.toc?.links ?? [])

const meta = useSiteMeta()

// Descriptive, keyword-rich <title> for the home page (the h1 stays the term).
const seoTitle = computed(() =>
  locale.value === 'es'
    ? 'Context Architecture — estructurar codebases para personas y agentes de IA'
    : 'Context Architecture — structuring codebases for people and AI agents',
)

useSeoMeta({
  title: () => seoTitle.value,
  description: () => page.value?.description,
  ogType: 'article',
  articleAuthor: ['Sergio Azócar'],
  articlePublishedTime: meta.publishedISO,
  articleModifiedTime: meta.modifiedISO,
})

defineOgImageComponent('NuxtSeoTakumi', {
  title: 'Context Architecture',
  description:
    locale.value === 'es'
      ? 'Estructurar codebases para personas y agentes de IA'
      : 'Structuring codebases for people and AI agents',
})

useManifestoSchema(page)
</script>

<template>
  <div>
    <DocHero
      v-model:view="view"
      :eyebrow="page?.eyebrow"
      :title="page?.title ?? 'Context Architecture'"
      :definition="page?.definition"
      :attribution="page?.attribution"
    />

    <DocShell :toc="toc" :show-toc="view === 'human'">
      <ContentRenderer v-if="view === 'human' && page" :value="page" />
      <RawSourceView v-else :source="raw" />
    </DocShell>
  </div>
</template>

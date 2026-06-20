<script setup lang="ts">
import enRaw from '~~/content/en/glossary.md?raw'
import esRaw from '~~/content/es/glossary.md?raw'

const { locale } = useI18n()

const rawByLocale: Record<string, string> = { en: enRaw, es: esRaw }

const { data: page } = await useAsyncData(
  () => `glossary-${locale.value}`,
  () => queryCollection('docs').path(`/${locale.value}/glossary`).first(),
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
  title: locale.value === 'es' ? 'Glosario' : 'Glossary',
  description: 'Context Architecture, context engineering, harness engineering',
})

// The glossary's structured data is a DefinedTermSet of all the terms it defines.
useGlossarySchema(page)
</script>

<template>
  <div>
    <DocHero
      v-model:view="view"
      :eyebrow="page?.eyebrow"
      :title="page?.title ?? 'Glossary'"
      :definition="page?.definition"
    />

    <DocShell :toc="toc" :show-toc="view === 'human'">
      <ContentRenderer v-if="view === 'human' && page" :value="page" />
      <RawSourceView v-else :source="raw" />
    </DocShell>
  </div>
</template>

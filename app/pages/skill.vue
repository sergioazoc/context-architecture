<script setup lang="ts">
import enRaw from '~~/content/en/skill.md?raw'
import esRaw from '~~/content/es/skill.md?raw'

const { locale } = useI18n()

const rawByLocale: Record<string, string> = { en: enRaw, es: esRaw }

const { data: page } = await useAsyncData(
  () => `skill-${locale.value}`,
  () => queryCollection('docs').path(`/${locale.value}/skill`).first(),
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
  title: 'The Context Architecture skill',
  description:
    locale.value === 'es'
      ? 'Audita y estructura un codebase con tu agente'
      : 'Audit and structure a codebase with your agent',
})

useManifestoSchema(page)
</script>

<template>
  <div>
    <DocHero
      v-model:view="view"
      :eyebrow="page?.eyebrow"
      :title="page?.title ?? 'The Context Architecture skill'"
      :definition="page?.definition"
    />

    <DocShell :toc="toc" :show-toc="view === 'human'">
      <ContentRenderer v-if="view === 'human' && page" :value="page" />
      <RawSourceView v-else :source="raw" />
    </DocShell>
  </div>
</template>

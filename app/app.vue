<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale, locales: i18nLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const SITE = 'https://context-architecture.dev'

const current = computed(() =>
  i18nLocales.value.find(l => (typeof l === 'string' ? l : l.code) === locale.value),
)

// hreflang alternate links in the <head>, the strongest bilingual SEO signal.
// Built explicitly so they don't depend on module head-integration quirks.
const alternateLinks = computed(() => {
  const links = i18nLocales.value.map(l => ({
    rel: 'alternate',
    hreflang: (l.language ?? l.code) as string,
    href: SITE + switchLocalePath(l.code),
  }))
  links.push({ rel: 'alternate', hreflang: 'x-default', href: SITE + (switchLocalePath('en') || '/') })
  return links
})

useHead({
  htmlAttrs: {
    lang: computed(() => current.value?.language ?? 'en'),
    dir: computed(() => locales[locale.value]?.dir ?? 'ltr'),
  },
  link: alternateLinks,
  // Avoid the "Context Architecture | Context Architecture" duplication: only
  // append the brand when the page title doesn't already carry it.
  titleTemplate: (title) => {
    const site = 'Context Architecture'
    if (!title) return site
    return title.includes(site) ? title : `${title} · ${site}`
  },
})

// og:locale, kept generic (en / es) to match the locale codes.
useSeoMeta({
  ogLocale: () => current.value?.language ?? 'en',
})
</script>

<template>
  <UApp :locale="locales[locale]">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

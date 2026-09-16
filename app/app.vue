<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'
import { SITE_DESCRIPTION, SITE_DESCRIPTION_ES } from '~/site-definition'

const { locale, locales: i18nLocales } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// Localize the sitewide WebSite description so the /es schema is not in English.
// site.description (nuxt.config) is English; this overrides the same @id per locale.
useSchemaOrg([
  defineWebSite({
    description: locale.value === 'es' ? SITE_DESCRIPTION_ES : SITE_DESCRIPTION,
  }),
])

const SITE = 'https://context-architecture.dev'

const current = computed(() =>
  i18nLocales.value.find(l => (typeof l === 'string' ? l : l.code) === locale.value),
)

// hreflang alternate links in the <head>, the strongest bilingual SEO signal.
// Built explicitly so they don't depend on module head-integration quirks.
const alternateLinks = computed(() => {
  const links = i18nLocales.value.map(l => ({
    rel: 'alternate' as const,
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

// og:locale, kept generic (en / es) to match the locale codes. og:image:alt gives
// the generated OG image a text alternative, localized per mirror.
useSeoMeta({
  ogLocale: () => current.value?.language ?? 'en',
  ogImageAlt: () =>
    locale.value === 'es'
      ? 'Context Architecture, una especificación de Sergio Azócar'
      : 'Context Architecture, a specification by Sergio Azócar',
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

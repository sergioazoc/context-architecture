<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

// Nuxt UI's UHeader owns the sticky shell, the container width, and
// --ui-header-height. We fill the wordmark (left), the page nav (center), and
// the controls (right): locale switch + color mode. The toggle opens the same
// nav as a vertical menu on mobile (the `#body` slot).
const { t } = useI18n({ useScope: 'local' })
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()

const availableLocales = computed(() =>
  locales.value.map(l => (typeof l === 'string' ? { code: l } : l)),
)

// When switching locale on a page anchored to a section (#some-heading), the
// heading slug differs per language, so the raw hash would land nowhere on the
// translated page. The pages are kept in heading parity, so we map the anchor by
// its position in each locale's table of contents. No hash, or no match, falls
// back to the top of the translated page.
type TocLink = { id: string; children?: TocLink[] }
const flattenTocIds = (links: TocLink[] = []): string[] =>
  links.flatMap(l => [l.id, ...flattenTocIds(l.children ?? [])])

async function onLocaleSwitch(event: MouseEvent, code: typeof locale.value) {
  // Let modified clicks (open in new tab) and the current locale fall through.
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  if (code === locale.value) return

  // switchLocalePath preserves the current hash as-is; strip it so we can append
  // the translated slug instead of stacking two hashes.
  const base = (switchLocalePath(code) || '').split('#')[0]
  if (!base) return
  if (!route.hash) {
    await navigateTo(base)
    return
  }

  // The content path uses the file name (e.g. /es/guide), not the localized
  // route slug (/es/guia); derive it from the route name (e.g. "guide___es").
  const pageName = String(route.name ?? 'index').split('___')[0] || 'index'
  const pathFor = (c: string) => (pageName === 'index' ? `/${c}` : `/${c}/${pageName}`)

  try {
    const [current, destination] = await Promise.all([
      queryCollection('docs').path(pathFor(locale.value)).first(),
      queryCollection('docs').path(pathFor(code)).first(),
    ])
    const currentIds = flattenTocIds((current?.body?.toc?.links ?? []) as TocLink[])
    const destinationIds = flattenTocIds((destination?.body?.toc?.links ?? []) as TocLink[])
    const index = currentIds.indexOf(route.hash.slice(1))
    const targetId = index >= 0 ? destinationIds[index] : undefined
    await navigateTo(targetId ? `${base}#${targetId}` : base)
  } catch {
    await navigateTo(base)
  }
}

// The internal pages, surfaced in the navbar so a reader knows they exist.
const links = computed<NavigationMenuItem[]>(() => [
  { label: t('nav.guide'), to: localePath('/guide') },
  { label: t('nav.comparison'), to: localePath('/comparison') },
  { label: t('nav.glossary'), to: localePath('/glossary') },
  { label: t('nav.skill'), to: localePath('/skill') },
])
</script>

<template>
  <UHeader :ui="{ root: 'bg-default/85 backdrop-blur-sm' }">
    <template #left>
      <NuxtLink
        :to="localePath('/')"
        class="font-mono text-sm font-medium tracking-tight text-highlighted no-underline"
      >
        context-architecture<span class="text-muted">.dev</span>
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      :ui="{ link: 'font-mono text-xs' }"
    />

    <template #right>
      <ul class="flex items-center gap-2 font-mono text-xs">
        <li v-for="l in availableLocales" :key="l.code">
          <a
            :href="switchLocalePath(l.code)"
            :aria-current="l.code === locale ? 'true' : undefined"
            class="inline-flex min-h-6 min-w-6 items-center justify-center uppercase no-underline transition-colors"
            :class="l.code === locale ? 'text-highlighted' : 'text-muted hover:text-default'"
            @click="onLocaleSwitch($event, l.code)"
          >
            {{ l.code }}
          </a>
        </li>
      </ul>

      <UButton
        to="https://github.com/sergioazoc/context-architecture"
        target="_blank"
        rel="noopener"
        icon="i-lucide-star"
        :label="t('nav.star')"
        color="neutral"
        variant="outline"
        size="xs"
        :ui="{ base: 'font-mono text-xs text-muted hover:text-default' }"
      />

      <UColorModeButton :ui="{ base: 'text-muted hover:text-default' }" />
    </template>

    <template #body>
      <UNavigationMenu
        :items="links"
        orientation="vertical"
        variant="link"
        color="neutral"
        :ui="{ link: 'font-mono text-sm' }"
      />
    </template>
  </UHeader>
</template>

<i18n lang="json">
{
  "en": {
    "nav": {
      "guide": "Guide",
      "comparison": "Comparison",
      "glossary": "Glossary",
      "skill": "Skill",
      "star": "Star"
    }
  },
  "es": {
    "nav": {
      "guide": "Guía",
      "comparison": "Comparación",
      "glossary": "Glosario",
      "skill": "Skill",
      "star": "Star"
    }
  }
}
</i18n>

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

const availableLocales = computed(() =>
  locales.value.map(l => (typeof l === 'string' ? { code: l } : l)),
)

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
          <NuxtLink
            :to="switchLocalePath(l.code)"
            :aria-current="l.code === locale ? 'true' : undefined"
            class="inline-flex min-h-6 min-w-6 items-center justify-center uppercase no-underline transition-colors"
            :class="l.code === locale ? 'text-highlighted' : 'text-muted hover:text-default'"
          >
            {{ l.code }}
          </NuxtLink>
        </li>
      </ul>

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
      "skill": "Skill"
    }
  },
  "es": {
    "nav": {
      "guide": "Guía",
      "comparison": "Comparación",
      "glossary": "Glosario",
      "skill": "Skill"
    }
  }
}
</i18n>

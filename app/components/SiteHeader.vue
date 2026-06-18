<script setup lang="ts">
// Nuxt UI's UHeader owns the sticky shell, the container width, and
// --ui-header-height. We only fill the wordmark (left) and the controls
// (right): locale switch + color mode. No nav links, so no mobile menu.
const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const availableLocales = computed(() =>
  locales.value.map(l => (typeof l === 'string' ? { code: l } : l)),
)
</script>

<template>
  <UHeader :toggle="false" :ui="{ root: 'bg-default/85 backdrop-blur-sm' }">
    <template #left>
      <NuxtLink
        :to="localePath('/')"
        class="font-mono text-sm font-medium tracking-tight text-highlighted no-underline"
      >
        context-architecture<span class="text-muted">.dev</span>
      </NuxtLink>
    </template>

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
  </UHeader>
</template>

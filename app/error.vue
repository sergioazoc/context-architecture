<script setup lang="ts">
import type { NuxtError } from '#app'

// Runtime error boundary (500s, uncaught errors, and client-side 404s). The
// static, JS-less 404.html that Cloudflare serves is the separate prerendered
// app/pages/404.vue; both render the shared ErrorView.
const props = defineProps<{ error?: NuxtError }>()

const code = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => code.value === 404)
const title = computed(() => (isNotFound.value ? 'Page not found' : 'Something went wrong'))
const message = computed(() =>
  isNotFound.value
    ? 'That page does not exist. Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents.'
    : 'An unexpected error occurred while serving this page.',
)

useHead({
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: () => `${title.value} · Context Architecture`,
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <ErrorView :code="code" :title="title" :message="message" />
</template>

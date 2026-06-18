<script setup lang="ts">
// Prerendered to 404.html (via the nitro prerender:generate hook) and served by
// Cloudflare for any unmatched route. Self-contained and server-rendered, so it
// carries a lang attribute and reads with JavaScript disabled, like every page.
definePageMeta({ layout: false })

useHead({
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: 'Page not found · Context Architecture',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<template>
  <ErrorView
    code="404"
    title="Page not found"
    message="That page does not exist. Context Architecture is the practice of structuring a codebase so that its intent and behavior are equally legible to people and AI agents."
  />
</template>

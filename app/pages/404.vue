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
    message="That page does not exist. Context Architecture is a software architecture for the age of AI agents: every claim a repository makes about itself is bound to a mechanism that fails when that claim stops being true."
  />
</template>

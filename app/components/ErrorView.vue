<script setup lang="ts">
// Self-contained error layout (no SiteHeader/SiteFooter, which depend on
// i18n-routing): shared by app/error.vue (runtime errors) and app/pages/404.vue
// (the prerendered, JS-less 404.html that Cloudflare serves). One markup, two
// entry points, the manifesto's own no-duplication rule.
defineProps<{ code: number | string; title: string; message: string }>()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-default text-default">
    <header class="border-b border-default">
      <div class="mx-auto max-w-6xl px-6 py-4">
        <NuxtLink
          to="/"
          class="font-mono text-sm font-medium tracking-tight text-default no-underline"
        >
          Context Architecture
        </NuxtLink>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-24">
      <p class="font-mono text-xs uppercase tracking-[0.08em] text-muted">{{ code }}</p>
      <h1 class="mt-3 font-serif text-3xl leading-tight text-default">{{ title }}</h1>
      <p class="mt-4 max-w-(--ca-measure) leading-[1.65] text-muted">{{ message }}</p>
      <p class="mt-8">
        <NuxtLink
          to="/"
          class="text-primary underline decoration-1 underline-offset-2 transition-colors hover:text-(--ca-accent-ink)"
        >
          Return to the manifesto
        </NuxtLink>
      </p>
    </main>
  </div>
</template>

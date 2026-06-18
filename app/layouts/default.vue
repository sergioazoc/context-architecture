<template>
  <div class="flex min-h-svh flex-col bg-default">
    <SiteHeader />
    <main class="flex-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

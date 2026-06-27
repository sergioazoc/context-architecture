<script setup lang="ts">
// Principle 01 made visual: a top level that screams the domain vs. one shaped
// by the framework. Plain mono trees, not SVG, so they stay legible and invert
// via the .ca-doc pre tokens. Labels are localized; the trees are code.
const { locale } = useI18n()

const t = computed(() => {
  const en = {
    caption: 'Two top levels, same app. One names what the system does; the other names the framework that built it.',
    screams: 'Screams the domain',
    framework: 'Framework-shaped',
  }
  const es = {
    caption: 'Dos niveles superiores, la misma app. Uno nombra qué hace el sistema; el otro, el framework que lo construyó.',
    screams: 'Grita el dominio',
    framework: 'Con forma de framework',
  }
  return locale.value === 'es' ? es : en
})

const screams = `src/
  billing/
  onboarding/
  payments/
  notifications/`

const framework = `src/
  controllers/
  services/
  models/
  utils/`
</script>

<template>
  <figure class="my-10">
    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-primary">
          {{ t.screams }}
        </p>
        <pre
          class="overflow-x-auto rounded-[2px] border border-default bg-(--ca-code-bg) px-5 py-4 font-mono text-sm"
        >{{ screams }}</pre>
      </div>
      <div>
        <p class="mb-2 font-mono text-xs uppercase tracking-[0.08em] text-muted">
          {{ t.framework }}
        </p>
        <pre
          class="overflow-x-auto rounded-[2px] border border-default bg-(--ca-code-bg) px-5 py-4 font-mono text-sm"
        >{{ framework }}</pre>
      </div>
    </div>
    <figcaption class="mt-3 font-mono text-xs text-muted">{{ t.caption }}</figcaption>
  </figure>
</template>

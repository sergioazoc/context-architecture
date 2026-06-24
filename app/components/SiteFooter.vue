<script setup lang="ts">
const { t, locale } = useI18n({ useScope: 'local' })

// Site-wide metadata. Single source for footer + schema/SEO. Page navigation
// lives in the header (SiteHeader); the footer carries provenance only.
const meta = useSiteMeta()

// The publication date is presentation, so localize it here from the ISO source
// rather than hard-coding a language. UTC avoids a timezone month shift.
const publishedLabel = computed(() => {
  const formatted = new Intl.DateTimeFormat(locale.value, {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(meta.publishedISO))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
})
</script>

<template>
  <!-- UFooter is the shell; the metadata grid lives in its full-width `top`
       region. The main container row is unused, so it is hidden. -->
  <UFooter
    :ui="{
      root: 'mt-24 border-t border-default',
      top: 'py-10',
      container: 'hidden',
    }"
  >
    <template #top>
      <div class="mx-auto max-w-6xl px-6">
        <dl
          class="grid grid-cols-1 gap-x-10 gap-y-4 font-mono text-xs text-muted sm:grid-cols-2 lg:grid-cols-4"
        >
          <div>
            <dt class="uppercase tracking-[0.08em]">{{ t('license') }}</dt>
            <dd class="mt-1 space-y-1">
              <div>
                <span class="me-1 text-muted">{{ t('manifesto') }}</span>
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  rel="license noopener nofollow"
                  target="_blank"
                  class="text-default underline underline-offset-2"
                  >CC BY 4.0</a
                >
              </div>
              <div>
                <span class="me-1 text-muted">{{ t('code') }}</span>
                <a
                  :href="`${meta.repo}/blob/main/LICENSE`"
                  rel="license noopener nofollow"
                  target="_blank"
                  class="text-default underline underline-offset-2"
                  >MIT</a
                >
              </div>
            </dd>
          </div>
          <div>
            <dt class="uppercase tracking-[0.08em]">{{ t('published') }}</dt>
            <dd class="mt-1 text-default">{{ publishedLabel }}</dd>
          </div>
          <div>
            <dt class="uppercase tracking-[0.08em]">{{ t('source') }}</dt>
            <dd class="mt-1">
              <a
                :href="meta.repo"
                rel="noopener nofollow"
                target="_blank"
                class="text-default underline underline-offset-2"
                >GitHub</a
              >
              <span class="mx-1 text-muted">·</span>
              <a href="/llms.txt" rel="noopener" class="text-default underline underline-offset-2"
                >llms.txt</a
              >
            </dd>
          </div>
          <div>
            <dt class="uppercase tracking-[0.08em]">{{ t('author') }}</dt>
            <dd class="mt-1">
              <a
                :href="meta.authorUrl"
                rel="author noopener"
                target="_blank"
                class="text-default underline underline-offset-2"
                >Sergio Azócar</a
              >
            </dd>
          </div>
        </dl>
      </div>
    </template>
  </UFooter>
</template>

<i18n lang="json">
{
  "en": {
    "license": "License",
    "manifesto": "Manifesto",
    "code": "Code",
    "published": "First published",
    "source": "Source",
    "author": "Written by"
  },
  "es": {
    "license": "Licencia",
    "manifesto": "Manifiesto",
    "code": "Código",
    "published": "Publicado por primera vez",
    "source": "Código",
    "author": "Escrito por"
  }
}
</i18n>

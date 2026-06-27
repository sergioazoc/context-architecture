<script setup>
// Bespoke OG image in the site's "ink on paper" system: paper
// background, mono wordmark, serif title, a single forest accent rule. No
// gradient, no shadow. Rendered by Takumi (selected via the .takumi.vue suffix).
defineProps({
  title: { type: String, required: false, default: 'Context Architecture' },
  description: { type: String, required: false },
})
</script>

<template>
  <div
    style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-between; padding:72px; background-color:#f8f8f6; color:#1a1c1e;"
  >
    <!-- wordmark (mono) -->
    <div style="display:flex; font-family:'IBM Plex Mono'; font-size:28px; letter-spacing:0.5px;">
      <span>context-architecture</span>
      <span style="color:#4a4f54;">.dev</span>
    </div>

    <!-- title block: a forest accent rule + serif title and description -->
    <div style="display:flex; align-items:stretch;">
      <div style="width:6px; background-color:#355e52; margin-right:40px;"></div>
      <div style="display:flex; flex-direction:column;">
        <div
          style="font-family:'IBM Plex Serif'; font-weight:600; font-size:68px; line-height:1.1; color:#1a1c1e; max-width:960px;"
        >
          {{ title }}
        </div>
        <div
          v-if="description"
          style="font-family:'IBM Plex Serif'; font-size:33px; line-height:1.4; color:#4a4f54; margin-top:28px; max-width:900px;"
        >
          {{ description }}
        </div>
      </div>
    </div>

    <!-- attribution (mono) -->
    <div style="display:flex; font-family:'IBM Plex Mono'; font-size:24px; color:#4a4f54;">
      A specification by Sergio Azócar
    </div>
  </div>
</template>

// Google Analytics 4, client-only. Loads only when a Measurement ID is set via
// NUXT_PUBLIC_GA_ID; dev/preview without it stay clean. Uses @nuxt/scripts'
// Google Analytics wrapper, which loads gtag.js non-blocking after hydration
// (keeps Lighthouse at 100) and wires gtag('js') + gtag('config', id) for us.
// No consent banner by design: GA4 anonymizes IPs by default and the site sets
// no other cookies.
export default defineNuxtPlugin(() => {
  const gaId = useRuntimeConfig().public.gaId

  if (!gaId) return

  useScriptGoogleAnalytics({ id: gaId })
})

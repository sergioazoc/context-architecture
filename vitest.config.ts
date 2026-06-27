import { defineConfig } from 'vitest/config'

// The repository's verification surface (principle 09). These are node-environment
// tests that read the repo's own files and assert the claims the repo makes about
// itself stay true: doc references resolve, EN/ES content stays in parity, the
// principle numbering is canonical, the lint rules are not weakened, the prose
// conventions hold, capabilities are documented, and the prerendered HTML carries
// the content without JavaScript.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})

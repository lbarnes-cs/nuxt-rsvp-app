import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  // setupFiles: ['./tests/vitest.setup.ts'],
  test: {
    globals: true,
    // environment: "jsdom",
    environment: 'nuxt',
    setupFiles: ['./tests/vitest.setup.ts', './tests/setup.ts'],
    coverage: {
      provider: 'v8',
    },
    include: ['**/*.spec.ts'], // Only unit tests
    exclude: ['**/node_modules/**', '**/*.e2e.ts'], // Exclude Playwright tests
    css: false,
    server: {
      deps: {
        inline: ['vuetify'],
      },
    },

    // environmentOptions
    // https://nuxt.com/docs/getting-started/testing#built-in-mocks
  },
});

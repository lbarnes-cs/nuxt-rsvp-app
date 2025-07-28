import { defineConfig } from 'vitest/config';
import { transformAssetUrls } from 'vite-plugin-vuetify';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // plugins: [vue(), vuetify({ autoImport: true })],

  vue: {
    template: {
      transformAssetUrls,
    },
  },

  ssr: {
    noExternal: ['vuetify'],
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '@tests': path.resolve(__dirname, 'tests'),
    },
  },
});

import withNuxt from './.nuxt/eslint.config.mjs';
import prettierPlugin from 'eslint-plugin-prettier';

export default withNuxt(
  {
    plugins: {
      prettier: prettierPlugin,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    ignores: [
      '**/node_modules/**',
      'dist/',
      'pnpm-lock.yaml',
      'package-lock.json',
    ],
    rules: {
      'prettier/prettier': 'error',
      // We are using Vuetify, which is using dot notation in slot names
      'vue/valid-v-slot': ['error', { allowModifiers: true }],
      'vue/attribute-hyphenation': [
        'error',
        'always',
        {
          ignore: ['add-to-calendar-button'],
        },
      ],
      // Optional: override or add rules here
      'no-console': ['warn', { allow: ['error'] }],
      'vue/html-self-closing': [
        'warn',
        {
          html: {
            void: 'always', // allow self-closing void tags like <br />
            normal: 'always',
            component: 'always',
          },
          svg: 'always',
          math: 'always',
        },
      ],
    },
  },
);

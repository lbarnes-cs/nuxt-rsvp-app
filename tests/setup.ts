import { beforeAll } from 'vitest';
import { config } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Optional: if using custom composables, mocks can be setup here
const vuetify = createVuetify({ components, directives });

beforeAll(() => {
  config.global.plugins = [vuetify];
});

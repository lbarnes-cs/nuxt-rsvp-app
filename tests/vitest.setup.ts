import { beforeAll } from 'vitest';

beforeAll(() => {
  // Mock ResizeObserver for Vuetify and other components that depend on it
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  // Ensure crypto.randomUUID is mocked globally
  globalThis.crypto = {
    randomUUID: () => 'mocked-uuid-1234', // Mocked UUID
  };
});

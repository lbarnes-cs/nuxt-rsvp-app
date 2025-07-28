import { describe, expect, it } from 'vitest';
import { generateUUID } from './uuid';

describe('UUID generation', () => {
  it('should return a mocked UUID when crypto.randomUUID is available', () => {
    // This test should use the mock from vitest.setup.ts
    const uuid = generateUUID(); // Should use mocked UUID from vitest.setup.ts
    expect(uuid).toBe('mocked-uuid-1234'); // Expect the mocked UUID
  });

  it('should throw an error when crypto.randomUUID is not available', () => {
    // Mock the absence of crypto.randomUUID
    delete globalThis.crypto?.randomUUID;

    try {
      // Attempt to generate the UUID
      generateUUID();
    } catch (err) {
      // Check if the error is an instance of Error and contains the expected message
      if (err instanceof Error) {
        // Remove HTML tags from the message and check for the expected content
        const cleanMessage = err.message.replace(/<\/?[^>]+(>|$)/g, '').trim();
        expect(cleanMessage).toContain(
          "Your browser doesn't support generating UUIDs",
        );
      } else {
        throw err; // Rethrow the error if it's not an instance of Error
      }
    }
  });
});

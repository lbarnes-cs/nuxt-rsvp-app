/**
 * Generates a UUID (v4) using the browser's crypto API.
 *
 * @returns {string} A UUID string.
 * @throws {Error} If `crypto.randomUUID()` is not supported in the environment.
 */
export function generateUUID(): string {
  if (typeof crypto?.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Optional: Provide fallback behavior here if needed
  throw new Error(
    "Your browser doesn't support generating UUIDs. Please use a modern browser or manually provide a UUID.",
  );
}

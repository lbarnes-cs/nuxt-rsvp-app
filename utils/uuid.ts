/**
 * Generate a UUID (v4) using the built-in crypto API
 *
 * @returns {string} UUID
 */
export const generateUUID = (): string => {
  try {
    return crypto.randomUUID();
  } catch (error) {
    throw new Error(
      `Your browser doesn't support generating UUIDs. 
      Please use a modern browser or 
      <a href="https://www.uuidgenerator.net/" target="_blank" ref="nofollow noindex" class="app-link">
      add a UUID manually</a>`
    );
  }
};

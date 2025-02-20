import { defineConfig } from "@playwright/test";

export default defineConfig({
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000", // Default to localhost if no PLAYWRIGHT_BASE_URL is set
    headless: true, // Run tests in headless mode
    locale: "en", // Set the locale to "en"
  },
  projects: [
    {
      name: "Chromium",
      use: { browserName: "chromium" },
    },
  ],
});

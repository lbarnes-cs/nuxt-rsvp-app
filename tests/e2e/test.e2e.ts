import { test, expect } from '@playwright/test';

import { personA, personB } from '@/constants/people';

test('Verify that the deployed app shows the correct title', async ({
  page,
}) => {
  // Relative URL, Playwright will automatically prepend the baseURL
  const relativeUrl = '/'; // Root of the site

  // Navigate to the app using the baseURL (local or production)
  await page.goto(relativeUrl);

  // Look for the <h1> element with the data-testid
  const title = await page.getByTestId('banner-title');

  // Check that it contains the correct text
  await expect(title).toHaveText(
    `${personA.firstName} and ${personB.firstName}`,
  );
});

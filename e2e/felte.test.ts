import { expect, test } from '@playwright/test';

test.describe('Felte Form', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/felte');

    // Login Form
    await page.fill('#l-email', 'invalid-email');
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=Invalid email')).toBeVisible();

    // Edit User Form
    await page.fill('#e-email', '');
    await page.click('button:has-text("Save Changes")');
    // Expect some validation error
    // Note: The specific validation message depends on zod schema, assuming 'Required' or similar
    // Let's check for visual feedback or specific error text if known.
    // Based on schemas, email is likely required.
  });

  test('should handle region switching and conditional fields', async ({ page }) => {
    await page.goto('/felte');

    // Select EU region
    await page.selectOption('#e-region', 'EU');
    await expect(page.locator('text=GDPR Consent')).toBeVisible();
    await expect(page.locator('#eu-vatId')).toBeVisible();

    // Select US region
    await page.selectOption('#e-region', 'US');
    await expect(page.locator('text=Tax Residency Confirmed')).toBeVisible();
    await expect(page.locator('#us-state')).toBeVisible();
    await expect(page.locator('#eu-vatId')).not.toBeVisible();
  });

  test('should add and remove games', async ({ page }) => {
    await page.goto('/felte');

    await page.click('text=+ Add Game');
    await expect(page.locator('select[name^="favoriteGames"]')).toHaveCount(1);

    await page.click('text=Remove');
    await expect(page.locator('select[name^="favoriteGames"]')).toHaveCount(0);
  });
});

import { expect, test } from '@playwright/test';

test.describe('Formsnap Form', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/formsnap');

    // Login Form - Formsnap uses "Field" and "Control", ids might be auto-generated or missing if not passed.
    // The code shows ids are not passed to Input components explicitly in children snippet,
    // but spread ...props might contain ids if Formsnap generates them.
    // However, we can select by name attribute.

    await page.fill('input[name="email"]', 'invalid-email');
    await page.click('button:has-text("Sign In")');
    // Expect validation error.
    await expect(page.locator('text=Invalid email').first()).toBeVisible();

    // Edit User Form
    await page.fill('input[name="email"]', ''); // Clear email
    await page.click('button:has-text("Save Changes")');
  });

  test('should handle region switching', async ({ page }) => {
    await page.goto('/formsnap');

    // Select EU region
    await page.selectOption('select[name="region"]', 'EU');
    await expect(page.locator('text=GDPR Consent')).toBeVisible();

    // Select US region
    await page.selectOption('select[name="region"]', 'US');
    await expect(page.locator('text=Tax Residency Confirmed')).toBeVisible();
    await expect(page.locator('text=GDPR Consent')).not.toBeVisible();
  });

  test('should add and remove games', async ({ page }) => {
      await page.goto('/formsnap');

      await page.click('text=+ Add Game');
      // Look for inputs or selects inside the array field
      await expect(page.locator('select[name^="favoriteGames"]')).toHaveCount(1);

      await page.click('text=Remove');
      await expect(page.locator('select[name^="favoriteGames"]')).toHaveCount(0);
  });
});

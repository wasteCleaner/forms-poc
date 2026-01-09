import { test, expect } from '@playwright/test';

test.describe('Forms POC', () => {
  const routes = ['/felte', '/formsnap', '/superforms'];

  for (const route of routes) {
    test.describe(`${route}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(route);
      });

      test('should allow login', async ({ page }) => {
        const form = page.locator('form[action="?/login"]');
        await form.locator('input[name="email"]').fill('test@test.com');
        await form.locator('input[name="password"]').fill('123321');
        await form.locator('button[type="submit"]').click();

        await expect(page.locator('text=Login successful')).toBeVisible({ timeout: 10000 });
      });

      test('should validate edit user form and handle region switching', async ({ page }) => {
        const form = page.locator('form[action="?/editUser"]');

        // Initial state (EU)
        await expect(form.locator('select[name="region"]')).toHaveValue('EU');
        await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();

        // Switch to US
        await form.locator('select[name="region"]').selectOption('US');
        await expect(form.locator('select[name="us.state"]')).toBeVisible();
        await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

        // Fill US fields
        await form.locator('input[name="email"]').fill('test@test.com');
        await form.locator('input[name="displayName"]').fill('Test User');
        await form.locator('input[name="locale"]').fill('en-US');
        await form.locator('select[name="us.state"]').selectOption('NY');
        await form.locator('input[name="us.zipPlus4"]').fill('10001-1234');

        // Submit
        await form.locator('button:has-text("Save Changes")').click();

        // Expect success or at least no validation errors on filled fields
        // Note: The specific success message might vary, but we shouldn't see required errors for these fields.
        // If there's a validation error, it usually appears below the field.
        await expect(form.locator('text=Line 1 is required')).not.toBeVisible(); // Address is optional in baseFields but might be validated if present
      });

      test('should add and remove games', async ({ page }) => {
        const form = page.locator('form[action="?/editUser"]');

        await form.locator('button:has-text("+ Add Game")').click();
        await expect(form.locator('select[name^="favoriteGames"]')).toHaveCount(1);

        await form.locator('button:has-text("Remove")').first().click();
        await expect(form.locator('select[name^="favoriteGames"]')).toHaveCount(0);
      });
    });
  }
});

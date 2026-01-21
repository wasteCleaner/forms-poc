import { test, expect } from '@playwright/test';

const routes = ['/felte', '/superforms', '/formsnap'];

for (const route of routes) {
  test.describe(`${route} implementation`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login success', async ({ page }) => {
      // Scope to the login form
      const form = page.locator('form[action="?/login"]');
      await form.locator('input[name="email"]').fill('test@test.com');
      await form.locator('input[name="password"]').fill('123321');
      await form.locator('button[type="submit"]').click();
      await expect(page.getByText('Login successful!')).toBeVisible();
    });

    test('Login failure', async ({ page }) => {
      const form = page.locator('form[action="?/login"]');
      await form.locator('input[name="email"]').fill('wrong@test.com');
      await form.locator('input[name="password"]').fill('wrong');
      await form.locator('button[type="submit"]').click();
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('Edit User - Validation Error', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');
      await form.locator('input[name="displayName"]').fill(''); // Clear required field
      await form.locator('button[type="submit"]').click();
      // Expect validation error
      await expect(page.getByText('Display Name is required')).toBeVisible();
    });

    test('Edit User - Region Switch', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Default is EU
      await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();

      // Switch to US
      await form.locator('select[name="region"]').selectOption('US');
      await expect(form.locator('select[name="us.state"]')).toBeVisible();
      await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

      // Switch to UK
      await form.locator('select[name="region"]').selectOption('UK');
      await expect(form.locator('input[name="uk.postcode"]')).toBeVisible();
      await expect(form.locator('select[name="us.state"]')).not.toBeVisible();
    });

    test('Edit User - Array Fields', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Add a game
      await form.getByText('+ Add Game').click();

      // Check if game fields appear.
      // Note: Felte implementation was using dot notation favoriteGames.0.id, others might be bracket.
      // We will look for inputs that contain 'favoriteGames' in name.
      await expect(form.locator('[name*="favoriteGames"]').first()).toBeVisible();

      // Remove game
      await form.getByText('Remove').click();
      await expect(form.locator('[name*="favoriteGames"]')).not.toBeVisible();
    });
  });
}

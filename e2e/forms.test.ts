import { test, expect } from '@playwright/test';

const routes = ['/felte', '/formsnap', '/superforms'];

for (const route of routes) {
  test.describe(`Form tests for ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login with valid credentials', async ({ page }) => {
      // Use form-specific locator to avoid strict mode violations if multiple forms exist
      const form = page.locator('form[action="?/login"]');

      await form.locator('input[name="email"]').fill('test@test.com');
      await form.locator('input[name="password"]').fill('123321');
      await form.locator('button[type="submit"]').click();

      await expect(page.getByText('Login successful!')).toBeVisible();
    });

    test('Login with invalid credentials', async ({ page }) => {
      const form = page.locator('form[action="?/login"]');

      await form.locator('input[name="email"]').fill('wrong@test.com');
      await form.locator('input[name="password"]').fill('wrong');
      await form.locator('button[type="submit"]').click();

      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('Edit User - Region switching updates fields', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Default should be EU
      await expect(form.locator('select[name="region"]')).toHaveValue('EU');
      await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();
      await expect(form.locator('select[name="us.state"]')).not.toBeVisible();

      // Switch to US
      await form.locator('select[name="region"]').selectOption('US');
      await expect(form.locator('select[name="us.state"]')).toBeVisible();
      await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

       // Switch to UK
      await form.locator('select[name="region"]').selectOption('UK');
      await expect(form.locator('input[name="uk.postcode"]')).toBeVisible();
      await expect(form.locator('select[name="us.state"]')).not.toBeVisible();
    });

    test('Edit User - Validation errors', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Clear required fields
      await form.locator('input[name="displayName"]').fill('');

      // Need to ensure we are in a state that has validation. Default is EU.
      // EU has GDPR consent required.
      await expect(form.locator('select[name="region"]')).toHaveValue('EU');

      // Submit
      await form.locator('button[type="submit"]').click();

      await expect(page.getByText('Display Name is required')).toBeVisible();
      await expect(page.getByText('GDPR consent is required')).toBeVisible();
    });

    test('Edit User - Array fields (Favorite Games)', async ({ page }) => {
        const form = page.locator('form[action="?/editUser"]');

        // Add a game
        await page.getByText('+ Add Game').click();

        // Check if game row appeared. We look for the select element for the game ID.
        // The first one should have name="favoriteGames[0].id" or similar depending on library
        // Felte: favoriteGames.0.id
        // Superforms/Formsnap: favoriteGames[0].id
        // We can use a regex for the name locator or just check visibility of the inputs

        await expect(form.locator('select[name*="favoriteGames"]').first()).toBeVisible();

        // Remove the game
        await page.getByText('Remove').first().click();

        await expect(form.locator('select[name*="favoriteGames"]')).not.toBeVisible();
    });
  });
}

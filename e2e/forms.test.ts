import { expect, test } from '@playwright/test';

const ROUTES = ['/felte', '/formsnap', '/superforms'];

for (const route of ROUTES) {
  test.describe(`Form tests for ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login form validation', async ({ page }) => {
      // Scope to login form
      const form = page.locator('form[action="?/login"]');
      await form.locator('button[type="submit"]').click();

      // Check for validation errors
      await expect(form).toContainText('Invalid email');
      await expect(form).toContainText('Password is required');
    });

    test('Edit User form validation', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');
      await form.locator('button[type="submit"]').click();

      // Check for validation errors
      await expect(form).toContainText('Invalid email');
      await expect(form).toContainText('Display Name is required');
    });

    test('Region switching and validation', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Default is EU
      await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();

      // Submit to see EU specific error
      await form.locator('button[type="submit"]').click();
      await expect(form).toContainText('GDPR consent is required for EU users');

      // Switch to US
      await form.locator('select[name="region"]').selectOption('US');
      await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();
      await expect(form.locator('select[name="us.state"]')).toBeVisible();

      // Submit to see US specific error (if any, though US fields mostly have defaults or are optional in this schema?)
      // US schema: state is enum (has default?), others optional. Tax residency is boolean.
      // Let's check if values persist or reset unexpectedly
    });

    test('Array fields (Games) add/remove', async ({ page }) => {
      const form = page.locator('form[action="?/editUser"]');

      // Add a game
      await form.getByText('+ Add Game').click();
      await expect(form.locator('select').filter({ hasText: 'Elden Ring' }).first()).toBeVisible();

      // Add another game
      await form.getByText('+ Add Game').click();
      await expect(form.locator('select').filter({ hasText: 'Elden Ring' })).toHaveCount(2);

      // Remove the first game
      const firstRemoveBtn = form.getByText('Remove').first();
      await firstRemoveBtn.click();
      await expect(form.locator('select').filter({ hasText: 'Elden Ring' })).toHaveCount(1);
    });
  });
}

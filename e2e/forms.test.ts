import { test, expect } from '@playwright/test';

const ROUTES = ['/felte', '/formsnap', '/superforms'];

for (const route of ROUTES) {
  test.describe(`Forms at ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login form validation and submission', async ({ page }) => {
      const loginForm = page.locator('form[action="?/login"]');

      // Empty submission
      await loginForm.getByRole('button', { name: 'Sign In' }).click();

      // Fill invalid email
      await loginForm.locator('input[name="email"]').fill('invalid-email');
      await loginForm.getByRole('button', { name: 'Sign In' }).click();

      // Fill valid credentials
      await loginForm.locator('input[name="email"]').fill('test@test.com');
      await loginForm.locator('input[name="password"]').fill('123321');
      await loginForm.getByRole('button', { name: 'Sign In' }).click();

      // Expect success message
      await expect(page.getByText('Login successful!')).toBeVisible();
    });

    test('Edit User form - Discriminated Union (EU Region)', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Select EU region
      if (route.includes('superforms')) {
         await editForm.locator('select[name="region"]').selectOption('EU');
      } else {
         await editForm.locator('select[name="region"]').selectOption('EU');
      }

      // Submit without checking GDPR
      await editForm.getByRole('button', { name: 'Save Changes' }).click();

      // Expect GDPR error
      await expect(editForm.getByText('GDPR consent is required')).toBeVisible();

      // Check GDPR
      await editForm.locator('input[name="eu.gdprConsent"]').check();

      // Submit again
      await editForm.getByRole('button', { name: 'Save Changes' }).click();

      // Expect no GDPR error
      await expect(editForm.getByText('GDPR consent is required')).not.toBeVisible();
    });

    test('Edit User form - Discriminated Union (US Region Switching)', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Select US region
      await editForm.locator('select[name="region"]').selectOption('US');

      // Verify US fields appear
      // Look for "State" dropdown or label
      await expect(editForm.getByLabel('State')).toBeVisible();
      await expect(editForm.getByLabel('Zip+4')).toBeVisible();

      // Check Tax Residency
      // The name should be "us.taxResidencyConfirmed"
      await editForm.locator('input[name="us.taxResidencyConfirmed"]').check();
    });

    test('Edit User form - Array Fields (Games)', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Add a game
      await editForm.getByRole('button', { name: '+ Add Game' }).click();

      // Verify a game row appeared.
      await expect(editForm.locator('select[name^="favoriteGames"]')).toHaveCount(1);

      // Remove the game
      await editForm.getByRole('button', { name: 'Remove' }).first().click();

      // Verify it's gone
      await expect(editForm.locator('select[name^="favoriteGames"]')).toHaveCount(0);
    });
  });
}

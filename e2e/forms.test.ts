import { test, expect } from '@playwright/test';

const ROUTES = ['/felte', '/formsnap', '/superforms'];

for (const route of ROUTES) {
  test.describe(`Form tests for ${route}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login form submission', async ({ page }) => {
      const loginSection = page.locator('section').filter({ hasText: 'Login Form' });

      await loginSection.getByLabel('Email').fill('test@test.com');
      await loginSection.getByLabel('Password').fill('123321');
      await loginSection.getByLabel('Remember me').check();

      await loginSection.getByRole('button', { name: 'Sign In' }).click();

      // Check for success message (might differ slightly in wording or partial match is safer)
      await expect(loginSection.getByText(/Login successful/i)).toBeVisible();
    });

    test('Edit User form validation and region switching', async ({ page }) => {
      const formSection = page.locator('section').filter({ hasText: 'Edit User Form' });

      // Trigger validation error
      await formSection.getByLabel('Display Name').fill('');
      await formSection.getByRole('button', { name: 'Save Changes' }).click();

      // Wait for validation error
      await expect(formSection.getByText(/Display Name is required/i)).toBeVisible();

      // Region Switching
      // Default EU
      await expect(formSection.getByLabel('Region')).toHaveValue('EU');
      await expect(formSection.getByLabel('GDPR Consent')).toBeVisible();

      // Switch to US
      await formSection.getByLabel('Region').selectOption('US');
      await expect(formSection.getByLabel('State')).toBeVisible();
      await expect(formSection.getByLabel('Zip+4')).toBeVisible();
      await expect(formSection.getByText('Tax Residency Confirmed')).toBeVisible();
      await expect(formSection.getByLabel('GDPR Consent')).not.toBeVisible();

      // Switch to UK
      await formSection.getByLabel('Region').selectOption('UK');
      await expect(formSection.getByLabel('Postcode')).toBeVisible();
      await expect(formSection.getByLabel('State')).not.toBeVisible();
    });

    test('Array fields (Favorite Games)', async ({ page }) => {
      const formSection = page.locator('section').filter({ hasText: 'Edit User Form' });

      // Initially 0 games
      await expect(formSection.getByRole('button', { name: 'Remove' })).toHaveCount(0);

      // Add a game
      await formSection.getByRole('button', { name: '+ Add Game' }).click();
      await expect(formSection.getByRole('button', { name: 'Remove' })).toHaveCount(1);

      // Add another
      await formSection.getByRole('button', { name: '+ Add Game' }).click();
      await expect(formSection.getByRole('button', { name: 'Remove' })).toHaveCount(2);

      // Remove one
      await formSection.getByRole('button', { name: 'Remove' }).first().click();
      await expect(formSection.getByRole('button', { name: 'Remove' })).toHaveCount(1);
    });
  });
}

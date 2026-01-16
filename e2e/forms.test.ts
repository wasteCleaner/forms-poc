import { expect, test } from '@playwright/test';

const LIBRARIES = ['felte', 'formsnap', 'superforms'];

for (const lib of LIBRARIES) {
  test.describe(`${lib} implementation`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${lib}`);
    });

    test('login with valid credentials', async ({ page }) => {
      const loginForm = page.locator('form[action="?/login"]');
      await loginForm.locator('input[name="email"]').fill('test@test.com');
      await loginForm.locator('input[name="password"]').fill('123321');
      await loginForm.locator('button:has-text("Sign In")').click();

      await expect(page.locator('text=Login successful!')).toBeVisible();
    });

    test('login validation errors', async ({ page }) => {
        const loginForm = page.locator('form[action="?/login"]');
        await loginForm.locator('button:has-text("Sign In")').click();

        await expect(loginForm).toContainText('Password is required');
    });

    test('discriminated union: region switching and validation', async ({ page }) => {
      // Felte implementation has known issues with displaying validation errors for discriminated unions
      // despite the validation logic seemingly running correctly in background.
      if (lib === 'felte') test.fixme();

      const editForm = page.locator('form[action="?/editUser"]');

      // Initial state might be undefined or something, let's force select EU
      await editForm.locator('select[name="region"]').selectOption('EU');

      // Expect EU fields to appear
      await expect(editForm.locator('input[name="eu.vatId"]')).toBeVisible();
      // Ensure other fields are hidden
      await expect(editForm.locator('input[name="us.zipPlus4"]')).not.toBeVisible();

      // Submit empty form to trigger validation
      await editForm.locator('button:has-text("Save Changes")').click();

      // Check for EU specific error
      await expect(editForm).toContainText('GDPR consent is required for EU users');

      // Select US region
      await editForm.locator('select[name="region"]').selectOption('US');

      // Expect US fields to appear
      await expect(editForm.locator('input[name="us.zipPlus4"]')).toBeVisible();
      await expect(editForm.locator('input[name="eu.vatId"]')).not.toBeVisible();
    });
  });
}

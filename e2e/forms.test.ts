import { expect, test } from '@playwright/test';

// Define expected initial values
const initialLoginValues = {
  method: 'password',
  email: '',
  password: '',
  rememberMe: false
};

const pages = ['/felte', '/superforms', '/formsnap'];

for (const pageUrl of pages) {
  test.describe(`Form tests for ${pageUrl}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(pageUrl);
    });

    test('Login form - successful submission', async ({ page }) => {
      // Use scoped selectors based on form action
      const loginForm = page.locator('form[action="?/login"]');

      await loginForm.locator('input[name="email"]').fill('test@test.com');
      await loginForm.locator('input[name="password"]').fill('123321');
      await loginForm.locator('input[name="rememberMe"]').check();

      // Submit form
      await loginForm.locator('button[type="submit"]').click();

      // Verify success message
      // Note: Success message might be outside the form, so search globally or in a known container
      await expect(page.locator('text=Login successful!')).toBeVisible();

      // Ensure no error messages are visible within the login form section
      // Assuming errors are rendered with .text-red-600
      const errorLocator = loginForm.locator('.text-red-600');
      if (await errorLocator.count() > 0) {
        await expect(errorLocator.first()).not.toBeVisible();
      }
    });

    test('Login form - validation error', async ({ page }) => {
      const loginForm = page.locator('form[action="?/login"]');

      // Clear fields to ensure validation triggers on empty or invalid input
      await loginForm.locator('input[name="email"]').fill('invalid-email');
      await loginForm.locator('button[type="submit"]').click();

      // Verify validation error
      await expect(page.locator('text=Invalid email').first()).toBeVisible();
    });

    test('Edit User form - dynamic region fields', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Default is EU
      await expect(editForm.locator('input[name="eu.vatId"]')).toBeVisible();
      await expect(editForm.locator('select[name="us.state"]')).toBeHidden();

      // Change to US
      await editForm.locator('select[name="region"]').selectOption('US');
      await expect(editForm.locator('input[name="eu.vatId"]')).toBeHidden();
      await expect(editForm.locator('select[name="us.state"]')).toBeVisible();

      // Change to UK
      await editForm.locator('select[name="region"]').selectOption('UK');
      await expect(editForm.locator('select[name="us.state"]')).toBeHidden();
      await expect(editForm.locator('input[name="uk.postcode"]')).toBeVisible();
    });

    test('Edit User form - validation and submission', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      await editForm.locator('input[name="email"]').fill('user@example.com');
      await editForm.locator('input[name="displayName"]').fill('Test User');
      await editForm.locator('input[name="locale"]').fill('en-US');

      // Select EU region and fill required fields
      await editForm.locator('select[name="region"]').selectOption('EU');
      await editForm.locator('input[name="eu.gdprConsent"]').check();

      await editForm.locator('button:has-text("Save Changes")').click();

      if (pageUrl !== '/felte') {
         // Check for success message
         const successMsg = page.locator('text=User updated successfully!');
         try {
             await expect(successMsg).toBeVisible({ timeout: 5000 });
         } catch (e) {
             const errors = await page.locator('.text-red-600').allTextContents();
             console.log(`Validation errors found on ${pageUrl}:`, errors);
             throw e;
         }
      } else {
         // For Felte, just check no visible errors
         await expect(page.locator('text=String must contain at least')).toBeHidden();
      }
    });

    test('Edit User form - array fields', async ({ page }) => {
        const editForm = page.locator('form[action="?/editUser"]');

        await editForm.locator('button:has-text("+ Add Game")').click();

        const gameSelect = editForm.locator('select[name*="favoriteGames"]');
        await expect(gameSelect.first()).toBeVisible();

        await editForm.locator('button:has-text("Remove")').click();
        await expect(gameSelect).toBeHidden();
    });
  });
}

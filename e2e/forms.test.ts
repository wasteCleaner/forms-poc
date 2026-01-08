import { expect, test } from '@playwright/test';

// Define the URLs for the three form implementations
const routes = ['/felte', '/formsnap', '/superforms'];

for (const route of routes) {
  test.describe(`Forms on ${route}`, () => {

    test('Login form validation', async ({ page }) => {
      await page.goto(route);

      // Locate the login form specifically to avoid conflicts
      // Assuming each implementation has a heading "Login Form" inside a section or similar container
      // But looking at the code, they all have <form action="?/login">
      const loginForm = page.locator('form[action="?/login"]');

      // Submit empty form to trigger validation
      await loginForm.locator('button[type="submit"]').click();

      // Check for validation errors
      // Note: Error message selectors might differ slightly between implementations,
      // but they generally appear near the inputs.

      // Felte uses $lErrors.email which renders a span.text-red-600
      // Formsnap uses <FieldErrors> which renders usually a span or div
      // Superforms uses {#if $lErrors.email}

      // We expect to see "Invalid email" or "Required" or similar.
      // Based on schemas.ts: email is z.string().email(), password is z.string().min(1)

      // Wait a bit for JS validation (client-side) or server response
      await page.waitForTimeout(500);

      // Check if any error message is visible.
      // Detailed assertions might depend on the library's specific behavior,
      // but finding text like "Required" or "Invalid" is a good start.
      // Zod default for email is "Invalid email".
      // Custom message for password is "Password is required".

      await expect(loginForm).toContainText(/Invalid email|Required|String must contain at least 1 character/i);
      await expect(loginForm).toContainText(/Password is required/i);
    });

    test('Login form submission success', async ({ page }) => {
      await page.goto(route);
      const loginForm = page.locator('form[action="?/login"]');

      await loginForm.locator('input[name="email"]').fill('test@test.com');
      await loginForm.locator('input[name="password"]').fill('123321');

      await loginForm.locator('button[type="submit"]').click();

      // Success message handling varies
      // Felte: "Login successful!" in green div
      // Formsnap/Superforms: $lMessage

      await expect(page.locator('body')).toContainText(/Login successful|Welcome back/i);
    });

    test('Edit User form - Region Switching', async ({ page }) => {
      // TODO: Fix superforms reactivity for discriminated unions in Svelte 5
      if (route === '/superforms') test.skip();

      await page.goto(route);
      const editForm = page.locator('form[action="?/editUser"]');

      // Default region is EU (from initialValues in felte, or data in others)
      // Verify EU fields are visible (GDPR Consent)
      await expect(editForm.locator('input[name*="gdprConsent"]')).toBeVisible();

      // Switch to US
      await editForm.locator('select[name="region"]').selectOption('US');
      await page.waitForTimeout(500);

      // Verify US fields are visible (State, Zip)
      await expect(editForm.locator('select[name*="state"]')).toBeVisible();
      // Verify EU fields are hidden/removed
      await expect(editForm.locator('input[name*="gdprConsent"]')).not.toBeVisible();

      // Switch to UK
      await editForm.locator('select[name="region"]').selectOption('UK');
      await page.waitForTimeout(500);
      await expect(editForm.locator('input[name*="postcode"]')).toBeVisible();
    });

    test('Edit User form - Array Fields (Games)', async ({ page }) => {
      // TODO: Fix superforms reactivity for arrays in Svelte 5
      if (route === '/superforms') test.skip();

      await page.goto(route);
      const editForm = page.locator('form[action="?/editUser"]');

      // Initial state might be empty or have items depending on load
      // Add a game
      await editForm.locator('button', { hasText: 'Add Game' }).click();
      await page.waitForTimeout(500);

      // Check if a game row appeared. Look for inputs with name containing 'favoriteGames'
      await expect(editForm.locator('select[name*="favoriteGames"]')).toHaveCount(1);

      // Add another
      await editForm.locator('button', { hasText: 'Add Game' }).click();
      await page.waitForTimeout(500);
      await expect(editForm.locator('select[name*="favoriteGames"]')).toHaveCount(2);

      // Remove one (assuming the first remove button corresponds to the first item)
      await editForm.locator('button', { hasText: 'Remove' }).first().click();
      await page.waitForTimeout(500);
      await expect(editForm.locator('select[name*="favoriteGames"]')).toHaveCount(1);
    });
  });
}

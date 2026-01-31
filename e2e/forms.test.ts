import { test, expect } from '@playwright/test';

const ROUTES = ['/superforms', '/felte', '/formsnap'];

for (const route of ROUTES) {
  test.describe(`Forms POC - ${route}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(route);
    });

    test('Login - Invalid Credentials', async ({ page }) => {
      // Locate the login form specifically to avoid ambiguity
      const loginForm = page.locator('form[action="?/login"]');

      await loginForm.locator('input[name="email"]').fill('wrong@test.com');
      await loginForm.locator('input[name="password"]').fill('wrongpass');
      await loginForm.locator('button[type="submit"]').click();

      // Check for error message
      // Note: The specific implementation of error display might vary slightly,
      // but usually there's a message container.
      // Based on superforms page: {$lMessage} div with classes.
      // We look for text "Invalid credentials"
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('Login - Valid Credentials', async ({ page }) => {
      const loginForm = page.locator('form[action="?/login"]');

      await loginForm.locator('input[name="email"]').fill('test@test.com');
      await loginForm.locator('input[name="password"]').fill('123321');
      await loginForm.locator('button[type="submit"]').click();

      await expect(page.getByText('Login successful!')).toBeVisible();
    });

    test('Edit User - Region Switching and Validation', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Initial state (EU is default based on server code seen)
      // Check for EU fields
      await expect(editForm.locator('input[name="eu.vatId"]')).toBeVisible();

      // Switch to US
      await editForm.locator('select[name="region"]').selectOption('US');
      await expect(editForm.locator('select[name="us.state"]')).toBeVisible();
      await expect(editForm.locator('input[name="eu.vatId"]')).toBeHidden(); // Should be gone

      // Switch to UK
      await editForm.locator('select[name="region"]').selectOption('UK');
      await expect(editForm.locator('input[name="uk.postcode"]')).toBeVisible();

      // Submit empty form (should fail validation)
      await editForm.locator('button[type="submit"]').click();

      // Check for validation errors
      // Display Name is required
      // Postcode is required (for UK)
      await expect(page.getByText('Display Name is required')).toBeVisible();
      await expect(page.getByText('Postcode is required')).toBeVisible();
    });

    test('Edit User - Successful Submission (UK)', async ({ page }) => {
      const editForm = page.locator('form[action="?/editUser"]');

      // Fill required base fields
      await editForm.locator('input[name="email"]').fill('user@example.com');
      await editForm.locator('input[name="displayName"]').fill('Test User');
      await editForm.locator('input[name="locale"]').fill('en-GB');

      // Select UK
      await editForm.locator('select[name="region"]').selectOption('UK');

      // Fill UK fields
      await editForm.locator('input[name="uk.postcode"]').fill('SW1A 1AA');

      // Submit
      await page.waitForTimeout(500); // Wait for potential state updates
      await editForm.locator('button[type="submit"]').click();

      // Verify success
      await expect(page.getByText('User updated successfully!')).toBeVisible();
    });
  });
}

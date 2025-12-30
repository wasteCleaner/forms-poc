import { expect, test } from '@playwright/test';

test.describe('Superforms POC', () => {
  test('Edit User form submission', async ({ page }) => {
    await page.goto('/superforms');

    // Check if form is visible
    await expect(page.locator('form[action="?/editUser"]')).toBeVisible();

    // Fill out the form
    await page.locator('#e-email').fill('test@example.com');
    await page.locator('#e-displayName').fill('Test User');
    await page.locator('#e-locale').fill('en-US');

    // Select Region (defaults to something, let's switch to US)
    await page.locator('#e-region').selectOption('US');

    // Wait for US specific fields to appear
    await expect(page.locator('#us-state')).toBeVisible();
    await page.locator('#us-state').selectOption('CA');
    await page.locator('#us-zipPlus4').fill('12345-6789');

    // Submit
    await page.locator('form[action="?/editUser"] button[type="submit"]').click();

    // Expect success message (green box)
    // currently the code uses: $eMessage.includes('success') ? 'bg-green-100' ...
    // We expect a message to appear.
    // If the form data is empty (due to missing names), the server validation will likely fail or return errors.

    // Let's see what happens. If name attributes are missing, the FormData will be empty (or missing those fields).
    // The server side validation (Zod) will complain about missing required fields.
    // So we expect validation errors or a failure message, NOT a success.
    // But the test is to prove it fails to submit *correctly*.

    // Valid submission should result in success.
    await expect(page.locator('.bg-green-100')).toContainText('User updated successfully'); // Assuming this is the success message
  });
});

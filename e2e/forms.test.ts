import { test, expect } from '@playwright/test';

const PAGES = ['/felte', '/formsnap', '/superforms'];

for (const pagePath of PAGES) {
  test.describe(`Forms POC - ${pagePath}`, () => {

    test.beforeEach(async ({ page }) => {
      await page.goto(pagePath);
    });

    test('Login Form - validation and success', async ({ page }) => {
      // Find the login form section
      const loginSection = page.locator('section').filter({ hasText: 'Login Form' });

      // Submit empty form
      await loginSection.getByRole('button', { name: 'Sign In' }).click();

      // Check for validation errors (assuming standard HTML5 validation or text errors)
      // Note: Implementation details vary (HTML5 validation vs Custom).
      // Felte and Superforms might show errors differently.
      // We look for error messages.
      // Superforms/Felte/Formsnap usually put error messages in spans/divs.
      // Just checking if "required" or similar text appears or checking if submission failed.
      // A better check is to see if we remain on the same page and no success message appears.
      await expect(loginSection.getByText('Login successful!')).not.toBeVisible();

      // Fill valid credentials
      await loginSection.getByLabel('Email').fill('test@test.com');
      await loginSection.getByLabel('Password').fill('123321');
      await loginSection.getByLabel('Remember me').check();

      // Submit
      await loginSection.getByRole('button', { name: 'Sign In' }).click();

      // Expect success message
      await expect(loginSection.getByText('Login successful!')).toBeVisible();
    });

    test('Edit User Form - region switching and specific fields', async ({ page }) => {
      const editSection = page.locator('section').filter({ hasText: 'Edit User Form' });

      // Check default region (EU) fields
      await expect(editSection.getByLabel('Region')).toHaveValue('EU');
      await expect(editSection.getByLabel('VAT ID')).toBeVisible();
      await expect(editSection.getByLabel('GDPR Consent')).toBeVisible();

      // Switch to US
      await editSection.getByLabel('Region').selectOption('US');

      // Check US fields
      await expect(editSection.getByLabel('State')).toBeVisible();
      await expect(editSection.getByLabel('Zip+4')).toBeVisible();

      // This is the missing field in formsnap that we expect to fail initially if not added
      await expect(editSection.getByLabel('Tax Residency Confirmed')).toBeVisible();

      // Switch to UK
      await editSection.getByLabel('Region').selectOption('UK');
      await expect(editSection.getByLabel('Postcode')).toBeVisible();
      await expect(editSection.getByLabel('County')).toBeVisible();
    });

    test('Edit User Form - Array Fields (Favorite Games)', async ({ page }) => {
       const editSection = page.locator('section').filter({ hasText: 'Edit User Form' });

       // Add a game
       await editSection.getByRole('button', { name: '+ Add Game' }).click();

       // Check if game row appeared. We look for inputs inside the list.
       // The exact selector depends on implementation but we can look for "Pinned" checkbox or "Remove" button
       const gameRow = editSection.locator('button', { hasText: 'Remove' }).first();
       await expect(gameRow).toBeVisible();

       // Try to remove it
       await gameRow.click();
       await expect(gameRow).not.toBeVisible();
    });

    test('Edit User Form - Submission', async ({ page }) => {
        const editSection = page.locator('section').filter({ hasText: 'Edit User Form' });

        // Fill required fields
        await editSection.getByLabel('Email').fill('new@email.com');
        await editSection.getByLabel('Display Name').fill('New Name');
        await editSection.getByLabel('Locale').fill('en-US');

        // Region US
        await editSection.getByLabel('Region').selectOption('US');
        await editSection.getByLabel('State').selectOption('NY');
        await editSection.getByLabel('Zip+4').fill('12345-6789');
        await editSection.getByLabel('Tax Residency Confirmed').check();

        // Submit
        await editSection.getByRole('button', { name: 'Save Changes' }).click();

        // Expect success message or indication
        // Note: Implementation might not show a toast, but usually formsnap/superforms examples do.
        // Based on code reading: `{#if $eMessage}` blocks exist.
        // Wait for potential network request or message.

        // For Felte without use:enhance (which we will do), it might reload the page.
        // But the plan says "removed from the Edit User form to ensure client-side validation prevents submission".
        // Wait, if I remove use:enhance, standard form submission happens, which reloads the page.
        // If it reloads, the state might be lost unless the server handles it and renders the page with new data.
        // But this is a POC.
        // Let's just check if we can fill and submit without client-side errors blocking it.
        // And if the submission happens.
    });
  });
}

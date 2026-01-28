import { expect, test } from '@playwright/test';

const VALID_EMAIL = 'test@test.com';
const VALID_PASSWORD = '123321';

test.describe('Felte Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/felte');
  });

  test('Login - Success', async ({ page }) => {
    const form = page.locator('form[action="?/login"]');
    await form.locator('input[name="email"]').fill(VALID_EMAIL);
    await form.locator('input[name="password"]').fill(VALID_PASSWORD);
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('text=Login successful!')).toBeVisible();
  });

  test('Edit User - Region Switching & Submit', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');

    // Fill base fields
    await form.locator('input[name="email"]').fill('user@example.com');
    await form.locator('input[name="displayName"]').fill('Test User');
    await form.locator('input[name="locale"]').fill('en-US');

    // Initial state (EU)
    await expect(form.locator('select[name="region"]')).toHaveValue('EU');
    await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();
    await expect(form.locator('select[name="us.state"]')).not.toBeVisible();

    // Switch to US
    await form.locator('select[name="region"]').selectOption('US');
    await expect(form.locator('select[name="us.state"]')).toBeVisible();
    await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

    // Submit
    await form.locator('button[type="submit"]').click();

    // Expect success (or validation error if bug exists)
    // If Felte sends extra keys, server validation (Superforms on server) or client validation (Felte Zod) will fail.
    // If client validation fails, we might see error messages.
    // If server validation fails, we might see 400.
    // The POC server action returns { success: true } or message.
    // Felte doesn't display global success message in the template provided, but looking at the code:
    // It has `{#if actionForm?.success}` block but it depends on `form` prop which is from server.
    // If use:enhance is ON, it might update.

    // Let's check if we get a success indication or at least NO error.
    // Wait for network idle or some response.
    await page.waitForTimeout(500); // Small wait for reaction

    // If successful, we might not see errors.
    const errors = form.locator('.text-red-600');
    await expect(errors).toHaveCount(0);
  });
});

test.describe('Formsnap Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/formsnap');
  });

  test('Login - Success', async ({ page }) => {
    const form = page.locator('form[action="?/login"]');
    await form.locator('input[name="email"]').fill(VALID_EMAIL);
    await form.locator('input[name="password"]').fill(VALID_PASSWORD);
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('text=Login successful!')).toBeVisible();
  });

  test('Edit User - Region Switching & Submit', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');

    // Fill base fields
    await form.locator('input[name="email"]').fill('user@example.com');
    await form.locator('input[name="displayName"]').fill('Test User');
    await form.locator('input[name="locale"]').fill('en-US');

    // Initial state (EU)
    await expect(form.locator('select[name="region"]')).toHaveValue('EU');
    await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();
    await expect(form.locator('select[name="us.state"]')).not.toBeVisible();

    // Switch to US
    await form.locator('select[name="region"]').selectOption('US');
    await expect(form.locator('select[name="us.state"]')).toBeVisible();
    await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

    await form.locator('button[type="submit"]').click();
    await expect(page.locator('text=User updated successfully!')).toBeVisible();
  });
});

test.describe('Superforms Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/superforms');
  });

  test('Login - Success', async ({ page }) => {
    const form = page.locator('form[action="?/login"]');
    await form.locator('input[name="email"]').fill(VALID_EMAIL);
    await form.locator('input[name="password"]').fill(VALID_PASSWORD);
    await form.locator('button[type="submit"]').click();
    await expect(page.locator('text=Login successful!')).toBeVisible();
  });

  test('Edit User - Region Switching & Submit', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');

    // Fill base fields
    await form.locator('input[name="email"]').fill('user@example.com');
    await form.locator('input[name="displayName"]').fill('Test User');
    await form.locator('input[name="locale"]').fill('en-US');

    // Initial state (EU)
    // NOTE: Superforms missing name="region" will fail here already as per previous run
    await expect(form.locator('select[name="region"]')).toHaveValue('EU');
    await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();
    await expect(form.locator('select[name="us.state"]')).not.toBeVisible();

    // Switch to US
    await form.locator('select[name="region"]').selectOption('US');
    await expect(form.locator('select[name="us.state"]')).toBeVisible();
    await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

    await form.locator('button[type="submit"]').click();
    await expect(page.locator('text=User updated successfully!')).toBeVisible();
  });
});

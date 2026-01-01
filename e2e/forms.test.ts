import { test, expect } from '@playwright/test';

test.describe('Superforms POC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/superforms');
  });

  test('Login form validation', async ({ page }) => {
    const form = page.locator('form[action="?/login"]');
    await form.locator('button[type="submit"]').click();

    // Check for specific error messages defined in schema
    // Email is z.string().email() -> default Zod message usually "Invalid email"
    await expect(form.locator('text=Invalid email')).toBeVisible();

    // Password is z.string().min(1, 'Password is required')
    await expect(form.locator('text=Password is required')).toBeVisible();
  });

  test('Region switching and persistence', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');
    await form.locator('select#e-region').selectOption('EU');
    await expect(form.locator('text=GDPR Consent')).toBeVisible();

    await form.locator('input[type="checkbox"]').first().check(); // GDPR
    await form.locator('input#eu-vatId').fill('DE123456789');

    // Switch away
    await form.locator('select#e-region').selectOption('US');
    await expect(form.locator('text=Zip+4')).toBeVisible();
    await expect(form.locator('text=GDPR Consent')).not.toBeVisible();

    // Switch back
    await form.locator('select#e-region').selectOption('EU');
    await expect(form.locator('input#eu-vatId')).toHaveValue('DE123456789'); // Should persist if state is managed correctly
  });

  test('Array fields add/remove', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');

    // Ensure we are targeting the games section
    const gamesSection = form.locator('h3:has-text("Favorite Games") + div');

    await form.locator('button:has-text("Add Game")').click();

    // Check that a game select appeared in the games section
    await expect(gamesSection.locator('select')).toHaveCount(1);

    await form.locator('button:has-text("Remove")').click();

    // Check that it's gone
    await expect(gamesSection.locator('select')).toHaveCount(0);
  });
});

test.describe('Formsnap POC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/formsnap');
  });

  test('Grid layout check', async ({ page }) => {
    // Check if Field is direct child of grid
    const emailLabel = page.locator('label:has-text("Email")').first();
    const emailInput = page.locator('input[name="email"]').first();

    await expect(emailLabel).toBeVisible();
    await expect(emailInput).toBeVisible();
  });
});

test.describe('Felte POC', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/felte');
  });

  test('Region switching', async ({ page }) => {
    const form = page.locator('form[action="?/editUser"]');
    await form.locator('select#e-region').selectOption('EU');
    await expect(form.locator('text=GDPR Consent')).toBeVisible();
  });
});

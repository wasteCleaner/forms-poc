import { expect, test } from '@playwright/test';

// Common test data
const validLogin = {
  email: 'test@example.com',
  password: 'password123'
};

const validUserBase = {
  email: 'user@example.com',
  displayName: 'Test User',
  locale: 'en-US'
};

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test.describe('Felte Forms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/felte');
  });

  test('should validate login form', async ({ page }) => {
    const form = page.locator('form').filter({ hasText: 'Sign In' });
    await form.getByLabel('Email').fill('invalid-email');
    await form.getByRole('button', { name: 'Sign In' }).click();
    await expect(form.getByText('Invalid email')).toBeVisible();

    await form.getByLabel('Email').fill(validLogin.email);
    await form.getByLabel('Password').fill(validLogin.password);
    await form.getByRole('button', { name: 'Sign In' }).click();
    // Assuming success message or redirect, but for now checking no errors
    await expect(form.getByText('Invalid email')).not.toBeVisible();
  });

  test('should handle discriminated union in Edit User form', async ({ page }) => {
    const form = page.locator('form').filter({ hasText: 'Save Changes' });

    // Fill base fields
    await form.getByLabel('Email').fill(validUserBase.email);
    await form.getByLabel('Display Name').fill(validUserBase.displayName);

    // Test Region Switching
    await form.getByLabel('Region').selectOption('US');
    await expect(form.getByText('Tax Residency Confirmed')).toBeVisible();

    await form.getByLabel('Region').selectOption('EU');
    await expect(form.getByText('GDPR Consent')).toBeVisible();
    await expect(form.getByText('Tax Residency Confirmed')).not.toBeVisible();

    // Submit invalid EU form
    await form.getByRole('button', { name: 'Save Changes' }).click();
    await expect(form.getByText('GDPR consent is required for EU users')).toBeVisible();
  });
});

test.describe('Superforms', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/superforms');
  });

  test('should validate login form', async ({ page }) => {
    const form = page.locator('form').filter({ hasText: 'Sign In' });

    // Client-side validation check
    await form.getByLabel('Email').fill('invalid');
    await form.getByLabel('Password').click(); // trigger blur
    // Superforms usually validates on blur/input if configured
    await expect(form.getByText('Invalid email')).toBeVisible();

    await form.getByLabel('Email').fill(validLogin.email);
    await form.getByLabel('Password').fill(validLogin.password);
    await form.getByRole('button', { name: 'Sign In' }).click();
    await expect(form.getByText('Invalid email')).not.toBeVisible();
  });

   test('should handle discriminated union in Edit User form', async ({ page }) => {
    const form = page.locator('form').filter({ hasText: 'Save Changes' });

    // Fill base fields
    await form.getByLabel('Email').fill(validUserBase.email);
    await form.getByLabel('Display Name').fill(validUserBase.displayName);

    // Test Region Switching
    await form.getByLabel('Region').selectOption('US');
    // Check for US specific field
    await expect(form.getByLabel('State')).toBeVisible();

    await form.getByLabel('Region').selectOption('EU');
    // Check for EU specific field
    await expect(form.getByLabel('GDPR Consent')).toBeVisible();
    await expect(form.getByLabel('State')).not.toBeVisible();
  });
});

test.describe('Formsnap', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/formsnap');
  });

  test('should validate login form', async ({ page }) => {
    const form = page.locator('form').filter({ hasText: 'Sign In' });

    await form.getByLabel('Email').fill('invalid');
    await form.getByLabel('Password').click();
    await expect(form.getByText('Invalid email')).toBeVisible();

    await form.getByLabel('Email').fill(validLogin.email);
    await form.getByLabel('Password').fill(validLogin.password);
    await form.getByRole('button', { name: 'Sign In' }).click();
  });
});

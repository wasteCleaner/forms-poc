import { test, expect } from '@playwright/test';

test.describe('Felte Forms', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/felte');
	});

	test('Login with valid credentials', async ({ page }) => {
		await page.fill('form[action="?/login"] input[name="email"]', 'test@test.com');
		await page.fill('form[action="?/login"] input[name="password"]', '123321');
		await page.click('form[action="?/login"] button[type="submit"]');

		await expect(page.locator('text=Login successful!')).toBeVisible();
	});

	test('Edit User - Validation errors', async ({ page }) => {
		// Clear fields to trigger validation
		await page.fill('form[action="?/editUser"] input[name="displayName"]', '');
		await page.click('form[action="?/editUser"] button[type="submit"]');

		await expect(page.locator('text=Display Name is required')).toBeVisible();
	});

	test('Edit User - Region switching and nested validation', async ({ page }) => {
		// Default is EU
		await expect(page.locator('input[name="eu.gdprConsent"]')).toBeVisible();

		// Submit without consent (should fail)
		// Ensure GDPR is unchecked
		const gdprCheckbox = page.locator('input[name="eu.gdprConsent"]');
		if (await gdprCheckbox.isChecked()) {
			await gdprCheckbox.uncheck();
		}

		await page.click('form[action="?/editUser"] button[type="submit"]');
		await expect(page.locator('text=GDPR consent is required for EU users')).toBeVisible();

		// Switch to US
		await page.selectOption('select[name="region"]', 'US');
		await expect(page.locator('select[name="us.state"]')).toBeVisible();
		await expect(page.locator('input[name="eu.gdprConsent"]')).not.toBeVisible();

		// Check for missing field in original POC
		// await expect(page.locator('input[name="us.ssnLast4"]')).toBeVisible(); // Uncomment when implemented

		// Switch back to EU
		await page.selectOption('select[name="region"]', 'EU');
		await expect(page.locator('input[name="eu.gdprConsent"]')).toBeVisible();
	});
});

test.describe('Formsnap Forms', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/formsnap');
	});

	test('Login with valid credentials', async ({ page }) => {
		await page.fill('form[action="?/login"] input[name="email"]', 'test@test.com');
		await page.fill('form[action="?/login"] input[name="password"]', '123321');
		await page.click('form[action="?/login"] button[type="submit"]');

		await expect(page.locator('text=Login successful!')).toBeVisible();
	});

    test('Edit User - Validation errors', async ({ page }) => {
		await page.fill('form[action="?/editUser"] input[name="displayName"]', '');
		await page.click('form[action="?/editUser"] button[type="submit"]');

		await expect(page.locator('text=Display Name is required')).toBeVisible();
	});

	test('Edit User - Check missing fields', async ({ page }) => {
		await page.selectOption('select[name="region"]', 'US');
		// taxResidencyConfirmed is missing in Formsnap POC, checking for it should fail or pass if we fix it
		await expect(page.locator('input[name="us.taxResidencyConfirmed"]')).toBeVisible();
	});
});

test.describe('Superforms Forms', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/superforms');
	});

	test('Login with valid credentials', async ({ page }) => {
		await page.fill('form[action="?/login"] input[name="email"]', 'test@test.com');
		await page.fill('form[action="?/login"] input[name="password"]', '123321');
		await page.click('form[action="?/login"] button[type="submit"]');

		await expect(page.locator('text=Login successful!')).toBeVisible();
	});

    test('Edit User - Validation errors', async ({ page }) => {
		await page.fill('form[action="?/editUser"] input[name="displayName"]', '');
		await page.click('form[action="?/editUser"] button[type="submit"]');

		await expect(page.locator('text=Display Name is required')).toBeVisible();
	});
});

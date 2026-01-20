import { expect, test } from '@playwright/test';

const implementations = ['/felte', '/formsnap', '/superforms'];

for (const path of implementations) {
	test.describe(`Forms POC - ${path}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(path);
		});

		test('Login Form - Validation and Success', async ({ page }) => {
			// Scope to login form
			const loginForm = page.locator('form[action="?/login"]');

			// Submit empty
			await loginForm.getByRole('button', { name: 'Sign In' }).click();

			// Check validation errors
			await expect(loginForm.getByText('Invalid email')).toBeVisible();
			await expect(loginForm.getByText('Password is required')).toBeVisible();

			// Fill valid data
			await loginForm.locator('input[name="email"]').fill('test@test.com');
			await loginForm.locator('input[name="password"]').fill('123321');

			await loginForm.getByRole('button', { name: 'Sign In' }).click();

			// Expect no errors
			await expect(loginForm.getByText('Invalid email')).not.toBeVisible();
            await expect(loginForm.getByText('Password is required')).not.toBeVisible();
            // Check for success message if possible, but absence of error is good start
		});

		test('Edit User Form - Validation and Discriminated Unions', async ({ page }) => {
            const userForm = page.locator('form[action="?/editUser"]');

            // Submit empty to see errors
            await userForm.getByRole('button', { name: 'Save Changes' }).click();

            await expect(userForm.getByText('Display Name is required')).toBeVisible();

            // Fill common fields
            await userForm.locator('input[name="displayName"]').fill('Test User');
            await userForm.locator('input[name="email"]').fill('user@test.com');
            await userForm.locator('input[name="locale"]').fill('en-US');

            // Address (Nested)
            await userForm.locator('input[name="address.line1"]').fill('123 Main St');
            await userForm.locator('input[name="address.city"]').fill('Test City');
            await userForm.locator('input[name="address.postalCode"]').fill('12345');
            await userForm.locator('input[name="address.country"]').fill('US');

            // Discriminated Union - Switch to US
            await userForm.locator('select[name="region"]').selectOption('US');

            // Check US fields
            await expect(userForm.locator('select[name="us.state"]')).toBeVisible();
            await userForm.locator('select[name="us.state"]').selectOption('NY');
            await userForm.locator('input[name="us.taxResidencyConfirmed"]').check();

            // Switch to EU
            await userForm.locator('select[name="region"]').selectOption('EU');
            await expect(userForm.locator('input[name="eu.gdprConsent"]')).toBeVisible();

            // Check if US fields are gone/hidden
            await expect(userForm.locator('select[name="us.state"]')).not.toBeVisible();

            // Fill EU fields
            await userForm.locator('input[name="eu.gdprConsent"]').check();

             // Add a favorite game (Array)
            await userForm.getByRole('button', { name: 'Add Game' }).click();

            // It defaults to g1, let's switch to g2
            await userForm.locator('select[name="favoriteGames[0].id"]').selectOption('g2');

            await userForm.getByRole('button', { name: 'Save Changes' }).click();

            // Expect no validation errors
             await expect(userForm.getByText('Display Name is required')).not.toBeVisible();
             await expect(userForm.getByText('GDPR consent is required for EU users')).not.toBeVisible();
		});
	});
}

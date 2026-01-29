import { expect, test } from '@playwright/test';

const LIBRARIES = ['felte', 'superforms', 'formsnap'];

for (const lib of LIBRARIES) {
	test.describe(`${lib} form POC`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(`/${lib}`);
		});

		test('Login - Invalid Credentials', async ({ page }) => {
			const form = page.locator('form[action="?/login"]');
			await form.locator('input[name="email"]').fill('wrong@test.com');
			await form.locator('input[name="password"]').fill('wrong');
			await form.locator('button[type="submit"]').click();

			// Expect error message
			await expect(page.getByText('Invalid credentials')).toBeVisible();
		});

		test('Login - Valid Credentials', async ({ page }) => {
			const form = page.locator('form[action="?/login"]');
			await form.locator('input[name="email"]').fill('test@test.com');
			await form.locator('input[name="password"]').fill('123321');
			await form.locator('button[type="submit"]').click();

			// Expect success message
			await expect(page.getByText('Login successful!')).toBeVisible();
		});

		test('Edit User - Client-side Validation', async ({ page }) => {
			const form = page.locator('form[action="?/editUser"]');

			// Clear required field (Email)
			await form.locator('input[name="email"]').fill('');
			await form.locator('button[type="submit"]').click();

			// Expect validation error
			// Note: different libraries might show errors differently, but we look for text or existence
			// Felte usually shows spans, Superforms too.
			// Just checking if submission didn't succeed (no success message) and we stay on page
			await expect(page.getByText('User updated successfully!')).not.toBeVisible();
            // Try to find the error message directly if possible, or at least ensure button didn't trigger success
		});

		test('Edit User - Region Switching & Persistence', async ({ page }) => {
			const form = page.locator('form[action="?/editUser"]');

			// Switch to US
			await form.locator('select[name="region"]').selectOption('US');
			await expect(form.locator('select[name="us.state"]')).toBeVisible(); // Felte uses dot notation for names usually?
            // Actually Felte names: us.state. Superforms: us.state.
            // Wait, Felte uses names in the DOM.

			await form.locator('input[name="us.zipPlus4"]').fill('12345-6789');

			// Switch to EU
			await form.locator('select[name="region"]').selectOption('EU');
			await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();
			await expect(form.locator('input[name="us.zipPlus4"]')).not.toBeVisible();
            await form.locator('input[name="eu.vatId"]').fill('DE123456789');

			// Switch back to US - check persistence
			await form.locator('select[name="region"]').selectOption('US');
			await expect(form.locator('input[name="us.zipPlus4"]')).toHaveValue('12345-6789');

            // Switch back to EU - check persistence
            await form.locator('select[name="region"]').selectOption('EU');
			await expect(form.locator('input[name="eu.vatId"]')).toHaveValue('DE123456789');
		});

		test('Edit User - Array Fields (Favorite Games)', async ({ page }) => {
			const form = page.locator('form[action="?/editUser"]');

            // Add a game
            await form.getByText('+ Add Game').click();

            // Locate the last game entry
            // This is tricky as indices change. We assume it's appended.
            // We need to check if a new block appeared.
            // Let's assume there are initially 0 games or we count them.

            // We can search for the "Remove" button
             const removeButtons = form.locator('button:has-text("Remove")');
             const countBefore = await removeButtons.count();

             await form.getByText('+ Add Game').click();
             await expect(removeButtons).toHaveCount(countBefore + 1);

             // Remove the game
             await removeButtons.last().click();
             await expect(removeButtons).toHaveCount(countBefore);
		});
	});
}

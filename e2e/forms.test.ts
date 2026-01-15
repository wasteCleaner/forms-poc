import { expect, test } from '@playwright/test';

const ROUTES = ['/felte', '/formsnap', '/superforms'];

for (const route of ROUTES) {
	test.describe(`${route} implementation`, () => {
		test('Login form validation and submission', async ({ page }) => {
			await page.goto(route);

			// Submit empty form
			await page.locator('form[action="?/login"] button[type="submit"]').click();

			// Check for validation errors
			await expect(page.locator('text=Invalid email').or(page.locator('text=String must contain at least 1 character(s)'))).toBeVisible();

			// Fill valid data
			await page.locator('form[action="?/login"] input[name="email"]').fill('test@test.com');
			await page.locator('form[action="?/login"] input[name="password"]').fill('123321');
			await page.locator('form[action="?/login"] button[type="submit"]').click();

			// Check success
			await expect(page.locator('text=Login successful')).toBeVisible();
		});

		test('Edit User form validation and interactions', async ({ page }) => {
			await page.goto(route);

            // Scope to the edit form to avoid ambiguity
            const form = page.locator('form[action="?/editUser"]');

			// Check validation
			await form.locator('button[type="submit"]').click();
			await expect(form.locator('text=Display Name is required')).toBeVisible();

			// Discriminated Union: Region switching
			// Default is usually EU (or whatever is first/default)
            // Let's select US
			await form.locator('select[name="region"]').selectOption('US');

            // Wait for UI update
			await expect(form.locator('select[name="us.state"]')).toBeVisible();
            await expect(form.locator('input[name="eu.vatId"]')).not.toBeVisible();

			// Select UK
			await form.locator('select[name="region"]').selectOption('UK');
			await expect(form.locator('input[name="uk.postcode"]')).toBeVisible();
            await expect(form.locator('select[name="us.state"]')).not.toBeVisible();

			// Array fields: Favorite Games
			const addGameBtn = form.locator('button:has-text("Add Game")');
            // Depending on initial state, there might be 0 or more games.
            // Let's count current games
            const initialGames = await form.locator('select[name*="favoriteGames"]').count();

			await addGameBtn.click();
            await expect(form.locator('select[name*="favoriteGames"]')).toHaveCount(initialGames + 1);

            // Remove a game (if any exist)
            if (initialGames + 1 > 0) {
                 await form.locator('button:has-text("Remove")').first().click();
                 await expect(form.locator('select[name*="favoriteGames"]')).toHaveCount(initialGames);
            }
		});
	});
}

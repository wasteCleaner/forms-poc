import { expect, test } from '@playwright/test';

const routes = ['/felte', '/superforms', '/formsnap'];

for (const route of routes) {
	test.describe(`Forms POC - ${route}`, () => {
		test.beforeEach(async ({ page }) => {
			await page.goto(route);
		});

		test('Login form submission', async ({ page }) => {
			// Check if login form exists
			await expect(page.locator('form[action="?/login"]')).toBeVisible();

			// Fill in credentials
			await page.fill('form[action="?/login"] input[name="email"]', 'test@test.com');
			await page.fill('form[action="?/login"] input[name="password"]', '123321');

			// Submit
			await page.click('form[action="?/login"] button[type="submit"]');

			// Check for success message
			await expect(page.locator('text=Login successful!')).toBeVisible();
		});

		test('Edit User form - Region switching and validation', async ({ page }) => {
			const formSelector = 'form[action="?/editUser"]';

			// Initially EU
			await expect(page.locator(`${formSelector} select[name="region"]`)).toHaveValue('EU');
			await expect(page.locator(`${formSelector} input[name="eu.gdprConsent"]`)).toBeVisible();

			// Try to submit without checking GDPR
			await page.click(`${formSelector} button[type="submit"]`);

			// Should show error for GDPR
			// Felte bug: might show null or not show at all if not mapped correctly
			// We expect it to be visible if fixed
			const gdprError = page.locator('text=GDPR consent is required for EU users');
			// If it's the bug, this might fail or timeout.
            // For now, let's assert it should be visible, so the test fails if bug exists.
			await expect(gdprError).toBeVisible();

			// Switch to US
			await page.selectOption(`${formSelector} select[name="region"]`, 'US');
			await expect(page.locator(`${formSelector} input[name="eu.gdprConsent"]`)).not.toBeVisible();
			await expect(page.locator(`${formSelector} select[name="us.state"]`)).toBeVisible();

			// Switch back to EU
			await page.selectOption(`${formSelector} select[name="region"]`, 'EU');
			await expect(page.locator(`${formSelector} input[name="eu.gdprConsent"]`)).toBeVisible();
            // Verify state is reset or maintained as expected (memory says manual state persistence needed)
            // But usually switching regions resets fields in the provided code.
		});

        test('Favorite Games - Array manipulation', async ({ page }) => {
            const formSelector = 'form[action="?/editUser"]';

            // Add a game
            await page.click(`${formSelector} button:has-text("+ Add Game")`);

            // Should see a game entry
            await expect(page.locator(`${formSelector} select[name^="favoriteGames"]`)).toHaveCount(1);

            // Add another game
            await page.click(`${formSelector} button:has-text("+ Add Game")`);
            await expect(page.locator(`${formSelector} select[name^="favoriteGames"]`)).toHaveCount(2);

            // Remove first game
            await page.click(`${formSelector} button:has-text("Remove") >> nth=0`);
            await expect(page.locator(`${formSelector} select[name^="favoriteGames"]`)).toHaveCount(1);
        });
	});
}

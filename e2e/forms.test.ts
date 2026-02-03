import { expect, test } from '@playwright/test';

test.describe('Forms POC', () => {
	test.describe('Login Page', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/login');
		});

		test('Superforms Login', async ({ page }) => {
			const container = page.locator('.grid > div').first();
            const form = container.locator('form');

			await form.locator('input[name="email"]').fill('test@test.com');
			await form.locator('input[name="password"]').fill('123321');

			await form.locator('button[type="submit"]').click();

            await expect(container.getByText('Login successful')).toBeVisible();
		});

		test('Felte Login', async ({ page }) => {
			const container = page.locator('.grid > div').last();
            const form = container.locator('form');

			await form.locator('input[name="email"]').fill('test@test.com');
			await form.locator('input[name="password"]').fill('123321');

			await form.locator('button[type="submit"]').click();

            await expect(container.getByText('Login successful')).toBeVisible();
		});
	});

	test.describe('Profile Page', () => {
		test.beforeEach(async ({ page }) => {
			await page.goto('/profile');
		});

		test('Superforms Profile', async ({ page }) => {
			const container = page.locator('.grid > div').first();
            const form = container.locator('form');

			await form.locator('input[name="age"]').fill('30');

            // Add a skill
            await form.getByRole('button', { name: 'Add Skill' }).click();
            // Modal is global
            const modal = page.locator('.fixed');
            await modal.locator('input').first().fill('Playwright');
            await modal.locator('select').selectOption('expert');
            await modal.getByRole('button', { name: 'Save' }).click();

            // Verify skill added to list
            await expect(form.getByText('Playwright')).toBeVisible();

			await form.locator('button[type="submit"]').click();

            await expect(container.getByText('Profile saved')).toBeVisible();
		});

		test('Felte Profile', async ({ page }) => {
			const container = page.locator('.grid > div').last();
            const form = container.locator('form');

			await form.locator('input[name="age"]').fill('30');

            // Add a skill
            await form.getByRole('button', { name: 'Add Skill' }).click();
            const modal = page.locator('.fixed');

            await modal.locator('input').first().fill('Playwright');
            await modal.locator('select').selectOption('expert');
            await modal.getByRole('button', { name: 'Save' }).click();

             // Verify skill added to list
            await expect(form.getByText('Playwright')).toBeVisible();

			await form.locator('button[type="submit"]').click();

            await expect(container.getByText('Profile saved')).toBeVisible();
		});
	});
});

import { test, expect } from '@playwright/test';

test.describe('Forms POC', () => {
	const validUser = {
		email: 'test@test.com',
		password: 'password123'
	};

	test.describe('Login', () => {
		test('Superforms Login should submit successfully', async ({ page }) => {
			await page.goto('/login');
			await page.fill('#sf-email', validUser.email);
			await page.fill('#sf-password', validUser.password);
			await page.click('form[action="?/superforms"] button[type="submit"]');

			await expect(page.locator('text=Invalid email')).not.toBeVisible();
			await expect(page.locator('text=Min 8 characters')).not.toBeVisible();
		});

		test('Felte Login should submit successfully', async ({ page }) => {
			await page.goto('/login');
			await page.fill('#felte-email', validUser.email);
			await page.fill('#felte-password', validUser.password);
			await page.click('form[action="?/felte"] button[type="submit"]');

			await expect(page.locator('text=Invalid email')).not.toBeVisible();
			await expect(page.locator('text=Min 8 characters')).not.toBeVisible();
		});

		test('Superforms Login validation', async ({ page }) => {
			await page.goto('/login');
			await page.fill('#sf-email', 'invalid-email');
			await page.fill('#sf-password', 'short');
			await page.click('form[action="?/superforms"] button[type="submit"]');

			await expect(page.locator('text=Invalid email')).toBeVisible();
			await expect(page.locator('text=Min 8 characters')).toBeVisible();
		});
	});

	test.describe('Profile', () => {
		test('Superforms Profile should add and save skills', async ({ page }) => {
			await page.goto('/profile');
			const container = page.getByTestId('superforms-container');

			// Fill basic info
			await container.locator('#sf-gender').selectOption('male');
			await container.locator('#sf-age').fill('30');

			// Add skill
			await container.getByText('Add Skill').click();

			// Modal interaction (scoped to container because modal is inside component)
			await container.locator('#skill-name').fill('Svelte');
			await container.locator('#skill-level').selectOption('expert');
			await container.getByRole('button', { name: 'Save', exact: true }).click();

			// Check skill is in list
			await expect(container.getByText('Svelte')).toBeVisible();
			await expect(container.getByText('(expert)')).toBeVisible();

			// Submit form
			await container.getByRole('button', { name: 'Save Profile' }).click();

			await expect(container.locator('p.text-destructive')).not.toBeVisible();
		});

		test('Felte Profile should add and save skills', async ({ page }) => {
			await page.goto('/profile');
			const container = page.getByTestId('felte-container');

			// Fill basic info
			await container.locator('#felte-gender').selectOption('female');
			await container.locator('#felte-age').fill('25');

			// Add skill
			await container.getByText('Add Skill').click();

			// Modal interaction
			await container.locator('#felte-skill-name').fill('Rust');
			await container.locator('#felte-skill-level').selectOption('expert');
			await container.getByRole('button', { name: 'Save', exact: true }).click();

			// Check skill is in list
			await expect(container.getByText('Rust')).toBeVisible();
			await expect(container.getByText('(expert)')).toBeVisible();

			// Submit form
			await container.getByRole('button', { name: 'Save Profile' }).click();

			await expect(container.locator('p.text-destructive')).not.toBeVisible();
		});
	});
});

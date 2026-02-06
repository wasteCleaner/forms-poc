import { test, expect } from '@playwright/test';

test.describe('Forms POC', () => {
	test('Login - Superforms', async ({ page }) => {
		await page.goto('/login');
		const section = page.locator('.grid > div').first();
		const button = section.getByRole('button', { name: 'Login' });

		// Error state
		await page.locator('#sf-email').fill('invalid');
		await page.locator('#sf-password').fill('short');
		await button.click();
		await expect(section.getByText('Invalid email')).toBeVisible();
		await expect(section.getByText('Min 8 characters')).toBeVisible();

		// Success state
		await page.locator('#sf-email').fill('test@test.com');
		await page.locator('#sf-password').fill('123321');
		await button.click();
		await expect(section.getByText('Invalid email')).not.toBeVisible();
	});

	test('Login - Felte', async ({ page }) => {
		await page.goto('/login');
		const section = page.locator('.grid > div').last();
		const button = section.getByRole('button', { name: 'Login' });

		// Error state
		await page.locator('#felte-email').fill('invalid');
		await page.locator('#felte-password').fill('short');
		await button.click();
		await expect(section.getByText('Invalid email')).toBeVisible();
		await expect(section.getByText('Min 8 characters')).toBeVisible();

		// Success state
		await page.locator('#felte-email').fill('test@test.com');
		await page.locator('#felte-password').fill('123321');
		await button.click();
		await expect(section.getByText('Invalid email')).not.toBeVisible();
	});

	test('Profile - Superforms', async ({ page }) => {
		await page.goto('/profile');
		const section = page.locator('.grid > div').first();
		const saveButton = section.getByRole('button', { name: 'Save Profile' });

		// Add Skill
		await section.getByRole('button', { name: 'Add Skill' }).click();
		await page.locator('#skill-name').fill('Svelte');
		await page.locator('#skill-level').selectOption('expert');
		await page.getByRole('button', { name: 'Save', exact: true }).click();

		await expect(section.getByText('Svelte')).toBeVisible();
		await expect(section.getByText('(expert)')).toBeVisible();

		// Submit
		await saveButton.click();
		await expect(section.getByText('Required')).not.toBeVisible();
	});

	test('Profile - Felte', async ({ page }) => {
		await page.goto('/profile');
		const section = page.locator('.grid > div').last();
		const saveButton = section.getByRole('button', { name: 'Save Profile' });

		// Add Skill
		await section.getByRole('button', { name: 'Add Skill' }).click();
		await page.locator('#felte-skill-name').fill('Rust');
		await page.locator('#felte-skill-level').selectOption('beginner');
		await page.getByRole('button', { name: 'Save', exact: true }).click();

		await expect(section.getByText('Rust')).toBeVisible();
		await expect(section.getByText('(beginner)')).toBeVisible();

		// Submit
		await saveButton.click();
		await expect(section.getByText('Required')).not.toBeVisible();
	});
});

import { test, expect } from '@playwright/test';

test.describe('Forms POC', () => {
	test('Login - Superforms', async ({ page }) => {
		await page.goto('/login');
		const form = page.locator('form[action="?/superforms"]');

		// Submit empty to see errors
		await form.locator('button[type="submit"]').click();
		await expect(form.locator('text=Invalid email')).toBeVisible();
		await expect(form.locator('text=Min 8 characters')).toBeVisible();

		// Fill valid
		await form.locator('input[name="email"]').fill('test@test.com');
		await form.locator('input[name="password"]').fill('123321123'); // > 8 chars
		await form.locator('button[type="submit"]').click();

		// Expect no errors (and maybe success state if we could check it, but absence of errors is a good start)
		await expect(form.locator('text=Invalid email')).not.toBeVisible();
		await expect(form.locator('text=Min 8 characters')).not.toBeVisible();
	});

	test('Login - Felte', async ({ page }) => {
		await page.goto('/login');
		const form = page.locator('form').filter({ has: page.locator('#felte-email') });

		// Submit empty
		await form.locator('button[type="submit"]').click();
		await expect(form.locator('text=Invalid email')).toBeVisible();
		await expect(form.locator('text=Min 8 characters')).toBeVisible();

		// Fill valid
		await form.locator('#felte-email').fill('test@test.com');
		await form.locator('#felte-password').fill('123321123');
		await form.locator('button[type="submit"]').click();

		// Expect no errors
		await expect(form.locator('text=Invalid email')).not.toBeVisible();
	});

	test('Profile - Superforms', async ({ page }) => {
		await page.goto('/profile');
		const form = page.locator('form[action="?/superforms"]');

		// Add skill
		await form.locator('button:has-text("Add Skill")').click();
		await page.locator('input#skill-name').fill('New Skill');
		await page.getByRole('button', { name: 'Save', exact: true }).click();

		await expect(form.locator('text=New Skill')).toBeVisible();

		// Remove skill
		await form.locator('li').filter({ hasText: 'New Skill' }).locator('button:has-text("Remove")').click();
		await expect(form.locator('text=New Skill')).not.toBeVisible();
	});

	test('Profile - Felte', async ({ page }) => {
		await page.goto('/profile');
		const form = page.locator('form').filter({ has: page.locator('#felte-gender') });

		// Add skill
		await form.locator('button:has-text("Add Skill")').click();
		await page.locator('#felte-skill-name').fill('Felte Skill');
		await page.getByRole('button', { name: 'Save', exact: true }).click();

		await expect(form.locator('text=Felte Skill')).toBeVisible();

		// Remove skill
		await form.locator('li').filter({ hasText: 'Felte Skill' }).locator('button:has-text("Remove")').click();
		await expect(form.locator('text=Felte Skill')).not.toBeVisible();
	});
});

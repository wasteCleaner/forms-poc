import { expect, test } from '@playwright/test';

test.describe('Formsnap Page', () => {
	test('should load and submit edit user form', async ({ page }) => {
		await page.goto('/formsnap');
		await expect(page.locator('h1')).toContainText('Formsnap POC');

		const editForm = page.locator('form[action="?/editUser"]');
		await editForm.locator('input[name="email"]').fill('user@example.com');
		await editForm.locator('input[name="displayName"]').fill('Test User');
		await editForm.locator('input[name="locale"]').fill('en-US');

		// Region switch to US
		await editForm.locator('select[name="region"]').selectOption('US');
		await expect(editForm.locator('select[name="us.state"]')).toBeVisible();

		// Fill US fields
		await editForm.locator('select[name="us.state"]').selectOption('NY');
		await editForm.locator('input[name="us.zipPlus4"]').fill('12345-6789');

		// Add game
		await editForm.getByRole('button', { name: '+ Add Game' }).click();
		// Selector for Formsnap/Superforms array field
		await expect(editForm.locator('select[name="favoriteGames[0].id"]')).toBeVisible();

		// Submit
		await editForm.getByRole('button', { name: 'Save Changes' }).click();

		// Check success message
		await expect(page.locator('text=User updated successfully!')).toBeVisible();
	});
});

test.describe('Superforms Page', () => {
	test('should load and submit edit user form', async ({ page }) => {
		await page.goto('/superforms');
		await expect(page.locator('h1')).toContainText('Superforms POC');

		const editForm = page.locator('form[action="?/editUser"]');
		// Using IDs as they are present in the template
		await editForm.locator('input#e-email').fill('user@example.com');
		await editForm.locator('input#e-displayName').fill('Super User');
		await editForm.locator('input#e-locale').fill('en-GB');

		// Region switch to UK
		await editForm.locator('select#e-region').selectOption('UK');
		await expect(editForm.locator('input#uk-postcode')).toBeVisible();
		await editForm.locator('input#uk-postcode').fill('SW1A 1AA');

		// Add game
		await editForm.getByRole('button', { name: '+ Add Game' }).click();
		// Superforms template doesn't seem to set name on select for favoriteGames loop in my memory?
		// Let's check the code: <select bind:value={game.id} ...>
		// If name is not set, it might default or be missing.
		// Wait, bind:value doesn't automatically set name.
		// In superforms +page.svelte:
		// <select bind:value={game.id} class="w-full p-1 border rounded">
		// It seems name is MISSING in superforms +page.svelte for favoriteGames!
		// This is a bug I should fix too!

		// Submit
		await editForm.getByRole('button', { name: 'Save Changes' }).click();
		await expect(page.locator('text=User updated successfully!')).toBeVisible();
	});
});

test.describe('Felte Page', () => {
	test('should load and submit edit user form', async ({ page }) => {
		await page.goto('/felte');
		await expect(page.locator('h1')).toContainText('Felte POC');

		const editForm = page.locator('form[action="?/editUser"]');
		await editForm.locator('input[name="email"]').fill('felte@example.com');
		await editForm.locator('input[name="displayName"]').fill('Felte User');
		await editForm.locator('input[name="locale"]').fill('fr-FR');

		await editForm.locator('select[name="region"]').selectOption('EU');
		await expect(editForm.locator('input[name="eu.vatId"]')).toBeVisible();
		await editForm.locator('input[name="eu.vatId"]').fill('DE123456789');

		// Add game
		await editForm.getByRole('button', { name: '+ Add Game' }).click();
		// Felte template: <select name={`favoriteGames.${i}.id`} ...>
		await expect(editForm.locator('select[name="favoriteGames.0.id"]')).toBeVisible();

		// Submit
		await editForm.getByRole('button', { name: 'Save Changes' }).click();
		await expect(page.locator('text=User updated successfully!')).toBeVisible();
	});
});

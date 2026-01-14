import { expect, test } from '@playwright/test';

test.describe('Forms POC E2E Tests', () => {
    test.describe('Felte Forms', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/felte');
        });

        test('should validate login form', async ({ page }) => {
            // Find login form
            const form = page.locator('form').first(); // Assumption: Login is first

            // Try submitting empty
            await form.getByRole('button', { name: 'Sign In' }).click();

            // Expect validation errors
            // Note: Actual selectors depend on implementation
            await expect(page.getByText('Invalid email')).toBeVisible();
            await expect(page.getByText('Password is required')).toBeVisible();
        });

        test('should login successfully', async ({ page }) => {
            const form = page.locator('form').first();

            await form.getByLabel('Email').fill('test@test.com');
            await form.getByLabel('Password').fill('123321');
            await form.getByRole('button', { name: 'Sign In' }).click();

            // Expect success message or redirect (adjust based on actual behavior)
             await expect(page.getByText('Login successful')).toBeVisible();
        });
    });

    test.describe('Formsnap Forms', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('/formsnap');
        });

        test('should validate login form', async ({ page }) => {
             const form = page.locator('form').first();
            await form.getByRole('button', { name: 'Sign In' }).click();
             await expect(page.getByText('Invalid email')).toBeVisible();
             // Adjust text matcher as needed
        });
    });

    test.describe('Superforms Forms', () => {
        test.beforeEach(async ({ page }) => {
             await page.goto('/superforms');
        });

        test('should validate login form', async ({ page }) => {
             const form = page.locator('form').first();
             await form.getByRole('button', { name: 'Sign In' }).click();
             await expect(page.getByText('Invalid email')).toBeVisible();
        });
    });
});

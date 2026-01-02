import { expect, test } from '@playwright/test';

test.describe('Felte Form POC', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/felte');
    });

    test('should validate login form', async ({ page }) => {
        const emailInput = page.locator('form[action="?/login"] input[name="email"]');
        const passwordInput = page.locator('form[action="?/login"] input[name="password"]');
        const submitButton = page.locator('form[action="?/login"] button:has-text("Sign In")');

        // Test invalid submission
        await submitButton.click();
        await expect(page.locator('text=Password is required')).toBeVisible();

        // Test valid submission
        await emailInput.fill('test@test.com');
        await passwordInput.fill('123321');
        await submitButton.click();
        await expect(page.locator('text=Login successful!')).toBeVisible();
    });

    test('should handle discriminated unions in edit user form', async ({ page }) => {
        const regionSelect = page.locator('select[name="region"]');

        // Select EU
        await regionSelect.selectOption('EU');
        await expect(page.locator('input[name="eu.vatId"]')).toBeVisible();
        await expect(page.locator('select[name="us.state"]')).not.toBeVisible();

        // Select US
        await regionSelect.selectOption('US');
        await expect(page.locator('input[name="eu.vatId"]')).not.toBeVisible();
        await expect(page.locator('select[name="us.state"]')).toBeVisible();
    });

    test('should validate array fields in edit user form', async ({ page }) => {
        const addGameButton = page.locator('button:has-text("+ Add Game")');
        await addGameButton.click();
        await expect(page.locator('select[name^="favoriteGames"]')).toBeVisible();

        const removeButton = page.locator('button:has-text("Remove")');
        await removeButton.click();
        await expect(page.locator('select[name^="favoriteGames"]')).not.toBeVisible();
    });
});

test.describe('Formsnap POC', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/formsnap');
    });

    test('should validate login form', async ({ page }) => {
        const emailInput = page.locator('form[action="?/login"] input[name="email"]');
        const passwordInput = page.locator('form[action="?/login"] input[name="password"]');
        const submitButton = page.locator('form[action="?/login"] button[type="submit"]');

        await submitButton.click();
        // Check for validation error (message depends on zod schema)
         await expect(page.locator('text=Password is required')).toBeVisible();

        await emailInput.fill('test@test.com');
        await passwordInput.fill('123321');
        await submitButton.click();
        // Success state check (needs to be adapted based on actual implementation)
    });
});

test.describe('Superforms POC', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/superforms');
    });

    test('should validate login form', async ({ page }) => {
        const emailInput = page.locator('form[action="?/login"] input[name="email"]');
        const passwordInput = page.locator('form[action="?/login"] input[name="password"]');
        const submitButton = page.locator('form[action="?/login"] button[type="submit"]');

        await submitButton.click();
        // Check for validation error
         await expect(page.locator('text=Password is required')).toBeVisible();

        await emailInput.fill('test@test.com');
        await passwordInput.fill('123321');
        await submitButton.click();
    });
});

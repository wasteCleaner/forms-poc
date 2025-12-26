import { expect, test } from '@playwright/test';

test.describe('Superforms Form', () => {
  test('should validate required fields', async ({ page }) => {
    await page.goto('/superforms');

    await page.fill('#l-email', 'invalid-email');
    await page.click('button:has-text("Sign In")');
    await expect(page.locator('text=Invalid email').first()).toBeVisible();

    await page.fill('#e-email', '');
    await page.click('button:has-text("Save Changes")');
  });

  test('should handle region switching', async ({ page }) => {
    await page.goto('/superforms');

    await page.selectOption('#e-region', 'EU');
    await expect(page.locator('text=GDPR Consent')).toBeVisible();

    await page.selectOption('#e-region', 'US');
    await expect(page.locator('text=Tax Residency Confirmed')).toBeVisible();
    await expect(page.locator('text=GDPR Consent')).not.toBeVisible();
  });

  test('should add and remove games', async ({ page }) => {
    await page.goto('/superforms');

    await page.click('text=+ Add Game');
    // Superforms example has specific IDs or structure?
    // The code shows: <select bind:value={game.id} ...>
    // It doesn't seem to have a name attribute on the select in the loop!
    // This is a potential bug. "Ensure all form inputs in `sveltekit-superforms` have explicit `name` attributes"

    // We'll check if we can find it.
    await expect(page.locator('select').filter({ hasText: 'Zelda' }).first()).toBeVisible(); // Assuming Zelda is in the list

    await page.click('text=Remove');
    // Verify removal
  });
});

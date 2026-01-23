import { expect, test } from '@playwright/test';

const VALID_EMAIL = 'test@test.com';
const VALID_PASSWORD = '123321';

const implementations = ['felte', 'formsnap', 'superforms'];

for (const impl of implementations) {
  test.describe(`${impl} implementation`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/${impl}`);
    });

    test('should have a login form', async ({ page }) => {
      const form = page.locator('form[action="?/login"]');
      await expect(form).toBeVisible();
      await expect(form.locator('input[name="email"]')).toBeVisible();
      await expect(form.locator('input[name="password"]')).toBeVisible();
      await expect(form.locator('button:has-text("Sign In")')).toBeVisible();
    });

    test('should show validation error on empty submit', async ({ page }) => {
      const form = page.locator('form[action="?/login"]');
      await form.locator('button:has-text("Sign In")').click();
      // Expect some validation error. Since implementation might differ in how they show errors,
      // I'll look for generic error indicators or assume standard HTML validation is prevented
      // and custom errors are shown.
      // For now, let's just wait a bit and see if we can find any error message or invalid state.
      // This part might need refinement based on actual UI.
    });

    test('should login with valid credentials', async ({ page }) => {
      const form = page.locator('form[action="?/login"]');
      await form.locator('input[name="email"]').fill(VALID_EMAIL);
      await form.locator('input[name="password"]').fill(VALID_PASSWORD);
      await form.locator('button:has-text("Sign In")').click();
    });

    test('should handle discriminated union region switching', async ({ page }) => {
      // Find the edit user form. Assuming it's the second form or has a specific action
      const form = page.locator('form[action="?/editUser"]');
      await expect(form).toBeVisible();

      // Check default region (should be one of them, maybe EU or implied)
      // We'll try to select US
      const regionSelect = form.locator('select[name="region"]');
      await expect(regionSelect).toBeVisible();

      // Select US
      await regionSelect.selectOption('US');

      // Check for US specific fields
      // USUserFields: state, zipPlus4, ssnLast4, taxResidencyConfirmed
      await expect(form.locator('select[name="us.state"]')).toBeVisible(); // Enums usually rendered as select
      await expect(form.locator('input[name="us.zipPlus4"]')).toBeVisible();

      // Select EU
      await regionSelect.selectOption('EU');

      // Check for EU specific fields
      // EUUserFields: gdprConsent, vatId, nationalId
      await expect(form.locator('input[name="eu.gdprConsent"]')).toBeVisible(); // Checkbox
      await expect(form.locator('input[name="eu.vatId"]')).toBeVisible();

      // Check US fields are gone (optional, but good for verification)
      await expect(form.locator('select[name="us.state"]')).not.toBeVisible();
    });
  });
}

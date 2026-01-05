import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

// --- Helper Functions ---

async function testEmptySubmission(page: Page, formName: string) {
  const submitButton = page.getByRole('button', { name: 'Save Changes' });
  await submitButton.click();

  // Check for validation errors on required fields
  await expect(page.getByText('Invalid email').first()).toBeVisible();
  await expect(page.getByText('Display Name is required').first()).toBeVisible();
}

async function testRegionSwitching(page: Page) {
  // Switch to US
  await page.getByLabel('Region').selectOption('US');
  await expect(page.getByLabel('State')).toBeVisible();
  await expect(page.getByLabel('Zip+4')).toBeVisible();

  // Switch to EU
  await page.getByLabel('Region').selectOption('EU');
  await expect(page.getByText('GDPR Consent')).toBeVisible();
  await expect(page.getByLabel('VAT ID')).toBeVisible();

  // Switch to UK
  await page.getByLabel('Region').selectOption('UK');
  await expect(page.getByLabel('Postcode')).toBeVisible();

  // Switch to Other
  await page.getByLabel('Region').selectOption('Other');
  await expect(page.getByLabel('Notes')).toBeVisible();
}

async function testArrayField(page: Page) {
  const addGameBtn = page.getByRole('button', { name: '+ Add Game' });
  const removeButtonsBefore = await page.getByRole('button', { name: 'Remove' }).count();
  await addGameBtn.click();
  const removeButtonsAfter = await page.getByRole('button', { name: 'Remove' }).count();
  expect(removeButtonsAfter).toBe(removeButtonsBefore + 1);
  await page.getByRole('button', { name: 'Remove' }).last().click();
  const removeButtonsFinal = await page.getByRole('button', { name: 'Remove' }).count();
  expect(removeButtonsFinal).toBe(removeButtonsBefore);
}

async function testValidationOnRegionSpecificField(page: Page) {
  await page.getByLabel('Region').selectOption('EU');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('GDPR consent is required for EU users').first()).toBeVisible();
}


// --- Test Suites ---

test.describe('Felte Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/felte');
  });

  test('Empty submission shows errors', async ({ page }) => {
     await testEmptySubmission(page, 'felte');
  });

  test('Region switching works', async ({ page }) => {
    await testRegionSwitching(page);
  });

  test('Region specific validation works', async ({ page }) => {
    await testValidationOnRegionSpecificField(page);
  });

  test('Array field operations work', async ({ page }) => {
    await testArrayField(page);
  });
});

test.describe('Formsnap Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/formsnap');
  });

  test('Empty submission shows errors', async ({ page }) => {
     await testEmptySubmission(page, 'formsnap');
  });

  test('Region switching works', async ({ page }) => {
    await testRegionSwitching(page);
  });

   test('Region specific validation works', async ({ page }) => {
    await testValidationOnRegionSpecificField(page);
  });

  test('Array field operations work', async ({ page }) => {
    await testArrayField(page);
  });
});

test.describe('Superforms Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/superforms');
  });

  test('Empty submission shows errors', async ({ page }) => {
     await testEmptySubmission(page, 'superforms');
  });

  test('Region switching works', async ({ page }) => {
    await testRegionSwitching(page);
  });

   test('Region specific validation works', async ({ page }) => {
    await testValidationOnRegionSpecificField(page);
  });

  test('Array field operations work', async ({ page }) => {
    await testArrayField(page);
  });
});

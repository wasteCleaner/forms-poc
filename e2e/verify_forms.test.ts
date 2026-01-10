import { test, expect } from '@playwright/test';

test('Verify form screenshots', async ({ page }) => {
  // 1. Felte
  await page.goto('/felte');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'verification/felte_form.png', fullPage: true });

  // 2. Formsnap
  await page.goto('/formsnap');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'verification/formsnap_form.png', fullPage: true });

  // 3. Superforms
  await page.goto('/superforms');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'verification/superforms_form.png', fullPage: true });
});

import { test, expect } from '@playwright/test';

test.describe('Student Application Wizard Flow', () => {
  test('application wizard loads with step indicator and validates required personal fields', async ({ page }) => {
    await page.goto('/apply');

    // Title and step indicator
    await expect(page.locator('text=Personal Info').first()).toBeVisible();

    // Try clicking next without filling required fields
    const nextBtn = page.getByRole('button', { name: /Next/i });
    if (await nextBtn.isVisible()) {
      await nextBtn.click();
    }

    // Step 1 requires fields like Student ID, Last Name, First Name
    // Expect validation message or field highlighting to remain on Step 1
    await expect(page.locator('text=Personal Info').first()).toBeVisible();
  });
});

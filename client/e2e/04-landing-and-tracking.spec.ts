import { test, expect } from '@playwright/test';

test.describe('Public Landing Page and Applicant Status Tracking', () => {
  test('landing page loads with branding, hero, and action buttons', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=ZPPSU Scholarship Portal').first()).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Empowering.*ZPPSU.*Scholars/i);

    // Apply Now button points to /apply
    const applyBtn = page.getByRole('link', { name: /Apply Now/i }).first();
    await expect(applyBtn).toBeVisible();

    // Check Status button exists
    const checkStatusBtn = page.getByRole('button', { name: 'Check Status', exact: true });
    await expect(checkStatusBtn).toBeVisible();
  });

  test('check status modal displays not-found state when reference number does not exist', async ({ page }) => {
    await page.route('**/api/applications/APP-9999-0000**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Application not found' }),
      });
    });

    await page.goto('/');

    // Open Check Status modal
    await page.getByRole('button', { name: 'Check Status', exact: true }).click();
    const modalHeading = page.getByRole('heading', { name: /Track Application/i });
    await expect(modalHeading).toBeVisible();

    // Fill invalid reference number
    const refInput = page.getByPlaceholder(/e.g., APP-2026-3948/i);
    await refInput.fill('APP-9999-0000');
    // Click submit inside the modal
    const submitBtn = page.locator('button[type="submit"]:has-text("Check Status")');
    await submitBtn.click();

    // Verify Not Found message
    await expect(page.locator('text=Record Not Found')).toBeVisible({ timeout: 5000 });
  });

  test('check status modal displays current status and step for valid reference number', async ({ page }) => {
    await page.route('**/api/applications/APP-2026-7777**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          application: {
            referenceNumber: 'APP-2026-7777',
            status: 'Approved',
            createdAt: '2026-10-15T12:00:00.000Z',
            remarks: null,
          },
        }),
      });
    });

    await page.goto('/');

    await page.getByRole('button', { name: 'Check Status', exact: true }).click();

    const refInput = page.getByPlaceholder(/e.g., APP-2026-3948/i);
    await refInput.fill('APP-2026-7777');
    const submitBtn = page.locator('button[type="submit"]:has-text("Check Status")');
    await submitBtn.click();

    // Status details visible
    await expect(page.locator('text=APP-2026-7777')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('heading', { name: 'Approved' })).toBeVisible();
  });
});

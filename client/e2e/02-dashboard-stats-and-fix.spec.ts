import { test, expect } from '@playwright/test';
import { mockAuthenticatedState } from './helpers';

test.describe('Dashboard Statistics and Scholarship Acceptance Bugfix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');

    // Default mock for Recent Applications table so it never fails on mount
    await page.route('**/api/applications', async (route) => {
      const url = route.request().url();
      if (url.includes('/applications/stats') || url.includes('/applications/APP-')) {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, applications: [] }),
      });
    });
  });

  test('fetch of dashboard stats succeeds and displays non-zero numbers on cards', async ({ page }) => {
    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: {
            total: 12,
            pending: 5,
            accepted: 4,
            approved: 4,
            rejected: 3,
          },
          priorityGroups: {
            pwd: 2,
            soloParent: 3,
            ip: 1,
            athlete: 4,
            indigent: 2,
          },
        }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Verify StatCards display the exact fetched numbers, not 0
    const totalCard = page.locator('[data-slot="card"]').filter({ hasText: 'Total Applications' });
    await expect(totalCard).toContainText('12');

    const pendingCard = page.locator('[data-slot="card"]').filter({ hasText: 'Pending Verification' });
    await expect(pendingCard).toContainText('5');

    const approvedCard = page.locator('[data-slot="card"]').filter({ hasText: 'Approved' });
    await expect(approvedCard).toContainText('4');

    const rejectedCard = page.locator('[data-slot="card"]').filter({ hasText: 'Rejected' });
    await expect(rejectedCard).toContainText('3');
  });

  test('verifies priority groups widget displays live counts', async ({ page }) => {
    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: { total: 10, pending: 5, accepted: 5, approved: 5, rejected: 0 },
          priorityGroups: {
            pwd: 7,
            soloParent: 4,
            ip: 3,
            athlete: 2,
            indigent: 6,
          },
        }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Check Priority Groups widget counts
    await expect(page.locator('text=Priority Groups')).toBeVisible();
    await expect(page.locator('text=Person with Disability').locator('../..')).toContainText('7');
    await expect(page.locator('text=Solo Parent').locator('../..')).toContainText('4');
    await expect(page.locator('text=Indigenous Peoples').locator('../..')).toContainText('3');
    await expect(page.locator('text=Sports & Arts').locator('../..')).toContainText('2');
    await expect(page.locator('text=Indigent').locator('../..')).toContainText('6');
  });

  test('approving an application increments the Approved count on dashboard', async ({ page }) => {
    let approvedCount = 0;

    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: {
            total: 10,
            pending: 10 - approvedCount,
            accepted: approvedCount,
            approved: approvedCount,
            rejected: 0,
          },
          priorityGroups: { pwd: 1, soloParent: 1, ip: 0, athlete: 0, indigent: 1 },
        }),
      });
    });

    // 1. Visit dashboard before approval -> approved is 0
    await page.goto('/admin');
    const approvedCard = page.locator('[data-slot="card"]').filter({ hasText: 'Approved' });
    await expect(approvedCard).toContainText('0');

    // 2. Mock single application review and approval flow
    await page.route('**/api/applications/APP-2026-9999**', async (route) => {
      if (route.request().url().includes('/status')) {
        const data = route.request().postDataJSON();
        if (data?.status === 'Approved') {
          approvedCount = 1; // Increment approval state
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          application: {
            id: 9999,
            referenceNumber: 'APP-2026-9999',
            studentId: '2026-0001',
            lastName: 'Dela Cruz',
            givenName: 'Juan',
            college: 'College of Engineering',
            course: 'BSIT',
            status: approvedCount > 0 ? 'Approved' : 'Pending',
            createdAt: new Date().toISOString(),
            verifiedDocuments: ['uploads/grades.pdf'],
            academicInfo: {
              uploadGrades: 'uploads/grades.pdf',
              previousGwa: '1.25',
            },
            personalInfo: {},
            householdInfo: {},
            parentGuardianInfo: {},
            specialCircumstances: {},
          },
          historyLogs: [],
        }),
      });
    });

    // 3. Navigate to application review page
    await page.goto('/admin/applications/APP-2026-9999');
    await expect(page.getByRole('heading', { name: /Dela Cruz, Juan/i })).toBeVisible({ timeout: 10000 });

    // Click Approve button
    const approveBtn = page.getByRole('button', { name: /Approve/i });
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    // Confirm inside the AlertDialog
    const confirmBtn = page.getByRole('button', { name: /Confirm Approval/i });
    await confirmBtn.click();

    // Verify status updated on review page
    await expect(page.locator('text=Status changed to Approved')).toBeVisible({ timeout: 5000 });

    // 4. Return to dashboard
    await page.goto('/admin');

    // 5. Verify the Approved number increased from 0 to 1!
    await expect(approvedCard).toContainText('1');
  });
});

import { test, expect } from '@playwright/test';
import { mockAuthenticatedState } from './helpers';

test.describe('Dashboard Statistics and Scholarship Acceptance Bugfix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');

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

  test('fetch of dashboard stats succeeds and displays KPI rates and distribution charts', async ({ page }) => {
    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: {
            total: 12,
            pending: 4,
            accepted: 4,
            approved: 4,
            rejected: 3,
            flagged: 1,
            recentIntakeCount: 5,
          },
          rates: {
            approvalRate: 57,
            verificationProgress: 58,
            priorityShare: 50,
          },
          priorityGroups: {
            pwd: 2,
            soloParent: 3,
            ip: 1,
            athlete: 4,
            indigent: 2,
          },
          collegeDistribution: {
            'College of Information and Computing Sciences': 6,
            'College of Teacher Education': 4,
            'College of Engineering and Technology': 2,
          },
          incomeDistribution: {
            below10k: 5,
            from10kTo20k: 4,
            from20kTo40k: 2,
            above40k: 1,
          },
        }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Verify 4 Executive KPI cards
    const totalCard = page.locator('[data-slot="card"]').filter({ hasText: 'Total Applications' });
    await expect(totalCard).toContainText('12');

    const approvalRateCard = page.locator('[data-slot="card"]').filter({ hasText: 'Approval Rate' });
    await expect(approvalRateCard).toContainText('57%');

    const verificationCard = page.locator('[data-slot="card"]').filter({ hasText: 'Verification Progress' });
    await expect(verificationCard).toContainText('58%');

    const priorityShareCard = page.locator('[data-slot="card"]').filter({ hasText: 'Priority Sector Share' });
    await expect(priorityShareCard).toContainText('50%');

    // Verify analytical charts render with live counts
    await expect(page.getByText('Applications by College')).toBeVisible();
    await expect(page.getByText('CICS')).toBeVisible();
    await expect(page.getByText('Household Monthly Income Distribution')).toBeVisible();
    await expect(page.getByText('Priority Sector Composition')).toBeVisible();
  });

  test('verifies priority groups widget displays live counts', async ({ page }) => {
    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: { total: 10, pending: 5, accepted: 5, approved: 5, rejected: 0, flagged: 0 },
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

    await expect(page.getByRole('heading', { name: 'Priority Groups' })).toBeVisible();
    await expect(page.locator('a[href*="priority-groups/pwd"]').first()).toContainText('7');
    await expect(page.locator('a[href*="priority-groups/solo-parent"]').first()).toContainText('4');
    await expect(page.locator('a[href*="priority-groups/ip"]').first()).toContainText('3');
    await expect(page.locator('a[href*="priority-groups/sports-arts"]').first()).toContainText('2');
    await expect(page.locator('a[href*="priority-groups/indigent"]').first()).toContainText('6');
  });

  test('approving an application increments the Approved count and rate on dashboard', async ({ page }) => {
    let approvedCount = 0;

    await page.route('**/api/applications/stats', async (route) => {
      const processed = approvedCount;
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
            flagged: 0,
          },
          rates: {
            approvalRate: processed > 0 ? 100 : 0,
            verificationProgress: Math.round((processed / 10) * 100),
            priorityShare: 30,
          },
          priorityGroups: { pwd: 1, soloParent: 1, ip: 0, athlete: 0, indigent: 1 },
          collegeDistribution: {},
          incomeDistribution: { below10k: 3, from10kTo20k: 3, from20kTo40k: 2, above40k: 2 },
        }),
      });
    });

    // 1. Visit dashboard before approval -> 0 approved, 0% approval rate
    await page.goto('/admin');
    const approvalCard = page.locator('[data-slot="card"]').filter({ hasText: 'Approval Rate' });
    await expect(approvalCard).toContainText('0%');
    await expect(approvalCard).toContainText('0 / 0');

    // 2. Mock single application review and approval flow
    await page.route('**/api/applications/APP-2026-9999**', async (route) => {
      if (route.request().url().includes('/status')) {
        const data = route.request().postDataJSON();
        if (data?.status === 'Approved') {
          approvedCount = 1;
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
            college: 'College of Engineering and Technology',
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

    const approveBtn = page.getByRole('button', { name: /Approve/i });
    await expect(approveBtn).toBeVisible();
    await approveBtn.click();

    const confirmBtn = page.getByRole('button', { name: /Confirm Approval/i });
    await confirmBtn.click();

    await expect(page.locator('text=Status changed to Approved')).toBeVisible({ timeout: 5000 });

    // 4. Return to dashboard and verify Approval Rate & count updated
    await page.goto('/admin');
    await expect(approvalCard).toContainText('100%');
    await expect(approvalCard).toContainText('1 / 1');
  });
});

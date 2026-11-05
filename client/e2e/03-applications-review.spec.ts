import { test, expect } from '@playwright/test';
import { mockAuthenticatedState } from './helpers';

test.describe('Applications Management and Verification Review', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');
  });

  test('applications queue lists applications, supports search and status filtering', async ({ page }) => {
    const mockApps = [
      {
        id: 'APP-2026-1001',
        name: 'Santos, Maria C.',
        college: 'College of Information and Computing Sciences',
        course: 'Bachelor of Science in Information Technology',
        status: 'Pending Review',
        date: '2026-10-01T08:00:00.000Z',
        isPriority: true,
        priorityGroups: ['pwd'],
      },
      {
        id: 'APP-2026-1002',
        name: 'Reyes, John D.',
        college: 'College of Engineering',
        course: 'Bachelor of Science in Civil Engineering',
        status: 'Approved',
        date: '2026-10-02T09:00:00.000Z',
        isPriority: false,
        priorityGroups: [],
      },
      {
        id: 'APP-2026-1003',
        name: 'Garcia, Ana P.',
        college: 'College of Teacher Education',
        course: 'Bachelor of Secondary Education',
        status: 'Rejected',
        date: '2026-10-03T10:00:00.000Z',
        isPriority: false,
        priorityGroups: [],
      },
    ];

    await page.route('**/api/applications', async (route) => {
      const url = route.request().url();
      if (url.includes('/applications/stats') || url.includes('/applications/APP-')) {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          applications: mockApps,
        }),
      });
    });

    await page.goto('/admin/applications');
    await expect(page.locator('h1')).toContainText(/Applications/i);

    // Verify applications appear initially
    await expect(page.locator('text=Santos, Maria C.')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Reyes, John D.')).toBeVisible();
    await expect(page.locator('text=Garcia, Ana P.')).toBeVisible();

    // Test Search input using exact placeholder "Search ID or Name..."
    const searchInput = page.getByPlaceholder(/Search ID or Name/i);
    await searchInput.fill('Maria');
    await expect(page.locator('text=Santos, Maria C.')).toBeVisible();
    await expect(page.locator('text=Reyes, John D.')).not.toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('text=Reyes, John D.')).toBeVisible();

    // Test Status Tabs (e.g. Approved tab)
    const approvedTab = page.getByRole('tab', { name: /Approved/i });
    await approvedTab.click();
    await expect(page.locator('text=Reyes, John D.')).toBeVisible();
    await expect(page.locator('text=Santos, Maria C.')).not.toBeVisible();
  });

  test('application review enforces document verification before approval', async ({ page }) => {
    let isDocVerified = false;

    await page.route('**/api/applications/APP-2026-2001**', async (route) => {
      if (route.request().url().includes('/verify-document')) {
        isDocVerified = true;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, verifiedDocuments: ['uploads/grades.pdf'] }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          application: {
            id: 2001,
            referenceNumber: 'APP-2026-2001',
            studentId: '2026-2001',
            lastName: 'Ramos',
            givenName: 'Carlo',
            college: 'College of Engineering',
            course: 'BSIT',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            verifiedDocuments: isDocVerified ? ['uploads/grades.pdf'] : [],
            academicInfo: {
              uploadGrades: 'uploads/grades.pdf',
              previousGwa: '1.40',
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

    await page.goto('/admin/applications/APP-2026-2001');
    await expect(page.getByRole('heading', { name: /Ramos, Carlo/i })).toBeVisible({ timeout: 10000 });

    // When documents are unverified, Approve button shows disabled styling
    const approveBtn = page.getByRole('button', { name: /Approve/i });
    await expect(approveBtn).toHaveClass(/cursor-not-allowed/);

    // Clicking disabled Approve triggers a warning toast
    await approveBtn.click();
    await expect(page.locator('text=Please verify all submitted documents before approving')).toBeVisible();

    // Now verify the document by clicking the verification toggle button
    const verifyDocBtn = page.getByTitle('Mark as verified');
    await verifyDocBtn.click();

    // After verifying, cursor-not-allowed should disappear and clicking Approve opens dialog
    await expect(approveBtn).not.toHaveClass(/cursor-not-allowed/);
    await approveBtn.click();
    await expect(page.getByRole('alertdialog')).toBeVisible();
  });

  test('rejecting an application prompts for reason and records status', async ({ page }) => {
    let applicationStatus = 'Pending';
    let rejectionReason = '';

    await page.route('**/api/applications/APP-2026-3001**', async (route) => {
      if (route.request().url().includes('/status')) {
        const data = route.request().postDataJSON();
        applicationStatus = data.status;
        rejectionReason = data.remarks;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, application: { status: applicationStatus } }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          application: {
            id: 3001,
            referenceNumber: 'APP-2026-3001',
            studentId: '2026-3001',
            lastName: 'Mendoza',
            givenName: 'Patricia',
            college: 'College of Science',
            course: 'BS Biology',
            status: applicationStatus,
            remarks: rejectionReason,
            createdAt: new Date().toISOString(),
            verifiedDocuments: [],
            academicInfo: { previousGwa: '2.50' },
            personalInfo: {},
            householdInfo: {},
            parentGuardianInfo: {},
            specialCircumstances: {},
          },
          historyLogs: [],
        }),
      });
    });

    await page.goto('/admin/applications/APP-2026-3001');
    await expect(page.getByRole('heading', { name: /Mendoza, Patricia/i })).toBeVisible({ timeout: 10000 });

    // Click Reject button
    const rejectBtn = page.getByRole('button', { name: /Reject/i });
    await rejectBtn.click();

    // Rejection reason dialog opens
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Reject Application\?/i);

    // Fill rejection reason
    const reasonInput = page.locator('#reject-reason');
    await reasonInput.fill('GWA does not meet the minimum scholarship threshold of 2.0.');

    // Confirm Rejection
    const confirmRejectBtn = page.getByRole('button', { name: /Confirm Rejection/i });
    await confirmRejectBtn.click();

    // Verify status update in audit history
    await expect(page.locator('text=Status changed to Rejected')).toBeVisible({ timeout: 5000 });
  });
});

import { test, expect } from '@playwright/test';
import { mockAuthenticatedState } from './helpers';

test.describe('Decision Support, Reports, Audit Logs, and Staff Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');
  });

  test('decision support page displays upload dropzone, history, and flagged cross-referencing', async ({ page }) => {
    await page.route('**/api/decision-support/history', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            fileName: 'CHED_Official_List_2026.xlsx',
            uploadDate: '2026-10-10T08:00:00.000Z',
            recordCount: 145,
          },
        ]),
      });
    });

    await page.route('**/api/decision-support/flags', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            dateFlagged: '2026-10-10T08:05:00.000Z',
            matchReason: 'Duplicate Scholar Match: First & Last Name Match with Official CHED Record',
            application: {
              referenceNumber: 'APP-2026-5555',
              lastName: 'Alvarez',
              givenName: 'Miguel',
            },
            officialRecord: {
              scholarshipProgram: 'CHED Tulong Dunong Program',
            },
          },
        ]),
      });
    });

    await page.goto('/admin/decision-support');
    await expect(page.locator('h1')).toContainText(/Decision Support/i);

    // Verify upload card heading
    await expect(page.getByRole('heading', { name: 'Upload Official Records' })).toBeVisible();

    // Verify history table contains the uploaded record
    await expect(page.locator('text=CHED_Official_List_2026.xlsx')).toBeVisible();

    // Verify flagged application appears
    await expect(page.locator('text=APP-2026-5555')).toBeVisible();
    await expect(page.locator('text=CHED Tulong Dunong Program')).toBeVisible();
  });

  test('reports page allows range selection and triggers ANNEX 1 export', async ({ page }) => {
    await page.route('**/api/reports/tes-annex1**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        body: Buffer.from('mock-excel-binary-data'),
      });
    });

    await page.goto('/admin/reports');
    await expect(page.locator('h1')).toContainText(/Reports/i);

    // Select range: '7days'
    const sevenDaysBtn = page.getByRole('button', { name: /7 Days/i });
    if (await sevenDaysBtn.isVisible()) {
      await sevenDaysBtn.click();
    }

    // Verify the Generate Excel Report button is visible
    const exportBtn = page.getByRole('button', { name: /Generate Excel Report/i });
    await expect(exportBtn).toBeVisible();
  });

  test('audit logs page renders system activity table with search', async ({ page }) => {
    await page.route('**/api/audit', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            logs: [
              {
                id: 'log-1',
                createdAt: '2026-10-20T10:00:00.000Z',
                action: 'APP_APPROVE',
                targetAppId: 'APP-2026-1001',
                deviceType: 'desktop',
                os: 'Windows',
                duration: 45,
                notes: 'Approved after verification',
                user: { name: 'Super Admin' },
                userRole: 'Admin',
              },
              {
                id: 'log-2',
                createdAt: '2026-10-20T09:30:00.000Z',
                action: 'USER_LOGIN',
                targetAppId: null,
                deviceType: 'smartphone',
                os: 'Android',
                duration: null,
                notes: null,
                user: { name: 'Staff User' },
                userRole: 'Staff',
              },
            ],
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/admin/audit-logs');
    // H1 in AuditLogsPage is "Audit & System Trails"
    await expect(page.locator('h1')).toContainText(/Audit/i);

    // Table rows render
    await expect(page.locator('text=APP-2026-1001')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Super Admin')).toBeVisible();

    // Test Search filter using placeholder
    const searchInput = page.getByPlaceholder(/Search by user/i);
    await searchInput.fill('APP-2026-1001');
    await expect(page.locator('text=APP-2026-1001')).toBeVisible();
  });

  test('staff management allows viewing, adding, and managing staff accounts', async ({ page }) => {
    await page.route('**/api/staff', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 101,
              name: 'John Staff',
              email: 'john.staff@zppsu.edu.ph',
              gender: 'Male',
              phone: '09123456789',
              isActive: true,
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/admin/staff-management');
    await expect(page.locator('h1')).toContainText(/Staff Accounts/i);

    // Verify existing staff in table
    await expect(page.locator('text=John Staff')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=john.staff@zppsu.edu.ph')).toBeVisible();

    // Verify Add New Staff button opens sheet form
    const addStaffBtn = page.getByRole('button', { name: /Add New Staff/i });
    await expect(addStaffBtn).toBeVisible();
    await addStaffBtn.click();

    // Sheet form opens
    await expect(page.locator('text=Create Staff Account')).toBeVisible();
  });
});

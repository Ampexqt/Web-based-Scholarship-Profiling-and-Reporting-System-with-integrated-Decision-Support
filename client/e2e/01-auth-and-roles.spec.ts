import { test, expect } from '@playwright/test';
import { mockAuthenticatedState, TEST_ADMIN_CREDENTIALS } from './helpers';

test.describe('Authentication and Role-Based Access Control', () => {
  test('redirects unauthenticated users trying to access /admin to /login', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    await page.goto('/admin');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText(/Login to your account/i);
  });

  test('displays error message on invalid login credentials', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Invalid email or password' }),
      });
    });

    await page.goto('/login');

    await page.locator('input[type="email"]').fill('nonexistent@zppsu.edu.ph');
    await page.locator('input[type="password"]').fill('WrongPassword123!');
    await page.locator('button[type="submit"]').click();

    // Verify error box is rendered with the error message
    const errorBox = page.locator('.text-destructive');
    await expect(errorBox).toBeVisible({ timeout: 5000 });
    await expect(errorBox).toContainText(/Invalid email or password/i);
  });

  test('admin logs in successfully and sees admin-specific navigation items', async ({ page }) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: {
            id: 1,
            email: TEST_ADMIN_CREDENTIALS.email,
            name: 'Super Admin',
            role: 'admin',
          },
        }),
      });
    });

    await page.route('**/api/auth/refresh', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: { total: 0, pending: 0, accepted: 0, approved: 0, rejected: 0 },
          priorityGroups: {},
        }),
      });
    });

    await page.route('**/api/applications', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, applications: [] }),
      });
    });

    await page.goto('/login');
    await page.locator('input[type="email"]').fill(TEST_ADMIN_CREDENTIALS.email);
    await page.locator('input[type="password"]').fill(TEST_ADMIN_CREDENTIALS.password);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Verify Admin sees "Staff Accounts" and other navigation items in sidebar
    await expect(page.getByRole('link', { name: /Staff Accounts/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Applications/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Decision Support/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Reports/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Audit Logs/i })).toBeVisible();
  });

  test('staff user does not see Staff Accounts menu and is restricted from staff management', async ({ page }) => {
    await mockAuthenticatedState(page, 'staff');

    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: { total: 0, pending: 0, accepted: 0, approved: 0, rejected: 0 },
          priorityGroups: {},
        }),
      });
    });

    await page.route('**/api/applications', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, applications: [] }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Verify "Staff Accounts" is NOT visible for Staff role
    await expect(page.getByRole('link', { name: /Staff Accounts/i })).not.toBeVisible();

    // Directly attempting to navigate to staff-management redirects back to /admin
    await page.goto('/admin/staff-management');
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('logout prompts confirmation dialog and clears session', async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');

    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: { total: 0, pending: 0, accepted: 0, approved: 0, rejected: 0 },
          priorityGroups: {},
        }),
      });
    });

    await page.route('**/api/applications', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, applications: [] }),
      });
    });

    await page.route('**/api/auth/logout', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Logged out' }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // Click Sign Out in sidebar
    const signOutBtn = page.getByRole('button', { name: /Sign Out/i });
    await signOutBtn.click();

    // Confirm dialog appears
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/Are you sure you want to log out/i);

    // Click Confirm Sign Out inside dialog
    const confirmBtn = dialog.getByRole('button', { name: /Sign Out/i });
    await confirmBtn.click();

    // Must be redirected to /login
    await expect(page).toHaveURL(/\/login/);

    // Verify localStorage is cleared
    const isLoggedIn = await page.evaluate(() => localStorage.getItem('isLoggedIn'));
    expect(isLoggedIn).toBeNull();
  });
});

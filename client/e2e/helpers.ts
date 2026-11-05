import { Page, expect } from '@playwright/test';

export const TEST_ADMIN_CREDENTIALS = {
  email: 'admin@zppsu.edu.ph',
  password: 'Admin123!',
};

export const TEST_STAFF_CREDENTIALS = {
  email: 'staff@zppsu.edu.ph',
  password: 'Staff123!',
};

/**
 * Sets localStorage and mocks auth/audit endpoints so tests are fully resilient
 * and the axios interceptor never triggers an unexpected 401 redirect to /login.
 */
export async function mockAuthenticatedState(page: Page, role: 'admin' | 'staff' = 'admin') {
  const normalizedRole = role.toLowerCase();
  const displayName = normalizedRole === 'admin' ? 'Super Admin' : 'Staff Member';

  // 1. Inject localStorage before DOM loads
  await page.addInitScript(
    ({ role, name, email }) => {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('userName', name);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 1,
          email,
          name,
          role,
        })
      );
    },
    {
      role: normalizedRole,
      name: displayName,
      email: `${normalizedRole}@zppsu.edu.ph`,
    }
  );

  // 2. Intercept auth refresh to prevent axios 401 logout loop
  await page.route('**/api/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Refreshed' }),
    });
  });

  // 3. Intercept auth/me
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: {
          id: 1,
          email: `${normalizedRole}@zppsu.edu.ph`,
          name: displayName,
          role: normalizedRole,
        },
      }),
    });
  });

  // 4. Intercept audit tracking pings
  await page.route('**/api/audit/**', async (route) => {
    // If it's a GET /api/audit (the audit logs page), let the test handle it or return empty logs
    if (route.request().method() === 'GET' && route.request().url().endsWith('/api/audit')) {
      await route.continue();
      return;
    }
    // For POST /audit/event, POST /audit/duration, etc.
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
}

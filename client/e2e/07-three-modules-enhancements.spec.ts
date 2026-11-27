import { test, expect } from '@playwright/test';
import { mockAuthenticatedState } from './helpers';

test.describe('System Enhancements — 3 Core Modules E2E Verification', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedState(page, 'admin');
  });

  test('Module 1: Executive Dashboard renders 4 KPI cards, all 4 analytical charts, and no Recent Applications table', async ({ page }) => {
    await page.route('**/api/applications/stats', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          stats: {
            total: 40,
            pending: 10,
            approved: 21,
            accepted: 21,
            rejected: 7,
            flagged: 2,
            recentIntakeCount: 8,
          },
          rates: {
            approvalRate: 75,
            verificationProgress: 70,
            priorityShare: 60,
          },
          priorityGroups: {
            indigent: 12,
            soloParent: 5,
            pwd: 4,
            ip: 3,
            athlete: 6,
          },
          collegeDistribution: {
            'College of Information and Computing Sciences': 15,
            'College of Teacher Education': 12,
            'College of Engineering and Technology': 8,
            'School of Business Administration': 5,
          },
          incomeDistribution: {
            below10k: 16,
            from10kTo20k: 12,
            from20kTo40k: 8,
            above40k: 4,
          },
        }),
      });
    });

    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText(/Overview/i);

    // 1. All 4 KPI Cards
    const kpiSection = page.getByLabel('Key Performance Indicators');
    await expect(kpiSection).toContainText('Total Applications');
    await expect(kpiSection).toContainText('40');
    await expect(kpiSection).toContainText('+8 / 7d');
    await expect(kpiSection).toContainText('Approval Rate');
    await expect(kpiSection).toContainText('75%');
    await expect(kpiSection).toContainText('Verification Progress');
    await expect(kpiSection).toContainText('70%');
    await expect(kpiSection).toContainText('Priority Sector Share');
    await expect(kpiSection).toContainText('60%');

    // 2. All 4 Analytical Visualizations
    await expect(page.getByText('Applications by College')).toBeVisible();
    await expect(page.getByText('Application Status')).toBeVisible();
    await expect(page.getByText('Household Monthly Income Distribution')).toBeVisible();
    await expect(page.getByText('< ₱10,000')).toBeVisible();
    await expect(page.getByText('> ₱40,000')).toBeVisible();
    await expect(page.getByText('Priority Sector Composition')).toBeVisible();

    // 3. Recent Applications table must be removed
    await expect(page.getByText('Recent Applications')).toHaveCount(0);
  });

  test('Module 2: MCDA Decision Support supports 3 tabs, track switching, quota allocation, human-in-the-loop override, and weight config', async ({ page }) => {
    let savedDecisionForTopApplicant: { decision: string; remarks: string } | null = null;
    let postedWeightsPayload: Record<string, unknown> | null = null;

    await page.route('**/api/decision-support/history', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 1,
            fileName: 'TES_Official_2026.xlsx',
            uploadDate: '2026-10-15T08:00:00.000Z',
            recordCount: 72,
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
            id: 10,
            dateFlagged: '2026-10-15T08:10:00.000Z',
            matchReason: 'Exact Name Match in TES',
            application: {
              referenceNumber: 'APP-2026-7777',
              lastName: 'Santos',
              givenName: 'Marco',
            },
            officialRecord: {
              scholarshipProgram: 'TES',
              listReference: 'TES-2026-001',
            },
          },
        ]),
      });
    });

    await page.route('**/api/decision-support/weights', async (route) => {
      if (route.request().method() === 'POST') {
        postedWeightsPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'MCDA weights updated successfully',
            config: postedWeightsPayload,
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          activeTrack: 'balanced',
          activeWeights: { gwaWeight: 35, incomeWeight: 30, householdWeight: 15, priorityWeight: 20 },
          tracks: [
            {
              key: 'needs-based',
              label: 'Needs-Based / Equity',
              description: 'Equity focus',
              isActive: false,
              weights: { gwaWeight: 10, incomeWeight: 45, householdWeight: 15, priorityWeight: 30 },
              updatedAt: null,
            },
            {
              key: 'merit',
              label: 'Merit / Academic',
              description: 'Merit focus',
              isActive: false,
              weights: { gwaWeight: 60, incomeWeight: 20, householdWeight: 10, priorityWeight: 10 },
              updatedAt: null,
            },
            {
              key: 'balanced',
              label: 'Balanced Composite',
              description: 'Balanced focus',
              isActive: true,
              weights: { gwaWeight: 35, incomeWeight: 30, householdWeight: 15, priorityWeight: 20 },
              updatedAt: null,
            },
            {
              key: 'custom',
              label: 'Custom Institutional Track',
              description: 'Custom focus',
              isActive: false,
              weights: { gwaWeight: 35, incomeWeight: 30, householdWeight: 15, priorityWeight: 20 },
              updatedAt: null,
            },
          ],
        }),
      });
    });

    await page.route('**/api/decision-support/override', async (route) => {
      const body = route.request().postDataJSON();
      savedDecisionForTopApplicant = {
        decision: body.decision,
        remarks: body.remarks,
      };
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Override decision recorded and logged.',
          decision: body,
        }),
      });
    });

    await page.route('**/api/decision-support/rankings**', async (route) => {
      const url = new URL(route.request().url());
      const track = url.searchParams.get('track') || 'balanced';
      const quota = Number(url.searchParams.get('quota') || '50');

      const meritApplicant = {
        applicationId: 101,
        referenceNumber: 'APP-2026-1001',
        studentId: '2026-0101',
        fullName: 'Reyes, Elena M.',
        college: 'College of Information and Computing Sciences',
        course: 'Bachelor of Science in Information Technology',
        status: 'Pending',
        isFlagged: false,
        flagReasons: [],
        metrics: {
          gwa: 1.25,
          gwaInverted: 3.75,
          monthlyIncome: 35000,
          householdSize: 4,
          priorityPoints: 0,
          priorityTags: [],
        },
        normalized: { gwa: 1, income: 0, household: 0, priority: 0 },
        weightedPoints:
          track === 'merit'
            ? { gwa: 60, income: 0, household: 0, priority: 0 }
            : { gwa: 10, income: 0, household: 0, priority: 0 },
        compositeScore: track === 'merit' ? 60 : track === 'needs-based' ? 10 : 35,
        decision: null,
      };

      const needsApplicant = {
        applicationId: 102,
        referenceNumber: 'APP-2026-1002',
        studentId: '2026-0102',
        fullName: 'Cruz, Mateo B.',
        college: 'College of Teacher Education',
        course: 'Bachelor of Elementary Education',
        status: 'Pending',
        isFlagged: false,
        flagReasons: [],
        metrics: {
          gwa: 2.1,
          gwaInverted: 2.9,
          monthlyIncome: 7000,
          householdSize: 6,
          priorityPoints: 55,
          priorityTags: ['Indigent / 4Ps', 'Solo Parent'],
        },
        normalized: { gwa: 0, income: 1, household: 1, priority: 1 },
        weightedPoints:
          track === 'merit'
            ? { gwa: 0, income: 20, household: 10, priority: 10 }
            : { gwa: 0, income: 45, household: 15, priority: 30 },
        compositeScore: track === 'merit' ? 40 : track === 'needs-based' ? 90 : 65,
        decision: savedDecisionForTopApplicant
          ? {
              ...savedDecisionForTopApplicant,
              trackKey: track,
              compositeScore: 65,
              decidedAt: new Date().toISOString(),
            }
          : null,
      };

      const ordered =
        track === 'merit' ? [meritApplicant, needsApplicant] : [needsApplicant, meritApplicant];

      const rankings = ordered.map((item, idx) => ({
        ...item,
        rank: idx + 1,
        recommendation: idx + 1 <= quota ? 'Recommended for Award' : 'Waitlisted',
      }));

      const weightMap: Record<string, { gwaWeight: number; incomeWeight: number; householdWeight: number; priorityWeight: number }> = {
        'needs-based': { gwaWeight: 10, incomeWeight: 45, householdWeight: 15, priorityWeight: 30 },
        merit: { gwaWeight: 60, incomeWeight: 20, householdWeight: 10, priorityWeight: 10 },
        balanced: { gwaWeight: 35, incomeWeight: 30, householdWeight: 15, priorityWeight: 20 },
        custom: { gwaWeight: 40, incomeWeight: 30, householdWeight: 10, priorityWeight: 20 },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          track: { key: track, label: track },
          quota,
          weights: weightMap[track] || weightMap.balanced,
          summary: {
            totalEvaluated: rankings.length,
            recommendedCount: rankings.filter((r) => r.recommendation === 'Recommended for Award').length,
            waitlistedCount: rankings.filter((r) => r.recommendation === 'Waitlisted').length,
            flaggedCount: 1,
            averageScore: 50,
          },
          rankings,
          flaggedHold: [
            {
              rank: 1,
              applicationId: 103,
              referenceNumber: 'APP-2026-7777',
              studentId: '2026-0103',
              fullName: 'Santos, Marco',
              college: 'College of Maritime Education',
              course: 'BSME',
              status: 'Flagged',
              isFlagged: true,
              flagReasons: ['Exact Name Match in TES'],
              metrics: { gwa: 1.5, gwaInverted: 3.5, monthlyIncome: 12000, householdSize: 4, priorityPoints: 0, priorityTags: [] },
              normalized: { gwa: 0.8, income: 0.8, household: 0.5, priority: 0 },
              weightedPoints: { gwa: 28, income: 24, household: 7.5, priority: 0 },
              compositeScore: 59.5,
              recommendation: 'Flagged Hold',
              decision: null,
            },
          ],
        }),
      });
    });

    await page.goto('/admin/decision-support');
    await expect(page.locator('h1')).toContainText(/Decision Support/i);

    // Tab 1 is visible by default
    await expect(page.getByRole('heading', { name: 'Upload Official Records' })).toBeVisible();
    await expect(page.getByText('TES_Official_2026.xlsx')).toBeVisible();

    // Switch to Tab 2: MCDA Ranking & Quota Matrix
    await page.getByRole('tab', { name: /MCDA Ranking & Quota Matrix/i }).click();
    await expect(page.getByText('Ranked Applicant Matrix')).toBeVisible();

    // In default Balanced track, Mateo Cruz (Needs) is #1
    const firstRow = page.locator('tbody tr').first();
    await expect(firstRow).toContainText('Cruz, Mateo B.');
    await expect(firstRow).toContainText('65.00');

    // Set Quota N = 1 -> rank #1 is Recommended for Award, rank #2 is Waitlisted
    const quotaInput = page.locator('#mcda-quota');
    await quotaInput.fill('1');
    await expect(page.locator('tbody tr').nth(0)).toContainText('Recommended for Award');
    await expect(page.locator('tbody tr').nth(1)).toContainText('Waitlisted');

    // Switch to Merit / Academic track -> Elena Reyes (GWA 1.25) becomes #1!
    await page.getByRole('button', { name: /Merit \/ Academic/i }).click();
    await expect(page.locator('tbody tr').first()).toContainText('Reyes, Elena M.');
    await expect(page.locator('tbody tr').first()).toContainText('60.00');

    // Switch back to Balanced and execute Human-in-the-Loop Override
    await page.getByRole('button', { name: /Balanced Composite/i }).click();
    await expect(page.locator('tbody tr').first()).toContainText('Cruz, Mateo B.');
    await page.locator('tbody tr').first().getByRole('button', { name: 'Decide' }).click();

    await expect(page.getByText('Human-in-the-Loop Decision')).toBeVisible();
    await page.locator('#mcda-decision-select').selectOption('OVERRIDE_AWARD');
    await page.locator('#mcda-override-remarks').fill('Verified indigent certification during committee review.');
    await page.getByRole('button', { name: 'Save Decision' }).click();

    await expect(page.locator('tbody tr').first()).toContainText('Override: Award');

    // Switch to Tab 3: Weight Configuration
    await page.getByRole('tab', { name: /Weight Configuration/i }).click();
    await expect(page.getByText('Custom Criteria Weight Configuration')).toBeVisible();

    // Set invalid sum (total != 100) -> Save button should be disabled
    await page.locator('#weight-gwaWeight').fill('50');
    await expect(page.getByRole('button', { name: /Save Weights/i })).toBeDisabled();

    // Adjust to valid sum: 40 + 30 + 10 + 20 = 100
    await page.locator('#weight-gwaWeight').fill('40');
    await page.locator('#weight-incomeWeight').fill('30');
    await page.locator('#weight-householdWeight').fill('10');
    await page.locator('#weight-priorityWeight').fill('20');
    await expect(page.getByText('Total: 100%')).toBeVisible();

    const saveBtn = page.getByRole('button', { name: /Save Weights/i });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    await expect.poll(() => postedWeightsPayload).toMatchObject({
      trackKey: 'custom',
      gwaWeight: 40,
      incomeWeight: 30,
      householdWeight: 10,
      priorityWeight: 20,
    });
  });

  test('Module 3: Reports page supports multi-college filtering, Select All toggle, live count summary, and Annex 1 .xlsm export', async ({ page }) => {
    let lastExportUrl = '';

    await page.route('**/api/reports/tes-annex1/summary**', async (route) => {
      const url = new URL(route.request().url());
      const collegesParam = url.searchParams.get('colleges') || 'ALL';
      const eligibleCount = collegesParam === 'ALL' ? 28 : collegesParam.split(',').length * 4;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          eligibleCount,
          totalApproved: 28,
        }),
      });
    });

    await page.route('**/api/reports/tes-annex1?*', async (route) => {
      lastExportUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/vnd.ms-excel.sheet.macroEnabled.12',
        body: Buffer.from('mock-xlsm-workbook-bytes'),
      });
    });

    await page.goto('/admin/reports');
    await expect(page.locator('h1')).toContainText(/Reports/i);

    // Initially all 8 colleges selected
    await expect(page.getByText('All 8 Colleges')).toBeVisible();
    await expect(page.getByText('Matching Approved Scholars')).toBeVisible();
    await expect(page.getByText('28')).toBeVisible();

    // Deselect All -> export button disabled and validation message visible
    await page.getByRole('button', { name: 'Deselect All' }).click();
    await expect(page.getByText('Select at least one college to export Annex 1.')).toBeVisible();
    await expect(page.getByRole('button', { name: /Generate Excel Report/i })).toBeDisabled();

    // Select specific colleges: CICS and CTE
    await page.getByRole('checkbox', { name: /CICS/i }).click();
    await page.getByRole('checkbox', { name: /CTE/i }).click();
    await expect(page.getByText('2 of 8 selected')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove CICS' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Remove CTE' })).toBeVisible();

    // Select 7 Days range and trigger export
    await page.getByRole('button', { name: /7 Days/i }).click();
    const exportBtn = page.getByRole('button', { name: /Generate Excel Report/i });
    await expect(exportBtn).toBeEnabled();
    await exportBtn.click();

    await expect.poll(() => lastExportUrl).toContain('dateRange=7days');
    await expect.poll(() => lastExportUrl).toContain('colleges=CICS%2CCTE');

    // Select All restores all colleges
    await page.getByRole('button', { name: 'Select All' }).click();
    await expect(page.getByText('All 8 Colleges')).toBeVisible();
  });
});

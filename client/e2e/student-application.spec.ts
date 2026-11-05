import { test, expect } from '@playwright/test';

test.describe('Student Scholarship Application Submission E2E', () => {
  test('successfully completes the 11-step application wizard and submits', async ({ page }) => {
    // 1. Navigate to the application page
    await page.goto('/apply');
    await expect(page.locator('h1')).toContainText('Scholarship Application');

    // -------------------------------------------------------------
    // PART I: Personal Information
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part I. Personal Information');

    await page.locator('input[name="studentId"]').fill(`TEST-${Date.now().toString().slice(-5)}`);
    await page.locator('input[name="lastName"]').fill('Reyes');
    await page.locator('input[name="givenName"]').fill('Maria');
    await page.locator('input[name="middleName"]').fill('Santos');

    await page.locator('select[name="college"]').selectOption({ label: 'College of Information and Computing Sciences' });
    await page.locator('select[name="course"]').selectOption({ label: 'Bachelor of Science in Information Technology' });
    await page.locator('select[name="yearLevel"]').selectOption('1st Year');
    await page.locator('select[name="sex"]').selectOption('Female');
    await page.locator('input[name="age"]').fill('20');
    await page.locator('input[name="birthdate"]').fill('2004-05-15');
    await page.locator('select[name="civilStatus"]').selectOption('Single');
    await page.locator('input[name="placeOfBirth"]').fill('Zamboanga City');
    await page.locator('select[name="religion"]').selectOption('Roman Catholic');

    // Contact info
    await page.locator('input[name="emailAddress"]').fill(`maria.test.${Date.now()}@example.com`);
    await page.locator('input[name="mobileNumber"]').fill('9171234567');

    // Current Address
    await page.locator('input[name="currentHouseBlock"]').fill('Lot 1 Blk 2');
    await page.locator('input[name="currentStreet"]').fill('Main Street');

    // Wait for regions to load from API
    const regionSelect = page.locator('select[name="currentRegion"]');
    await regionSelect.waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
      const el = document.querySelector('select[name="currentRegion"]') as HTMLSelectElement | null;
      return el && el.options.length > 1;
    }, { timeout: 10000 }).catch(() => {});

    const regionOptions = await regionSelect.locator('option').all();
    if (regionOptions.length > 1) {
      // Select the first valid region
      await regionSelect.selectOption({ index: 1 });
      
      // Select province if required and available
      const provSelect = page.locator('select[name="currentProvince"]');
      if (await provSelect.isVisible()) {
        await page.waitForFunction(() => {
          const el = document.querySelector('select[name="currentProvince"]') as HTMLSelectElement | null;
          return el && el.options.length > 1;
        }, { timeout: 5000 }).catch(() => {});
        const provOptions = await provSelect.locator('option').all();
        if (provOptions.length > 1) {
          await provSelect.selectOption({ index: 1 });
        }
      }

      // City/Municipality
      const citySelect = page.locator('select[name="currentMunicipality"]');
      await page.waitForFunction(() => {
        const el = document.querySelector('select[name="currentMunicipality"]') as HTMLSelectElement | null;
        return el && el.options.length > 1;
      }, { timeout: 5000 }).catch(() => {});
      const cityOptions = await citySelect.locator('option').all();
      if (cityOptions.length > 1) {
        await citySelect.selectOption({ index: 1 });
      }

      // Barangay
      const brgySelect = page.locator('select[name="currentBarangay"]');
      await page.waitForFunction(() => {
        const el = document.querySelector('select[name="currentBarangay"]') as HTMLSelectElement | null;
        return el && el.options.length > 1;
      }, { timeout: 5000 }).catch(() => {});
      const brgyOptions = await brgySelect.locator('option').all();
      if (brgyOptions.length > 1) {
        await brgySelect.selectOption({ index: 1 });
      }
    }

    await page.locator('input[name="currentZipCode"]').fill('7000');

    // Check "Same as Current Address" for permanent address
    await page.locator('input[id="sameAsCurrent"]').check();

    // Student Classification
    await page.locator('select[name="studentClassification"]').selectOption('Regular');

    // Proceed to Step 2
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART II: Household Information
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part II. Household Information');
    await page.locator('input[name="headFullName"]').fill('Jose Reyes');
    await page.locator('select[name="headRelationship"]').selectOption('Father');
    await page.locator('input[name="totalMembers"]').fill('4');
    await page.locator('select[name="monthlyIncome"]').selectOption('Less than P11,000');
    
    // Click the labels for radio buttons styled with sr-only
    await page.locator('label', { hasText: 'Private Employment' }).click();
    await page.locator('label', { hasText: 'None' }).click();

    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART III: Parent / Guardian Information
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part III. Parent / Guardian Information');

    // Father
    await page.locator('input[name="fatherFamilyName"]').fill('Reyes');
    await page.locator('input[name="fatherGivenName"]').fill('Jose');
    await page.locator('input[name="fatherMiddleName"]').fill('Dela Cruz');
    await page.locator('select[name="fatherLivingStatus"]').selectOption('Living');
    await page.locator('select[name="fatherEducation"]').selectOption('High School Graduate');
    await page.locator('select[name="fatherEmploymentStatus"]').selectOption('Employed');
    await page.locator('select[name="fatherOccupationCategory"]').selectOption('Private Employee');
    await page.locator('select[name="fatherMonthlyIncome"]').selectOption('Less than P11,000');

    // Mother
    await page.locator('input[name="motherFamilyName"]').fill('Santos');
    await page.locator('input[name="motherGivenName"]').fill('Elena');
    await page.locator('input[name="motherMiddleName"]').fill('Flores');
    await page.locator('select[name="motherLivingStatus"]').selectOption('Living');
    await page.locator('select[name="motherEducation"]').selectOption('High School Graduate');
    await page.locator('select[name="motherEmploymentStatus"]').selectOption('Employed');
    await page.locator('select[name="motherOccupationCategory"]').selectOption('Private Employee');
    await page.locator('select[name="motherMonthlyIncome"]').selectOption('Less than P11,000');

    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART IV: Household Composition
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part IV. Household Composition');
    await page.locator('input[name="householdMembers.0.name"]').fill('Carlos Reyes');
    await page.locator('select[name="householdMembers.0.relationship"]').selectOption('Sibling');
    await page.locator('select[name="householdMembers.0.sex"]').selectOption('Male');
    await page.locator('input[name="householdMembers.0.age"]').fill('16');
    await page.locator('select[name="householdMembers.0.civilStatus"]').selectOption('Single');
    await page.locator('select[name="householdMembers.0.education"]').selectOption('High School Undergraduate');
    await page.locator('select[name="householdMembers.0.employmentStatus"]').selectOption('Unemployed');
    await page.locator('select[name="householdMembers.0.currentlyStudying"]').selectOption('Yes');

    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART V: Academic Information & Uploads
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part V. Academic Information');
    await page.locator('input[name="previousGwa"]').fill('91.5');
    await page.locator('select[name="academicHonors"]').selectOption("Dean's Lister");

    // Prepare dummy file buffers
    const dummyPdf = {
      name: 'document.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 test dummy file'),
    };

    await page.locator('input#uploadGrades').setInputFiles(dummyPdf);
    await page.locator('input#uploadRecommendation').setInputFiles(dummyPdf);
    await page.locator('input#uploadGwaProof').setInputFiles(dummyPdf);

    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART VI: PWD (defaults to "No")
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part VI. Person with Disability');
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART VII: Solo Parent (defaults to "No")
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part VII. Solo Parent');
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART VIII: Indigenous Peoples (defaults to "No")
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part VIII. Indigenous Peoples');
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART IX: Sports, Dance, and Music (defaults to "No")
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part IX. Sports, Dance, and Music');
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART X: Indigent (defaults to "No")
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText('Part X. Indigent Student');
    await page.getByRole('button', { name: 'Next Step' }).click();

    // -------------------------------------------------------------
    // PART XI: Certification & Consent
    // -------------------------------------------------------------
    await expect(page.locator('h2')).toContainText("Part XI. Applicant's Certification and Data Privacy Consent");

    await page.locator('input[name="certifyTrue"]').check({ force: true });
    await page.locator('input[name="certifyAuthentic"]').check({ force: true });
    await page.locator('input[name="dataPrivacyConsent"]').check({ force: true });

    // Draw digital signature on canvas
    const canvas = page.locator('canvas');
    await canvas.waitFor({ state: 'visible' });
    const box = await canvas.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 30, box.y + 30);
      await page.mouse.down();
      await page.mouse.move(box.x + 120, box.y + 60);
      await page.mouse.move(box.x + 200, box.y + 40);
      await page.mouse.up();
      await page.waitForTimeout(500);
    }

    // Submit Application
    const submitBtn = page.getByRole('button', { name: 'Submit Application' });
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // -------------------------------------------------------------
    // VERIFY SUBMISSION SUCCESS
    // -------------------------------------------------------------
    const successHeader = page.locator('h2', { hasText: 'Application Submitted!' });
    await expect(successHeader).toBeVisible({ timeout: 15000 });

    const refNumberElement = page.locator('p.text-2xl.font-bold.text-primary.tracking-widest');
    await expect(refNumberElement).toBeVisible();
    const refNumber = await refNumberElement.textContent();
    expect(refNumber).toMatch(/^APP-\d{4}-\d{4}$/);
  });
});

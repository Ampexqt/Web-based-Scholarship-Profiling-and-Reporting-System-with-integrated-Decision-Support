# System Enhancement Specifications & Decision Support System (MCDA) Architecture

**Project:** Web-based Scholarship Profiling and Reporting System with Integrated Decision Support  
**Document Version:** 1.0  
**Target Modules:** Analytics Dashboard, Decision Support System (MCDA), Reports & Annex Export  

---

## 1. Overview & Objectives

This document serves as the official design reference and technical specification for three core system enhancements requested by the client and defense committee:

1. **Dashboard Transformation**: Transition from a transactional view into a zero-click, information-rich analytical command center featuring key performance indicators (percentages, distributions, and demographic visualizations).
2. **Integrated Decision Support System (DSS) using Multi-Criteria Decision Analysis (MCDA)**: Transition from simple database queries into a multi-criteria scoring and ranking engine (Simple Additive Weighting + AHP weight justification) capable of resolving trade-offs between academic merit and socio-economic need.
3. **Flexible Annex 1 Reporting**: Enable selective, multi-college filtering for the official CHED/UniFAST Annex 1 (`.xlsm`) report generation.

---

## 2. Module 1: Dashboard Redesign (Zero-Click Executive Overview)

### 2.1 Problem Statement & UX Goal
* **Current Issue**: The dashboard previously included a "Recent Applications" table that duplicated table views found in the Applications page and required repetitive clicks to navigate.
* **Goal**: Provide an instantaneous macro-level snapshot of scholarship applications, socio-economic demographics, and processing efficiency with **zero extra clicks** required.

### 2.2 Key Performance Indicators (KPI Cards)
The top metric row will feature four primary metric cards equipped with percentage rates:
* **Total Applications**: Total count with period-over-period growth or intake rate.
* **Approval Rate (%)**: $\frac{\text{Approved Applicants}}{\text{Total Processed Applicants}} \times 100$
* **Verification Progress (%)**: $\frac{\text{Processed (Approved + Rejected)}}{\text{Total Applications}} \times 100$
* **Priority Sector Share (%)**: Percentage of total applicants belonging to affirmative-action categories (PWD, Solo Parent, Indigenous Peoples, Indigent, Athletes/Artists).

### 2.3 Analytical Charts & Visualizations
Replace the recent applications table with modern, responsive data visualizations:
1. **Applicants by College / Department (Horizontal Bar Chart)**:
   * Visualizes application volume across university colleges (e.g., CICS, CTE, CLA, CME, CCJE, CBA).
   * Highlights demand disparity across colleges.
2. **Priority Sector Composition (Donut / Pie Chart)**:
   * Distribution of special circumstances: Indigent, Solo Parent, Person with Disability (PWD), Indigenous Peoples (IP), and Athletes/Artists.
3. **Household Income Distribution (Histogram / Column Chart)**:
   * Groups applicants into income brackets:
     * `< ₱10,000` (Extreme Poverty / High Need)
     * `₱10,001 - ₱20,000` (Low Income)
     * `₱20,001 - ₱40,000` (Lower Middle Income)
     * `> ₱40,000` (Moderate Income)
4. **Application Processing Funnel / Status Breakdown**:
   * Pending Review vs. Flagged vs. Approved vs. Rejected.

---

## 3. Module 2: Decision Support System (MCDA Engine)

### 3.1 Problem Definition: Merit vs. Need Trade-offs
Standard database filtering cannot resolve multi-objective conflicts. For example:
* **Applicant A**: High academic achievement ($\text{GWA} = 1.25$), but higher family income ($\text{₱}35,000/\text{mo}$).
* **Applicant B**: Moderate academic achievement ($\text{GWA} = 2.10$), but extreme financial hardship (Indigent, Solo Parent household, $\text{₱}7,000/\text{mo}$).

Without MCDA, committees risk arbitrary or inconsistent selection when scholarship quotas are capped.

### 3.2 Chosen Method: Simple Additive Weighting (SAW)
The system adopts the **Simple Additive Weighting (SAW)** method (supported by Analytic Hierarchy Process [AHP] for weight justification).

#### Mathematical Formulation
Each criterion score is normalized to a dimensionless scale of $[0, 1]$ (or $0 - 100$ points):

1. **Benefit Criteria (Higher value = Higher priority)**:
   * Example: General Weighted Average (GWA, inverted so $1.00$ is highest), Special Circumstances points, Household dependency count.
   $$R_{ij} = \frac{x_{ij} - x_{j}^{\min}}{x_{j}^{\max} - x_{j}^{\min}}$$

2. **Cost Criteria (Lower value = Higher priority)**:
   * Example: Monthly Household Income.
   $$R_{ij} = \frac{x_{j}^{\max} - x_{ij}}{x_{j}^{\max} - x_{j}^{\min}}$$

3. **Composite Evaluation Score**:
   $$V(A_i) = \sum_{j=1}^{n} w_j \cdot R_{ij}$$
   Where $\sum_{j=1}^{n} w_j = 1.0$ ($100\%$).

### 3.3 Dynamic Scholarship Evaluation Tracks
The DSS provides three selectable evaluation tracks to cater to different grant mandates:

| Evaluation Track | GWA Weight | Monthly Income Weight | Household Size Weight | Priority / Circumstances |
| :--- | :---: | :---: | :---: | :---: |
| **Track 1: Needs-Based / Equity** | $10\%$ | $45\%$ | $15\%$ | $30\%$ |
| **Track 2: Merit / Academic** | $60\%$ | $20\%$ | $10\%$ | $10\%$ |
| **Track 3: Balanced Composite (Default)** | $35\%$ | $30\%$ | $15\%$ | $20\%$ |

### 3.4 Decision Support Output & Quota Allocation Workflow
1. **Automated Cross-Reference**: Flags any applicant appearing on external unauthorized masterlists (TES/UniFAST/CHED) prior to ranking.
2. **Automated Score Breakdown**: Displays individual metric points (Academic, Income, Household, Priority) alongside the composite score ($0 - 100$).
3. **Quota Slot Recommendation**:
   * System accepts an intake quota $N$ (e.g., $50$ slots).
   * Ranks all qualified applicants.
   * Ranks $1$ through $N$ are tagged as **"Recommended for Award"**.
   * Ranks $> N$ are tagged as **"Waitlisted"**.
4. **Human-in-the-Loop Override**: Administrators retain the authority to confirm recommendations or enter justification remarks for overrides, permanently recorded in the `AuditLog`.

---

## 4. Module 3: Reports & College-Specific Annex 1 Export

### 4.1 Requirement & Business Logic
The CHED/UniFAST Annex 1 template (`.xlsm`) requires strict column mapping, uppercase name formatting, and macro preservation. Previously, exports were only filterable by date range.

### 4.2 Enhanced Selection & Filtering Specifications
1. **Multi-College Selector**:
   * Administrators can select one, several, or all university colleges via a multi-select dropdown/checkbox interface with a **"Select All"** toggle.
2. **Eligible Applicant Filter**:
   * Restricts Annex export to applicants with status `Approved` or `Accepted` within the selected colleges and date ranges.
3. **Template Preservation**:
   * Preserves native Excel macros (`.xlsm`) using `xlsx-populate`.
   * Clears old rows dynamically and populates student rows beginning strictly at Row 9.
   * Auto-formats fields: normalized course descriptions, birthdate formatting (`YYYY-MM-DD`), mobile number normalization (`9XXXXXXXXX`), and upper-cased names.
4. **Security & Audit**:
   * Generates an audit trail entry logging the user ID, role, timestamp, and selected college filters upon export.

---

## 5. Technical Implementation Blueprint

### 5.1 Backend Architecture
* **`server/src/services/decisionSupportScoring.ts`**: Core MCDA scoring algorithm, track definitions, and normalization functions.
* **`server/src/controllers/decisionSupport.controller.ts`**:
  * `GET /api/decision-support/rankings?track=needs-based`: Returns ranked applicants with itemized score breakdowns.
  * `GET /api/decision-support/weights`: Returns active criteria weights.
  * `POST /api/decision-support/weights`: Allows authorized admins to configure weights.
* **`server/src/controllers/reportController.ts`**:
  * `GET /api/reports/tes-annex1?colleges=CICS,CTE&dateRange=30days`: Populates Annex 1 filtered by selected colleges.

### 5.2 Frontend Architecture
* **`client/src/features/admin/pages/DashboardPage.tsx`**:
  * Remove `RecentApplicationsTable.tsx`.
  * Add Recharts-based components for College distributions, Priority Donut, and Income Histograms.
* **`client/src/features/admin/pages/DecisionSupportPage.tsx`**:
  * Add a tabbed interface: Tab 1 (Official Masterlist Cross-Referencing & Flags), Tab 2 (MCDA Applicant Ranking & Quota Matrix), Tab 3 (Weight Configuration).
* **`client/src/features/admin/pages/ReportsPage.tsx`**:
  * Integrate college multi-select filter component with badge indicators and "Select All" functionality.

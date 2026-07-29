# Project Overview

## Project Title

**Web-based Scholarship Profiling and Reporting System with Integrated Decision Support**

---

# 1. Introduction

The **Web-based Scholarship Profiling and Reporting System with Integrated Decision Support** is a centralized web-based information system designed to improve the management of scholarship applications, applicant profiling, application verification, monitoring, and reporting within the institution.

The current scholarship application process is largely manual, requiring applicants to complete paper forms while scholarship personnel manually verify applicant information, review documentary requirements, organize records, and prepare reports. As the number of applicants increases, managing records and tracking application progress becomes more time-consuming and susceptible to errors.

To address these challenges, the proposed system digitalizes the scholarship application process by allowing applicants to complete and submit scholarship application forms through a web-based platform. Submitted applications are then processed by scholarship personnel using an organized management system that supports verification, application monitoring, and report generation.

The system also integrates a **Decision Support** component that assists scholarship personnel during application evaluation. Rather than making automatic decisions, the system analyzes uploaded official scholarship records—such as TES, CHED, or other scholarship beneficiary lists—and identifies applicants who may already be existing scholarship beneficiaries or possible duplicate applicants. These findings are presented to the scholarship staff as recommendations, while the final decision remains under human supervision.

The system is intended to improve efficiency, transparency, and accountability throughout the scholarship administration process while ensuring that scholarship decisions remain under the authority of authorized personnel.

---

# 2. Project Background

Scholarship programs play an essential role in providing financial assistance and educational opportunities to deserving students. However, many scholarship offices continue to rely on manual procedures for collecting applications, reviewing documents, validating applicant information, and generating reports.

Manual processing often results in:

- Slow application processing.
- Difficulty organizing applicant records.
- Redundant encoding of information.
- Limited monitoring of application progress.
- Time-consuming report preparation.
- Difficulty identifying duplicate applications.
- Difficulty verifying applicants against official scholarship beneficiary records.
- Limited accountability when multiple personnel manage scholarship records.

As scholarship programs continue to expand, there is a growing need for a centralized system capable of managing applicant information, supporting verification processes, and generating reliable reports.

The proposed system addresses these challenges by providing a centralized scholarship management platform equipped with profiling, reporting, monitoring, and decision support functionalities.

---

# 3. Project Description

The proposed system is a web-based scholarship management platform designed for scholarship applicants, scholarship staff, and system administrators.

Applicants access the public scholarship application page where they complete the required application form and upload the necessary documentary requirements. The system captures applicant information and stores it within a centralized database for processing.

Scholarship Staff are responsible for reviewing submitted applications, validating documentary requirements, verifying applicant information, processing application statuses, and generating reports.

Administrators oversee the entire system by managing users, monitoring activities through audit logs, managing scholarship records, uploading official scholarship beneficiary lists, and generating administrative reports.

A Decision Support component is incorporated into the system to assist scholarship personnel during the verification process. When official qualified scholar lists (such as TES or CHED) are uploaded into the system, submitted applications are automatically compared against these records. If a possible match is detected, the application is flagged for manual review instead of being automatically rejected.

This approach allows the system to provide intelligent recommendations while preserving human decision-making.

---

# 4. General Objective

To develop a **Web-based Scholarship Profiling and Reporting System with Integrated Decision Support** that improves scholarship application management, applicant profiling, verification, monitoring, and reporting through a centralized web platform.

---

# 5. Specific Objectives

The project specifically aims to:

- Develop a web-based scholarship application platform.
- Digitize the collection of scholarship applicant information.
- Centralize applicant profiling records.
- Streamline scholarship application processing.
- Improve the verification of submitted applications.
- Provide efficient monitoring of application progress.
- Generate operational and administrative reports.
- Monitor staff activities through audit logs.
- Assist scholarship personnel by identifying possible duplicate applications or existing scholarship beneficiaries using uploaded official scholarship records.
- Improve transparency, efficiency, and accountability in scholarship administration.

---

# 6. System Users

The system has three primary users.

---

## 6.1 Applicant

Applicants are students who intend to apply for available scholarship programs.

Applicants do not create user accounts or log into the system. Instead, they access the scholarship application page, complete the required application form, upload supporting documents when required, and submit their applications for evaluation.

Applicants can:

- Access the scholarship application page.
- Complete the scholarship application form.
- Provide personal, academic, family, and household information.
- Upload documentary requirements.
- Submit scholarship applications.

---

## 6.2 Staff

Staff members are scholarship office personnel responsible for processing submitted applications.

Their responsibilities include:

- Review submitted applications.
- Verify applicant information.
- Validate uploaded documents.
- Process scholarship applications.
- Review applications categorized initially as "Pending Review" or "Flagged".
- Mark evaluated applications as Accepted or Rejected, providing necessary feedback when an application is rejected.
- Record remarks and observations.
- Review Decision Support recommendations.
- Generate scholarship reports.

---

## 6.3 Administrator

Administrators have full system privileges.

Their responsibilities include:

- Manage Staff accounts (including creating new accounts for staff members).
- Manage system users.
- Upload official scholarship beneficiary records.
- Manage scholarship-related data.
- Monitor system activities.
- Review audit logs.
- Generate administrative reports.
- Maintain overall system configuration.

---

# 7. Decision Support Component

The Decision Support component is designed to assist scholarship personnel during applicant verification.

Rather than automatically determining scholarship eligibility, the system provides supporting information that helps Staff make informed decisions.

One of its primary functions is comparing submitted scholarship applications with uploaded official scholarship records.

These uploaded records may include official qualified scholar lists from scholarship providers such as:

- TES
- CHED
- Other recognized scholarship programs

When the system detects that an applicant appears in one of these uploaded records, it generates a notification and marks the application as "Flagged" for a potential match. All other new applications are marked as "Pending Review".

The Staff reviews the flagged application before making the final decision.

Possible actions include:

- Continue Processing
- Reject the application (providing necessary feedback)
- Request further verification

Possible reasons for rejecting an application include:

- Already a TES beneficiary.
- Already a CHED scholar.
- Duplicate scholarship application.
- Already awarded during the current academic year.
- Other institution-defined reasons.

The Decision Support component functions solely as an assistant and does not replace human judgment.

---

# 8. Scope of the System

The proposed system includes the following major functionalities:

### Scholarship Application

- Public scholarship application form.
- Applicant profiling.
- Submission of scholarship applications.
- Uploading documentary requirements.

### Application Management

- Review submitted applications.
- Verify applicant information.
- Validate documentary requirements.
- Update application status.
- Record remarks.

### Decision Support

- Upload official scholarship beneficiary lists.
- Compare applicants with uploaded beneficiary records.
- Identify possible duplicate applications.
- Flag existing scholarship beneficiaries.
- Provide recommendations for manual verification.

### Reporting

- Generate scholarship reports (accessed via a dedicated Reports dashboard).
- Applicant statistics.
- Scholarship summaries.
- Application status reports.

### Monitoring

- Audit logs.
- Activity monitoring.
- Staff activity history.

### Administration

- User management.
- Scholarship data management.
- Dashboard.
- System monitoring.

---

# 9. System Workflow Overview

### Applicant

1. Access the scholarship application page.
2. Complete the scholarship application form.
3. Upload the required supporting documents.
4. Submit the application.

### Staff

1. Receive submitted applications.
2. Review applicant information.
3. Verify submitted requirements.
4. Review Decision Support recommendations.
5. Evaluate application.
6. Update application status.
7. Record remarks.

### Administrator

1. Upload official qualified scholar records.
2. Manage system users.
3. Monitor system activities.
4. Review audit logs.
5. Generate reports.

---

# 10. Expected Benefits

### For Applicants

- Faster scholarship application process.
- Convenient online application submission.
- Reduced paperwork.
- Organized application records.

### For Scholarship Staff

- Faster verification process.
- Organized applicant management.
- Reduced manual processing.
- Decision Support during applicant evaluation.
- Easier report generation.

### For Administrators

- Centralized scholarship management.
- Complete monitoring through audit logs.
- Improved transparency.
- Better operational reporting.
- Efficient management of scholarship records.

---

# 11. Project Limitations

The following are outside the scope of this project:

- Automatic scholarship approval.
- AI-based scholarship selection.
- Online examinations.
- Interview management.
- Financial disbursement processing.
- Integration with banking systems.
- Mobile application.
- Automatic generation of scholarship criteria.

The system serves as a **Decision Support System**, where all final scholarship decisions remain under the authority of authorized scholarship personnel.

---

# 12. Expected Outcome

Upon completion, the system is expected to provide a centralized, organized, and efficient scholarship management platform capable of improving applicant profiling, application processing, verification, monitoring, reporting, and administrative oversight.

Through its Integrated Decision Support component, the system assists scholarship personnel by identifying potential duplicate applicants and existing scholarship beneficiaries using uploaded official scholarship records. However, all recommendations produced by the system remain subject to human verification and final approval by authorized scholarship staff.

The project ultimately aims to improve operational efficiency, maintain data integrity, strengthen accountability, and promote transparency in the institution's scholarship administration process.
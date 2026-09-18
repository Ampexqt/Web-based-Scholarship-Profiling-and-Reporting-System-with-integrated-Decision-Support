# TES Scholarship Profiling & Reporting System
## Database Structure & Sample Data

### Source Basis

The database structure below is derived from the **TERTIARY EDUCATION SUBSIDY (TES) MASTERLIST – Zamboanga Peninsula Polytechnic State University - Siay Campus - 09107**, Academic Year **2025–2026**, **2nd Semester**. The source contains 72 grantees and the following masterlist fields: sequence, award number, application ID, batch, name, sex, course/program, enrolled year level, contact number, email, address/city/province/ZIP code, PWD status, and disability information. fileciteturn0file0L3-L9

> **Important:** The sample records in this document are synthetic examples for database development. They are not intended to reproduce students' personal contact information.

---

# 1. Recommended Database Structure

For the scholarship profiling and reporting system, the source columns can be organized into a normalized structure instead of storing everything in one large table.

### Main Tables

```text
students
    │
    ├── student_profiles
    │
    ├── scholarship_applications
    │       └── scholarship_awards
    │
    └── disability_records
```

### Table Relationships

```text
students
   1
   │
   └──── 1 student_profiles

students
   1
   │
   └──── N scholarship_applications
                 │
                 └──── 1 scholarship_awards

students
   1
   │
   └──── 0..1 disability_records
```

---

# 2. `students`

Stores the student's basic identity information.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Internal database ID |
| `last_name` | VARCHAR(100) | NOT NULL | Student's surname |
| `first_name` | VARCHAR(100) | NOT NULL | Student's first name |
| `middle_name` | VARCHAR(100) | NULL | Middle name |
| `name_extension` | VARCHAR(20) | NULL | Name extension such as Jr. |
| `sex` | ENUM('MALE','FEMALE') | NOT NULL | Sex recorded in the masterlist |

### Sample Data

| id | last_name | first_name | middle_name | name_extension | sex |
|---:|---|---|---|---|---|
| 1 | SAMPLE | JUAN | DELA CRUZ | NULL | MALE |
| 2 | REYES | MARIA | SANTOS | NULL | FEMALE |
| 3 | GARCIA | CARLO | LIM | JR. | MALE |
| 4 | CRUZ | ANGELICA | RAMOS | NULL | FEMALE |
| 5 | DIZON | MARK | FLORES | NULL | MALE |
| 6 | TORRES | JANELLE | AQUINO | NULL | FEMALE |
| 7 | NAVARRO | KEVIN | TAN | NULL | MALE |
| 8 | MENDOZA | ROSE | VILLAR | NULL | FEMALE |

---

# 3. `student_profiles`

Stores contact and location information appearing in the masterlist.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Profile ID |
| `student_id` | BIGINT | FK → students.id | Student reference |
| `contact_no` | VARCHAR(20) | NULL | Contact number |
| `email` | VARCHAR(255) | NULL | Email address |
| `city` | VARCHAR(100) | NULL | City/municipality |
| `province` | VARCHAR(100) | NULL | Province |
| `zipcode` | VARCHAR(10) | NULL | ZIP code |

### Sample Data

| id | student_id | contact_no | email | city | province | zipcode |
|---:|---:|---|---|---|---|---|
| 1 | 1 | 09171234567 | juan.sample@example.com | ZAMBOANGA | SIBUGAY | 7006 |
| 2 | 2 | 09181234567 | maria.reyes@example.com | ZAMBOANGA | SIBUGAY | 7006 |
| 3 | 3 | 09191234567 | carlo.garcia@example.com | ZAMBOANGA | SIBUGAY | 7008 |
| 4 | 4 | 09201234567 | angelica.cruz@example.com | ZAMBOANGA | ZAMBOANGA DEL SUR | 7000 |
| 5 | 5 | 09211234567 | mark.dizon@example.com | ZAMBOANGA | SIBUGAY | 7040 |
| 6 | 6 | 09221234567 | janelle.torres@example.com | ZAMBOANGA | SIBUGAY | 7006 |
| 7 | 7 | 09231234567 | kevin.navarro@example.com | ZAMBOANGA | SIBUGAY | 7008 |
| 8 | 8 | 09241234567 | rose.mendoza@example.com | ZAMBOANGA | SIBUGAY | 7006 |

---

# 4. `scholarship_applications`

Stores the TES application/masterlist information.

The source identifies **SEQ**, **AWARD NO**, **APP ID**, **BATCH**, **ENROLLED YEAR LEVEL**, and **COURSE/PROGRAM** as part of the masterlist. fileciteturn0file0L7-L11

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Internal application ID |
| `student_id` | BIGINT | FK → students.id | Student reference |
| `sequence_no` | INT | NOT NULL | Masterlist sequence |
| `award_no` | VARCHAR(50) | NOT NULL | TES award number |
| `application_id` | VARCHAR(50) | NOT NULL, UNIQUE | TES application ID |
| `batch` | VARCHAR(30) | NULL | TES batch |
| `academic_year` | VARCHAR(20) | NOT NULL | Academic year |
| `semester` | VARCHAR(20) | NOT NULL | Semester |
| `course_program` | VARCHAR(255) | NOT NULL | Course/program |
| `enrolled_year_level` | TINYINT | NOT NULL | Student's enrolled year |
| `status` | ENUM('PENDING','QUALIFIED','INELIGIBLE') | DEFAULT 'PENDING' | System-level application status |
| `ineligibility_reason` | VARCHAR(255) | NULL | Reason when marked ineligible |

> `status` and `ineligibility_reason` are **system fields proposed for the scholarship profiling system**. They are not columns explicitly shown in the TES PDF.

### Sample Data

| id | student_id | sequence_no | award_no | application_id | batch | academic_year | semester | course_program | enrolled_year_level | status | ineligibility_reason |
|---:|---:|---:|---|---|---|---|---|---|---:|---|---|
| 1 | 1 | 1 | TES-2026-000001 | APP-2026-000001 | 1.1 | 2025-2026 | 2nd | Bachelor of Technology and Livelihood Education Major in Information and Communication Technology | 2 | QUALIFIED | NULL |
| 2 | 2 | 2 | TES-2026-000002 | APP-2026-000002 | 1.1 | 2025-2026 | 2nd | Bachelor of Technical Vocational Teacher Education Major in Mechanical Technology | 2 | QUALIFIED | NULL |
| 3 | 3 | 3 | TES-2026-000003 | APP-2026-000003 | 1.1 | 2025-2026 | 2nd | Bachelor of Industrial Technology Major in Computer Technology | 1 | QUALIFIED | NULL |
| 4 | 4 | 4 | TES-2026-000004 | APP-2026-000004 | 1.1 | 2025-2026 | 2nd | Bachelor of Technology and Livelihood Education Major in Information and Communication Technology | 1 | PENDING | NULL |
| 5 | 5 | 5 | TES-2026-000005 | APP-2026-000005 | 1.1 | 2025-2026 | 2nd | Bachelor of Industrial Technology Major in Electrical Technology | 2 | INELIGIBLE | Already listed as qualified scholar |
| 6 | 6 | 6 | TES-2026-000006 | APP-2026-000006 | 1.1 | 2025-2026 | 2nd | Bachelor of Technical Vocational Teacher Education Major in Food and Service Management | 1 | QUALIFIED | NULL |
| 7 | 7 | 7 | TES-2026-000007 | APP-2026-000007 | 1.1 | 2025-2026 | 2nd | Bachelor of Industrial Technology Major in Mechanical Technology | 3 | PENDING | NULL |
| 8 | 8 | 8 | TES-2026-000008 | APP-2026-000008 | 1.1 | 2025-2026 | 2nd | Bachelor of Industrial Technology Major in Computer Technology | 2 | QUALIFIED | NULL |

---

# 5. `scholarship_awards`

Stores TES award information separately from the application.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Award record ID |
| `application_id` | BIGINT | FK → scholarship_applications.id | Application reference |
| `award_no` | VARCHAR(50) | NOT NULL | TES award number |
| `award_batch` | VARCHAR(30) | NULL | Award batch |
| `award_status` | ENUM('ACTIVE','INACTIVE','CANCELLED') | DEFAULT 'ACTIVE' | Award status |

### Sample Data

| id | application_id | award_no | award_batch | award_status |
|---:|---:|---|---|---|
| 1 | 1 | TES-2026-000001 | 1.1 | ACTIVE |
| 2 | 2 | TES-2026-000002 | 1.1 | ACTIVE |
| 3 | 3 | TES-2026-000003 | 1.1 | ACTIVE |
| 4 | 4 | TES-2026-000004 | 1.1 | ACTIVE |
| 5 | 5 | TES-2026-000005 | 1.1 | CANCELLED |
| 6 | 6 | TES-2026-000006 | 1.1 | ACTIVE |
| 7 | 7 | TES-2026-000007 | 1.1 | ACTIVE |
| 8 | 8 | TES-2026-000008 | 1.1 | ACTIVE |

> This table is a proposed normalized design. The PDF itself presents award information together with the application/masterlist row rather than as a separate table.

---

# 6. `disability_records`

The source contains **PWD** and **DISABILITY** fields. Some records have `YES` with a disability description, while others have `NO` and no disability description. fileciteturn0file0L27-L29

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PK, AUTO_INCREMENT | Disability record ID |
| `student_id` | BIGINT | FK → students.id | Student reference |
| `is_pwd` | BOOLEAN | NOT NULL | Whether the student is recorded as PWD |
| `disability_type` | VARCHAR(150) | NULL | Disability description |

### Sample Data

| id | student_id | is_pwd | disability_type |
|---:|---:|---|---|
| 1 | 1 | FALSE | NULL |
| 2 | 2 | FALSE | NULL |
| 3 | 3 | TRUE | MENTAL/PSYCHOSOCIAL DISABILITY |
| 4 | 4 | FALSE | NULL |
| 5 | 5 | TRUE | LEARNING DISABILITY |
| 6 | 6 | FALSE | NULL |
| 7 | 7 | FALSE | NULL |
| 8 | 8 | TRUE | COMMUNICATION DISABILITY |

The sample disability categories are based on descriptions visible in the source, including **MENTAL/PSYCHOSOCIAL DISABILITY**, **LEARNING DISABILITY**, and **COMMUNICATION DISABILITY**. fileciteturn0file0L52-L59 fileciteturn0file0L141-L149 fileciteturn0file0L1135-L1143

---

# 7. Database Schema Summary

| Table | Purpose | Primary Key | Important Foreign Keys |
|---|---|---|---|
| `students` | Basic student identity | `id` | — |
| `student_profiles` | Contact and address information | `id` | `student_id` |
| `scholarship_applications` | TES application/masterlist data | `id` | `student_id` |
| `scholarship_awards` | TES award records | `id` | `application_id` |
| `disability_records` | PWD/disability information | `id` | `student_id` |

---

# 8. Direct Source-to-Database Mapping

| PDF Column | Database Column | Table |
|---|---|---|
| SEQ | `sequence_no` | `scholarship_applications` |
| AWARD NO | `award_no` | `scholarship_awards` / `scholarship_applications` |
| APP ID | `application_id` | `scholarship_applications` |
| BATCH | `batch` | `scholarship_applications` |
| LAST NAME | `last_name` | `students` |
| FIRST NAME | `first_name` | `students` |
| EXT. NAME | `name_extension` | `students` |
| MIDDLE NAME | `middle_name` | `students` |
| SEX | `sex` | `students` |
| COURSE/PROGRAM | `course_program` | `scholarship_applications` |
| ENROLLED YEAR LEVEL | `enrolled_year_level` | `scholarship_applications` |
| CONTACT NO. | `contact_no` | `student_profiles` |
| EMAIL | `email` | `student_profiles` |
| ADD. CITY | `city` | `student_profiles` |
| PROVINCE | `province` | `student_profiles` |
| ZIPCODE | `zipcode` | `student_profiles` |
| PWD | `is_pwd` | `disability_records` |
| DISABILITY | `disability_type` | `disability_records` |

---

# 9. Source-Level Notes

The uploaded TES masterlist is for **Zamboanga Peninsula Polytechnic State University - Siay Campus - 09107**, Academic Year **2025–2026**, 2nd Semester. fileciteturn0file0L3-L6

The source reports **72 total grantees**. fileciteturn0file0L1207-L1209

The source also shows that the course/program values are long-form program names, including programs under:
- Bachelor of Technology and Livelihood Education
- Bachelor of Technical Vocational Teacher Education
- Bachelor of Industrial Technology

The actual masterlist contains student-specific identifiers and contact information. For development documentation, synthetic sample values are used above instead of reproducing those personal details.

---

# 10. Future System Tables

The following tables may be needed by the complete **Web-based Scholarship Profiling and Reporting System with integrated Decision Support**, but they are **not directly represented as columns in the uploaded TES masterlist**:

```text
users
roles
scholarship_applications
application_documents
qualification_records
ineligibility_records
decision_support_results
audit_logs
qualified_scholar_lists
```

These should be defined separately based on the actual system requirements rather than inferred from the TES masterlist alone.

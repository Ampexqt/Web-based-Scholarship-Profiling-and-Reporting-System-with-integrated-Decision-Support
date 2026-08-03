# RESTful API Documentation

This document outlines the standard RESTful endpoints used by the Web-based Scholarship Profiling and Reporting System. The backend API is built using Node.js, Express (TypeScript), and Prisma, and consumes/produces JSON.

## Base URL

In development, all API requests should be prefixed with:
`http://localhost:5000/api`

---

## 1. System Health

### `GET /health`
Checks if the server and database connections are active.

- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Server and Prisma Database connection are healthy",
    "timestamp": "2026-08-03T15:00:00.000Z"
  }
  ```

---

## 2. Authentication

### `POST /auth/login`
Authenticates a user (admin/staff or applicant) and returns a JWT token.

- **Request Body:**
  ```json
  {
    "email": "admin@zppsu.edu.ph",
    "password": "securepassword"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "USR-123",
      "role": "ADMIN",
      "name": "Admin User"
    }
  }
  ```

---

## 3. Applications

Endpoints for managing scholarship applications.

### `POST /applications`
Submit a new scholarship application.

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** Full application schema (PersonalInfo, AcademicDetails, etc.)
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Application submitted successfully",
    "applicationId": "APP-2026-001"
  }
  ```

### `GET /applications`
Fetch a paginated list of applications (for the Admin Dashboard). Supports filtering by status, college, and course.

- **Query Parameters:** `?page=1&limit=10&status=PENDING&college=CICS`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "APP-2026-0842",
        "name": "Dela Cruz, Juan M.",
        "course": "BS Information Technology",
        "status": "APPROVED"
      }
    ],
    "meta": { "total": 50, "page": 1, "pages": 5 }
  }
  ```

### `PATCH /applications/:id/status`
Update the status of an application (e.g., PENDING -> APPROVED).

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "status": "APPROVED",
    "remarks": "Requirements verified."
  }
  ```

---

## 4. Reports & Exports

Endpoints for generating and downloading official CHED/UniFAST reports.

### `GET /reports/export/annex1`
Generates and downloads the fully populated CHED Annex 1 Excel file.

- **Query Parameters:** `?academicYear=2026-2027&semester=1`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
  - **Content-Type:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - Returns the binary Excel file (blob) populated using `exceljs`.

---

## Standard Error Responses

If a request fails, the API will consistently return a standard error format:

- **Response (4xx / 5xx):**
  ```json
  {
    "success": false,
    "message": "Detailed error message describing what went wrong",
    "errors": [
      { "field": "email", "message": "Invalid email format" } // Included on validation errors
    ]
  }
  ```

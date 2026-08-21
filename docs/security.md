# Security Architecture: Authentication & Authorization

This document details the security architecture for the ZPPSU Scholarship Portal. The system utilizes a stateless, token-based architecture to securely identify users and enforce access controls.

## Overview

We use **JSON Web Tokens (JWT)** as the primary mechanism for authentication and authorization. To maximize security against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF), tokens are stored exclusively in **`HttpOnly` cookies**.

Currently, the primary focus of the system is the **Admin** role, which has full access to the backend operations (Applications, Decision Support, Reports, Audit Logs).

---

## 1. Authentication Strategy

### 1.1 The Token Pair System
To balance security with user experience, we employ a two-token system:

1.  **Access Token:** 
    *   **Lifespan:** Short-lived (e.g., 15 minutes).
    *   **Purpose:** Sent with every API request to prove identity and roles.
    *   **Storage:** `HttpOnly`, `Secure`, `SameSite=Strict` cookie.
2.  **Refresh Token:**
    *   **Lifespan:** Long-lived (e.g., 7 days).
    *   **Purpose:** Used to securely obtain a new Access Token without requiring the user to re-enter credentials.
    *   **Storage:** `HttpOnly`, `Secure`, `SameSite=Strict` cookie (path restricted to the `/api/auth/refresh` endpoint).

### 1.2 Login Flow
1.  **Client** sends `POST /api/auth/login` with `email` and `password`.
2.  **Server** looks up the user by email.
3.  **Server** compares the provided password with the stored hash using `bcrypt`.
4.  Upon success, **Server** generates:
    *   An Access Token (payload: `userId`, `role`).
    *   A Refresh Token (payload: `userId`).
5.  **Server** sets both tokens as `HttpOnly` cookies in the response header and returns a `200 OK`.
6.  **Client** redirects to the `/admin` dashboard.

### 1.3 Logout Flow
1.  **Client** calls `POST /api/auth/logout`.
2.  **Server** invalidates the refresh token (if stored in a database blacklist) and clears both the Access and Refresh cookies by setting their expiration to the past.
3.  **Client** redirects to the `/login` page.

---

## 2. Authorization Strategy (RBAC)

Authorization is implemented via Role-Based Access Control (RBAC). 

### 2.1 Middleware Implementation
API endpoints are protected using Express middleware:

1.  **`authenticateToken` Middleware:**
    *   Reads the Access Token from the request cookies.
    *   Verifies the JWT signature using the server's `JWT_SECRET`.
    *   If valid, attaches the decoded payload to the request (`req.user = decoded`).
    *   If missing, expired, or invalid, returns `401 Unauthorized`.

2.  **`requireRole(roles[])` Middleware:**
    *   Executed after `authenticateToken`.
    *   Checks if `req.user.role` is included in the permitted `roles` array.
    *   If the user has the required role (e.g., `Admin`), the request proceeds to the controller.
    *   If the user does not have the required role, returns `403 Forbidden`.

### 2.2 Role Definitions
*   **Admin:** Full access to all endpoints. Can review applications, run decision support, view reports, view audit logs, and manage system settings.
*   *(Future)* **Staff:** Restricted access (e.g., can only view and evaluate specific applications, cannot view audit logs).

---

## 3. Best Practices & Hardening

In addition to HttpOnly cookies, the following security measures are implemented:

*   **Password Hashing:** All passwords are hashed using `bcrypt` with a salt round of at least 10 before being stored in the database. Plaintext passwords are never logged or stored.
*   **Helmet.js:** The Express server uses Helmet to set secure HTTP headers (e.g., `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy`).
*   **CORS (Cross-Origin Resource Sharing):** CORS is strictly configured to only allow requests from the trusted frontend origin. `credentials: true` must be enabled to allow cookies to be sent.
*   **Rate Limiting:** The `/api/auth/login` endpoint is rate-limited (e.g., max 5 attempts per 15 minutes per IP) to prevent brute-force attacks.
*   **CSRF Protection:** Since we are using cookies, a CSRF protection mechanism (like the Anti-Forgery Token pattern or relying on `SameSite=Strict` if the frontend and backend share a domain/subdomain) should be enforced for mutating requests (`POST`, `PUT`, `DELETE`).

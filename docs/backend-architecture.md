# Backend Architecture Documentation

## Overview

The Web-based Scholarship Profiling and Reporting System utilizes a **Headless / Decoupled** backend architecture. The backend acts strictly as an API (Application Programming Interface), responsible only for business logic, data validation, and database interactions. It does not render any HTML or views for the user; instead, it serves JSON data to be consumed by the independent React frontend.

## Core Technology Stack

- **Runtime Environment:** Node.js
- **Web Framework:** Express.js (v5)
- **Language:** TypeScript
- **Database:** PostgreSQL (Relational Database)
- **ORM (Object-Relational Mapping):** Prisma (For robust, type-safe database querying and schema migrations)

## Directory Structure (Layered Architecture)

The backend follows a classic **Layered (or N-Tier) Architecture** pattern, separating concerns into specific folders to keep the code maintainable and testable.

```
server/
├── prisma/          # Prisma schema definition (schema.prisma) and database migrations
├── src/
│   ├── config/      # Environment variables and third-party service configurations
│   ├── controllers/ # Handles incoming HTTP requests, processes data, and sends HTTP responses
│   ├── middlewares/ # Custom Express middlewares (e.g., authentication, error handling, logging)
│   ├── models/      # Business logic wrappers or specific data manipulation rules (often lean due to Prisma)
│   ├── routes/      # Maps URL endpoints (e.g., `/api/applications`) to their specific controllers
│   ├── services/    # Heavy business logic, external API calls, or complex data formatting (e.g., Excel Export logic)
│   ├── utils/       # Shared helper functions (e.g., date formatters, hashers)
│   ├── app.ts       # Express app setup and middleware registration
│   └── server.ts    # Entry point that starts the HTTP server
├── .env             # Secret environment variables (DB connection string, JWT secrets)
└── package.json     # Backend dependencies and run scripts
```

## Data Flow (How a Request Works)

When the frontend makes a request (e.g., submitting a new scholarship application), the data flows through the backend layers in this order:

1. **Route (`src/routes/`):** Receives the `POST /api/applications` request and forwards it to the correct Controller.
2. **Middleware (`src/middlewares/`):** (Optional) Intercepts the request to verify the user is logged in or to validate the payload structure.
3. **Controller (`src/controllers/`):** Takes the request body, calls the appropriate Service to do the heavy lifting, and responds with a `200 OK` (JSON) or an error code.
4. **Service (`src/services/`):** Contains the core business logic. It uses Prisma to interact with the database.
5. **Prisma ORM (`prisma/`):** Securely translates the Service's instructions into raw SQL and executes it against the PostgreSQL database.

## Architectural Decisions & Benefits

1. **Prisma ORM:** Chosen for its excellent developer experience and auto-generated query builder. It drastically reduces the likelihood of SQL injection attacks and makes schema changes highly predictable through migrations.
2. **Express v5:** A lightweight and highly flexible framework that perfectly suits REST API development without enforcing rigid structures.
3. **Services Layer:** By keeping the heavy logic inside `services/` rather than `controllers/`, the code remains modular. For example, the `exceljs` logic for generating the CHED Annex 1 report will live in a Service, which can then be easily triggered by multiple controllers or scheduled cron jobs.

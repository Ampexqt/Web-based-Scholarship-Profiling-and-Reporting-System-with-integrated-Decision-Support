# Full Application Folder Structure

This document outlines the folder structure for the entire **Web-based Scholarship Profiling and Reporting System with integrated Decision Support**. It includes both the `client` (frontend) and `server` (backend), as well as configuration files at the root level.

---

## 📂 Root Directory

```text
/ (Root)
├── .agents/         # AI agent skills and configuration files for specific automation workflows.
├── .git/            # Git version control metadata folder.
├── client/          # Frontend application (React + Vite + TypeScript).
├── docs/            # Project documentation (Architecture, guidelines, folder structures).
└── server/          # Backend application (Node.js + Express).
```

---

## 🖥️ Client (`/client`)

The frontend is built using **React, Vite, and TypeScript**. It follows a **Feature-based architecture** combined with shared layered components, making it highly scalable and maintainable for a Headless System Design.

```text
client/
├── public/          # Public static assets that do not require processing (e.g., favicon, robots.txt).
├── src/             # Core application source code.
│   ├── assets/      # Static assets imported into components (images, icons, global CSS/SCSS).
│   ├── components/  # Shared/Global UI components used across multiple features (Buttons, Modals, Forms, Layouts).
│   ├── config/      # Application configurations and environment variable exports.
│   ├── features/    # Feature-based modules. This is the core of the scalable architecture.
│   │   ├── auth/         # Everything related to Authentication (Login, Register).
│   │   │   ├── api/      # Feature-specific API request definitions.
│   │   │   ├── components/ # UI components specific only to this feature.
│   │   │   ├── hooks/    # Custom React hooks specific to this feature.
│   │   │   └── types/    # TypeScript interfaces/types for this feature.
│   │   ├── scholarships/ # Everything related to Scholarship Management.
│   │   └── reports/      # Everything related to Reports & Decision Support algorithms.
│   ├── hooks/       # Shared/Global custom React hooks (e.g., useWindowSize, useDebounce).
│   ├── lib/         # Pre-configured third-party library setups (e.g., initialized Axios instance).
│   ├── providers/   # Global React Context providers (Theme provider, Authentication provider).
│   ├── routes/      # Application routing definitions and routing hierarchy (react-router-dom).
│   ├── store/       # Global state management configuration (Zustand stores).
│   ├── types/       # Shared, global TypeScript type definitions.
│   └── utils/       # Shared helper and utility functions (date formatters, validators).
├── index.html       # Main HTML entry point for the Vite application.
├── package.json     # Frontend dependencies and scripts.
├── tsconfig.json    # TypeScript compiler configuration.
└── vite.config.ts   # Vite bundler configuration.
```

---

## ⚙️ Server (`/server`)

The backend is built using **Node.js, Express, and Prisma ORM**. It follows a standard **MVC (Model-View-Controller) / Service Layer architecture**, separating routing, business logic, and database interactions.

```text
server/
├── prisma/          # Prisma ORM configuration.
│   └── schema.prisma # Database schema definitions and models.
├── src/             # Core backend source code.
│   ├── config/      # Configuration files (Database connections, environment variable validation).
│   ├── controllers/ # Request handlers. They process incoming HTTP requests and send responses.
│   ├── middlewares/ # Express middlewares (Authentication, Error handling, Logging).
│   ├── models/      # Data access layer (often overlaps with Prisma, but can contain custom queries).
│   ├── routes/      # API route definitions. Maps endpoints to specific controller functions.
│   ├── services/    # Business logic layer. Controllers call services to perform heavy lifting/DB operations.
│   ├── utils/       # Helper functions, formatters, and shared backend utilities.
│   ├── app.js       # Express application setup (Middlewares, routes registration).
│   └── server.js    # The main entry point that starts the HTTP server.
├── .env             # Backend environment variables (Database URL, Secrets).
└── package.json     # Backend dependencies and scripts.
```

## 🏗️ Design Philosophy

- **Frontend (Client)**: Uses a feature-centric approach. Instead of keeping all components or API calls in massive global folders, each feature (`auth`, `scholarships`) acts as its own self-contained module. Global folders are strictly reserved for things shared *across* the entire application.
- **Backend (Server)**: Uses a layered approach. `Routes` define the endpoints, `Controllers` handle request/response formatting, and `Services` contain the actual complex business logic and database interactions via Prisma.

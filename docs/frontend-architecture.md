# Frontend Architecture Documentation

## Overview

The Web-based Scholarship Profiling and Reporting System utilizes a **Client-Side Rendered (CSR)** architecture. It is built as a **Single Page Application (SPA)**. This approach was selected to provide a highly responsive, desktop-like experience for both the administrative dashboard and the complex student application forms, where instantaneous UI updates are prioritized over Search Engine Optimization (SEO).

## Core Technology Stack

- **Framework:** React 19
- **Build Tool:** Vite (Chosen for instant HMR and optimized production builds)
- **Language:** TypeScript (Ensures type safety, catching errors during development)
- **Routing:** React Router v7 (Handles client-side navigation seamlessly without full page reloads)

## UI and Styling

- **Styling Engine:** Tailwind CSS v4 (Utility-first framework for rapid UI development)
- **Component Library:** shadcn/ui combined with Base UI primitives. This provides a highly customizable, accessible, and premium design system.
- **Icons:** Lucide React
- **Animations:** tw-animate-css (Provides subtle micro-interactions to enhance UX)

## State and Data Management

- **Form Handling:** React Hook Form (Minimizes re-renders and manages complex form state efficiently)
- **Validation:** Zod (Provides strict schema validation, ensuring data integrity before it reaches the backend)
- **Global State:** Zustand (A lightweight and unopinionated state management solution used for global app state)
- **HTTP Client:** Axios (Configured for making secure requests to the backend API)

## Directory Structure (Feature-Sliced Design)

The codebase strictly follows a **Feature-Sliced** organizational pattern. Rather than grouping by file type (e.g., placing all components in one folder and all pages in another), logic is grouped by domain/feature. This makes the system highly modular and scalable.

```
client/src/
├── components/      # Generic, reusable, "dumb" UI components (e.g., buttons, inputs, tables from shadcn)
├── features/        # The core logic, grouped by domain
│   ├── admin/       # Admin dashboard, pages, layouts, and admin-specific components
│   └── application/ # Scholarship application form, steps, schema, and application data
├── hooks/           # Global custom React hooks
├── lib/             # Third-party library configurations and generic utilities (e.g., tailwind `cn` merger)
├── store/           # Zustand global state stores
└── types/           # Global TypeScript type definitions
```

## Architectural Decisions & Benefits

1. **Decoupled Backend:** By using a CSR architecture, the Vite frontend is completely independent of the backend API. This allows the backend to be built in any language and seamlessly reused if a mobile application is developed in the future.
2. **Speed & Responsiveness:** SPAs do not require a round-trip to the server to render a new page. Once the initial JavaScript bundle loads, navigating between the dashboard, reports, and application forms is instantaneous.
3. **Optimized for Internal Tools:** SSR (Server-Side Rendering) adds unnecessary hosting costs and complexity for systems that do not require SEO. A CSR approach is the industry gold standard for authenticated dashboards and application portals.

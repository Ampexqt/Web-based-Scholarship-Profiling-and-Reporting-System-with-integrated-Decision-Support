# Tech Stack Documentation

This document outlines the entire technology stack utilized in the **Web-based Scholarship Profiling and Reporting System with Integrated Decision Support**. The system is divided into a robust Frontend (Client) and Backend (Server), utilizing modern web development tools and libraries.

---

## 🎨 Frontend (Client)

The frontend is built using a modern, scalable feature-based architecture to provide a seamless, Single-Page Application (SPA) experience for both applicants and scholarship staff.

### Core Technologies
- **React (v19)**: The core UI library used for building interactive, component-based user interfaces.
- **TypeScript**: A strongly typed programming language that builds on JavaScript, ensuring type safety and reducing runtime errors.
- **Vite**: A lightning-fast build tool and development server that provides instant server start and Hot Module Replacement (HMR).

### Libraries and Utilities
- **React Router DOM**: Handles all client-side routing, enabling navigation between different views (e.g., Application Form, Staff Dashboard) without reloading the page.
- **Zustand**: A small, fast, and scalable bearbones state management solution used to handle global application state (like user sessions, themes, and temporary data).
- **Axios**: A promise-based HTTP client used to make seamless API requests to the backend server.
- **ESLint**: A pluggable linting utility used to maintain code quality and ensure consistent coding standards across the frontend team.

---

## ⚙️ Backend (Server)

The backend provides a secure, RESTful API layer that handles business logic, data persistence, and the Decision Support verification algorithms.

### Core Technologies
- **Node.js**: The JavaScript runtime environment that executes backend code outside a web browser, providing a scalable network application architecture.
- **Express (v5)**: A fast, unopinionated, minimalist web framework for Node.js, used to build the REST API endpoints and manage middleware (like authentication and error handling).

### Database and ORM
- **PostgreSQL (`pg`)**: The powerful, open-source object-relational database system used to securely store all system data, including applicant profiles, staff accounts, and official scholarship records (like TES/CHED lists).
- **Prisma ORM**: A next-generation Node.js and TypeScript ORM used to interact with the PostgreSQL database. It provides a type-safe database client and manages database schemas and migrations.

### Libraries and Utilities
- **Axios**: Included on the server side to handle server-to-server HTTP requests (useful if the Decision Support system needs to query external government APIs in the future).
- **CORS**: Express middleware used to enable Cross-Origin Resource Sharing, allowing the frontend client to securely communicate with the backend server.
- **Dotenv**: A zero-dependency module that loads environment variables from a `.env` file, ensuring sensitive data like database credentials and secret keys are kept out of the source code.
- **Nodemon**: A development utility that automatically restarts the Node.js application when file changes in the directory are detected.

---

## 🏗️ Architecture Pattern

- **Headless Architecture**: The system completely decouples the frontend presentation layer from the backend logic. They communicate strictly through stateless RESTful API endpoints.
- **Feature-Based Frontend**: Client files are organized by feature (e.g., `features/auth`, `features/scholarships`) rather than by type, improving scalability as the application grows.
- **MVC/Layered Backend**: The server separates concerns by using Routes (to define endpoints), Controllers (to parse requests/responses), and Services (to execute business logic and database queries).

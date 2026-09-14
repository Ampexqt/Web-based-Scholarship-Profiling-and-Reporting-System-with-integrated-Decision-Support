# Web-based Scholarship Profiling and Reporting System with Integrated Decision Support

## 📖 Description and Purpose
This system is designed to streamline the profiling and reporting of scholarship applicants and recipients. It includes an integrated Decision Support System to assist administrators and decision-makers in evaluating applications efficiently, ensuring fairness, and managing scholarship data effectively.

## 💻 System Requirements
Before installing and running the system, please ensure your machine meets the following requirements:
* **Node.js**: Version 18.0 or higher (Required to run the frontend and backend).
* **PostgreSQL**: A running instance of PostgreSQL for the database.
* **Git**: (Optional) For cloning the repository.
* **Web Browser**: A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, etc.).

## 🚀 Installation Guide (Step-by-Step)

Follow these detailed steps to get the system up and running on your local machine.

### Step 1: Download the Project
Extract the downloaded system files to your preferred directory, or if using Git, clone the repository:
```bash
git clone <repository_url>
cd "Web-based Scholarship Profiling and Reporting System with integrated Decision Support"
```

### Step 2: Set Up the Database
1. Open pgAdmin or your PostgreSQL command line.
2. Create a new database named: `scholarship_db` (or any name you prefer, but remember it for the next step).

### Step 3: Configure the Server (Backend)
1. Open your terminal or command prompt.
2. Navigate to the `server` directory:
   ```bash
   cd server
   ```
3. Install the required backend dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file inside the `server` folder. Open it and add your database connection string and server port:
   ```env
   # Replace "postgres" and "your_password" with your actual PostgreSQL credentials
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/scholarship_db?schema=public"
   PORT=5000
   ```
5. Apply the database schema using Prisma. This will create the required tables in your database:
   ```bash
   npx prisma db push
   ```
   *(Note: If you encounter an error or want to reset the database entirely, you can run `npx prisma db push --force-reset`)*.
6. Seed the database with initial data (like locations and the default Admin user):
   ```bash
   npx prisma db seed
   ```

### Step 4: Configure the Client (Frontend)
1. Open a **new** terminal window (keep the server terminal open).
2. Navigate to the `client` directory from the main project folder:
   ```bash
   cd client
   ```
3. Install the required frontend dependencies:
   ```bash
   npm install
   ```

## ⚙️ Running the System

To run the application, you need to start both the server and the client simultaneously in two separate terminal windows.

**Terminal 1: Start the Server**
```bash
cd server
npm run dev
```

**Terminal 2: Start the Client**
```bash
cd client
npm run dev
```

Once both the client and server are running, open your web browser and navigate to the local URL provided by the client terminal (usually `http://localhost:5173`).

## 🛠️ Technology Stack
* **Frontend**: React.js, Vite, Tailwind CSS, shadcn/ui
* **Backend**: Node.js, Express.js, TypeScript
* **Database**: PostgreSQL, Prisma ORM

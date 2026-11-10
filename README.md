# 🎓 EduTrack — MERN Student Management System

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v4-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Compass%20Local%20%2F%20Atlas-brightgreen.svg)](https://www.mongodb.com/products/compass)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Bearer-orange.svg)](https://jwt.io/)

A comprehensive, production-grade **MERN (MongoDB, Express.js, React 19, Node.js)** Student Information & Academic Management System. Built with **MongoDB Compass** local database support, stateless **JWT Authentication**, strict **Role-Based Access Control (Admin vs. Faculty)**, an interactive **Daily Attendance Register**, a persistent **Multi-Day Attendance History Matrix**, continuous **Academic Grading & Credit-Weighted CGPA Calculation**, automated **At-Risk Early Warnings**, and an informative public **Institutional Landing Page**.

---

## 📑 Table of Contents
1. [🌟 Key Features](#-key-features)
2. [🏗️ System Architecture](#️-system-architecture)
3. [📋 Prerequisites](#-prerequisites)
4. [🛠️ Step-by-Step Installation & Setup](#️-step-by-step-installation--setup)
5. [🧭 MongoDB Compass Configuration](#-mongodb-compass-configuration)
6. [🔑 Pre-Seeded Demo Accounts](#-pre-seeded-demo-accounts)
7. [🎯 How to Use the Application](#-how-to-use-the-application)
8. [📡 Complete REST API Reference](#-complete-rest-api-reference)
9. [📂 Project Directory Structure](#-project-directory-structure)
10. [🛡️ Role-Based Access Control (RBAC) Matrix](#️-role-based-access-control-rbac-matrix)

---

## 🌟 Key Features

### 🌐 1. Public Institutional Landing Page (`/` or `/landing`)
- **Modern Institutional Showcase:** Welcome hero section introducing the university platform, core pillars, and architecture.
- **1-Click Demo Login Bar:** Quick-fill credentials for **Admin** (`admin@university.edu`) and **Faculty** (`prof.sarah@university.edu`).
- **Live System Telemetry:** Visual indicator showing local MongoDB Compass connectivity on port 27017.
- **Module Highlights:** Feature cards for Analytics, Attendance, Grading, Early Warnings, Fee Clearance, and Security.

### 📅 2. Attendance Engine: Daily Register & Historical Matrix (`/attendance`)
- **Dual-View Modes:**
  1. **Previous Attendance of All Students (History Matrix):**
     - Queries all past attendance sessions stored in MongoDB across all students.
     - Student rows on the Y-axis and individual past dates (e.g. `2026-11-04`, `2026-11-03`, `2026-11-02`...) along the X-axis.
     - Color-coded attendance pills: **`P`** (Present - Green), **`A`** (Absent - Red), **`L`** (Late - Amber), and **`-`** (Not Scheduled).
     - Individual and class-level summary statistics: **Total Classes**, **Present Count**, **Absent Count**, **Late Count**, and **Cumulative %**.
     - **Export Complete Attendance Report (CSV)** for official record-keeping.
  2. **Mark Daily Attendance:**
     - Date-picker with a one-click **"Sync Today"** button synced to the local system date.
     - One-click **"Mark All Present"** and **"Mark All Absent"** bulk toggles.
     - Interactive tri-state toggle per student with an optional remarks field (e.g., *"Medical excuse"*).
     - Submitting immediately writes records to MongoDB and recalculates each student's attendance percentage:
       $$\text{Attendance Rate} = \min\left(100, \text{round}\left(\frac{\text{Present} + (\text{Late} \times 0.5)}{\text{Total Classes}} \times 100\right)\right)$$

### 📝 3. Academic Evaluations & Dynamic CGPA Calculation
- **Continuous Evaluation Modal:** Faculty and Admins can add or update subject grades:
  - Subject Code (e.g. `CS601`)
  - Subject Title (e.g. `Cloud Computing`)
  - Marks Obtained (`0 - 100`)
  - Course Credits (`1 - 6`)
- **Automated Grade & Point Mapping:** Automatically maps marks to letter grades ($A+$, $A$, $B+$, $B$, $C$, $D$, $F$) and computes points.
- **Dynamic CGPA Formula:** Recomputes cumulative CGPA across all evaluated subjects weighted by credit hours:
  $$\text{CGPA} = \frac{\sum (\text{Grade Points}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$$
- **Semester Transcript View:** Displayed directly within the student profile.

### ⚠️ 4. At-Risk Early Warning System
- Real-time institutional monitoring that automatically flags students with:
  1. **Attendance Shortage:** Attendance rate $< 75\%$
  2. **Academic Probation:** Cumulative CGPA $< 6.0$
- Warning alerts surfaced on the **Overview Dashboard** and with warning badges in the **Student Directory**.

### 💵 5. Fee Clearance & Financial Tracking
- Categorizes and tracks fee clearance status: `Paid` (Emerald), `Pending` (Amber), `Partial` (Indigo), `Overdue` (Rose).
- Filter directory records directly by fee status.

### 👥 6. Full Student Directory & CRUD (`/students`)
- **Search & Multi-Filtering:** Live debounced search across Roll No, Name, and Email, filtered by Department, Semester (1-8), Status, and Fee Status.
- **Export to CSV:** One-click spreadsheet download formatted with dates and student data.
- **Profile Inspector:** Modal displaying full academic history, contact card, guardian info, and enrollment timestamps.

### 🔐 7. Stateless JWT Authentication & Role-Based Access Control
- Passwords salted and hashed with **Bcrypt.js** (10 salt rounds).
- Stateless **JWT tokens** attached automatically via Axios request interceptors.
- Role-enforced routes protecting student deletion (**Admin only**, returning `HTTP 403 Forbidden` for faculty).

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React 19 + Vite Frontend                        │
│  - Public Landing Page (/)                                             │
│  - Dashboard (/dashboard), Directory (/students), Attendance Register  │
│  - AuthContext (JWT State & LocalStorage persistence)                  │
│  - Axios Interceptor (Auto-attaches "Authorization: Bearer <token>")   │
│  - Tailwind CSS Styling & Lucide Icons                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON Requests
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Express.js + Node.js Backend                      │
│  - Port 5000: http://localhost:5000                                    │
│  - CORS Middleware: Allows Vite React frontend on port 5173            │
│  - JWT Middleware (protects routes, decodes token, mounts req.user)    │
│  - Role Middleware (authorizes 'admin' vs 'faculty')                   │
│  - Attendance History & Matrix Engine                                  │
│  - Centralized Error Handler (Code 11000 duplicate keys, CastErrors)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Mongoose ODM (Port 27017)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Database Engine (MongoDB Compass)                    │
│  - Connection URI: mongodb://127.0.0.1:27017/student_management        │
│  - Collection 'users': Admin & Faculty credentials with bcrypt hashes  │
│  - Collection 'students': Student bios, grades[], attendanceRecords[]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 Prerequisites

Before setting up the project, make sure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher ([Download Node.js](https://nodejs.org/))
- **npm**: v9.0.0 or higher (packaged with Node.js)
- **MongoDB Compass & MongoDB Community Server**:
  - Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community) (ensuring *"Install MongoDB as a Service"* is checked).
  - Download and install [MongoDB Compass](https://www.mongodb.com/products/compass).
- **Git**: Installed and configured on your machine ([Download Git](https://git-scm.com/)).

---

## 🛠️ Step-by-Step Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/pranavb04/EduTrack.git
cd EduTrack
```

---

### 2. Configure MongoDB Compass
1. Open **MongoDB Compass**.
2. In the **New Connection** bar, enter the connection URI:
   ```text
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.

> **💡 Troubleshooting (`ECONNREFUSED`):**
> If Compass reports a connection error on port `27017`:
> - Press <kbd>Win</kbd> + <kbd>R</kbd>, type `services.msc`, and press Enter.
> - Locate **MongoDB Server** (or **MongoDB Database Server**) in the services list.
> - Right-click and choose **Start** (or **Restart**).
> - In Compass, click **Connect** again.

---

### 3. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Verify your environment variables in `backend/.env` (or copy from `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://127.0.0.1:27017/student_management
   JWT_SECRET=mern_student_mgmt_jwt_secret_key_super_secure_2026
   JWT_EXPIRE=7d
   ```
4. **Seed initial demo data into MongoDB:**
   ```bash
   npm run seed
   ```
   *(This populates demo Admin & Faculty accounts and 6+ realistic student records with grades and multi-day attendance into your local MongoDB Compass).*

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API server will run at `http://localhost:5000`.*

---

### 4. Frontend Setup
1. Open a second terminal window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔑 Pre-Seeded Demo Accounts

You can log in manually or click the **"Admin"** / **"Faculty"** autofill buttons on the login screen:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@university.edu` | `password123` | Master control: CRUD, Deletions, Attendance, Evaluations, Analytics |
| **Faculty Member**| `prof.sarah@university.edu`| `password123` | Academic rights: Attendance registers, Subject evaluations, Profiles |

---

## 🎯 How to Use the Application

1. **Visit the Landing Page (`http://localhost:5173`):**
   - Explore institutional features, system architecture, and test credentials.
   - Click **"Sign In to Portal"** to open the login screen.
2. **Explore Analytics (`/dashboard`):**
   - Review live metric cards, department enrollment distribution, and the **At-Risk Alert banner**.
3. **Manage Students (`/students`):**
   - Filter by branch, semester, fee status, or search by name.
   - Click **"+ Enroll Student"** to add a new student.
   - Click the **Eye icon** to inspect transcripts and attendance logs.
   - Click **"Export CSV"** to download an Excel-ready roster.
4. **Track Attendance (`/attendance`):**
   - Click the **"Previous Attendance (All Students)"** tab to view the complete date-matrix of past attendance recorded in MongoDB.
   - Switch to **"Mark Daily Attendance"**, select department/semester, click **"Mark All Present"**, and submit to MongoDB.
5. **Evaluate Academic Grades:**
   - In the student directory or profile modal, click **"Academic Evaluation"** / the **Award icon**.
   - Enter subject code, title, marks (`0-100`), and course credits. The letter grade and cumulative CGPA update automatically.

---

## 📡 Complete REST API Reference

### 🔐 Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Admin or Faculty | `{ name, email, password, role }` |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT token | `{ email, password }` |
| `GET` | `/api/auth/me` | Protected (`Bearer`) | Fetch current logged-in user profile | *None* |

### 📅 Attendance Endpoints (`/api/attendance`)
*(All require `Authorization: Bearer <token>`)*
| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/attendance/history-all` | **Query multi-day attendance history matrix for all students from MongoDB** | `?department=CS&semester=6&search=aarav` |
| `GET` | `/api/attendance/class` | Get class roster with attendance status for a date | `?date=2026-11-04&department=CS&semester=6` |
| `POST` | `/api/attendance/mark-bulk` | Record daily attendance and recompute attendance rates | `{ date, department, semester, records: [{ studentId, status, remarks }] }` |
| `GET` | `/api/attendance/student/:id` | Fetch chronological attendance history for a single student | `:id` (MongoDB ObjectId) |

### 🎓 Student & Evaluation Endpoints (`/api/students`)
*(All require `Authorization: Bearer <token>`)*
| Method | Endpoint | Description | Query / Body Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/students` | Paginated student listing with multi-filtering | `?search=...&department=...&semester=...&status=...&feeStatus=...&page=1&limit=10` |
| `GET` | `/api/students/stats` | Institutional KPI metrics (averages, distributions, top performers) | *None* |
| `GET` | `/api/students/at-risk` | Query at-risk students (Attendance $<75\%$ or CGPA $<6.0$) | *None* |
| `GET` | `/api/students/:id` | Fetch complete profile of a single student | `:id` (MongoDB ObjectId) |
| `POST` | `/api/students` | Enroll a new student | Full student JSON object |
| `PUT` | `/api/students/:id` | Update existing student record | Fields to update |
| `POST` | `/api/students/:id/grades`| Record subject evaluation and recompute CGPA | `{ subjectCode, subjectName, marks, credits, semester }` |
| `DELETE`| `/api/students/:id` | Permanently delete student (**Admin Only — 403 for Faculty**) | `:id` (MongoDB ObjectId) |
| `POST` | `/api/students/seed` | Seed demo data with grades and attendance into MongoDB Compass | *None* |

---

## 📂 Project Directory Structure

```
EduTrack/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Compass connection handler
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, token generation
│   │   ├── studentController.js  # CRUD, Search, Filters, Stats, Grades, Seed
│   │   └── attendanceController.js# Daily marking & multi-day history matrix
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT Bearer verification & role authorization
│   │   └── errorMiddleware.js    # Custom 404 & Centralized Error Handler
│   ├── models/
│   │   ├── User.js               # Admin / Faculty schema & bcrypt hashing
│   │   └── Student.js            # Comprehensive student, grades & attendance schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── studentRoutes.js      # /api/students routes
│   │   └── attendanceRoutes.js   # /api/attendance routes
│   ├── utils/
│   │   └── seeder.js             # Standalone CLI database seeder
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment template
│   ├── server.js                 # Express server bootstrap & CORS
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navbar with user pill & logout
│   │   │   ├── Sidebar.jsx           # Sidebar navigation & role badge
│   │   │   ├── StatCard.jsx          # Reusable KPI metric card
│   │   │   ├── StudentModal.jsx      # Add & Edit Student modal with validation
│   │   │   ├── StudentViewModal.jsx  # Student detailed profile inspector
│   │   │   ├── GradeModal.jsx        # Subject evaluation & CGPA modal
│   │   │   ├── DeleteConfirmModal.jsx# Delete confirmation dialog
│   │   │   └── ProtectedRoute.jsx    # React Router JWT guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Global Auth state, Login, Register, Logout
│   │   ├── pages/
│   │   │   ├── Landing.jsx           # Public institutional landing page
│   │   │   ├── Login.jsx             # Login with 1-click Demo Autofill
│   │   │   ├── Register.jsx          # Staff registration form
│   │   │   ├── Dashboard.jsx         # KPI metrics, Dept bars, At-Risk alert
│   │   │   ├── Students.jsx          # Student table, search, filters, CSV export
│   │   │   └── Attendance.jsx        # Daily register & All Students history matrix
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with Bearer JWT interceptor
│   │   ├── App.jsx                   # Master router & modal state manager
│   │   └── index.css                 # Tailwind CSS styles
│   ├── vite.config.js                # Vite build config with Tailwind
│   └── package.json
│
├── .gitignore                    # Root gitignore (ignores node_modules, .env)
├── SYSTEM_EXPLANATION_AND_WORKING.md # In-depth technical architecture guide
└── README.md                     # Comprehensive project documentation
```

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

| Feature / Action | Administrator (`admin`) | Faculty Member (`faculty`) |
| :--- | :---: | :---: |
| View Public Landing Page | ✅ | ✅ |
| Portal Login & JWT Authentication | ✅ | ✅ |
| Analytics Overview Dashboard | ✅ | ✅ |
| View Student Directory & Full Profiles | ✅ | ✅ |
| Export Student Directory to CSV | ✅ | ✅ |
| Mark Daily Class Attendance | ✅ | ✅ |
| View Previous Attendance History Matrix | ✅ | ✅ |
| Export Attendance Report to CSV | ✅ | ✅ |
| Input Subject Marks & Recalculate CGPA | ✅ | ✅ |
| View At-Risk Student Alerts | ✅ | ✅ |
| Enroll New Students | ✅ | ✅ |
| Update Student Information | ✅ | ✅ |
| **Permanently Delete Student Record** | ✅ **Allowed** | ❌ **Restricted (403 Forbidden)** |

---

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

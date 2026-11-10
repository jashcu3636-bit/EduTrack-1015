# 📘 MERN Student Management System — Architecture & Working Guide (Enterprise Edition)

## 1. Executive Summary

The **EduTrack MERN Student Management System** is a full-stack, enterprise-grade educational web application designed for universities and colleges. Built on the modern **MERN** technology stack (**M**ongoDB, **E**xpress.js, **R**eact.js 19, and **N**ode.js), it integrates directly with **MongoDB Compass** for persistent NoSQL data storage.

Key highlights include:
1. **Public Institutional Landing Page**: Introduces visitors and staff to the platform, architecture, and feature modules with interactive 1-click demo login options.
2. **Previous Attendance of All Students (Date-Matrix Engine)**: Stores and retrieves complete multi-day attendance records from MongoDB, displaying student logs across dates with Present, Absent, and Late indicators.
3. **Daily Class Attendance Register**: Fast daily attendance recording with automated attendance rate recalculation.
4. **Academic Grading & Dynamic CGPA Calculator**: Continuous evaluation entry with weighted credit calculations.
5. **At-Risk Student Monitoring**: Proactive flagging of students below 75% attendance or 6.0 CGPA.
6. **JWT Stateless Authentication & RBAC**: Decoupled Bearer token security with Admin and Faculty role tiers.

---

## 2. Multi-Day Attendance Storage in MongoDB

Each student document in the `students` collection in MongoDB stores an array of historical attendance entries:

```json
{
  "_id": "6aea706b83699a18f2cc700f",
  "studentId": "AI2024-042",
  "firstName": "Rohan",
  "lastName": "Verma",
  "department": "Data Science & AI",
  "semester": 6,
  "attendanceRate": 100,
  "attendanceRecords": [
    { "date": "2026-11-04", "status": "Present" },
    { "date": "2026-11-03", "status": "Present" },
    { "date": "2026-11-02", "status": "Present" },
    { "date": "2026-11-01", "status": "Present" },
    { "date": "2026-10-31", "status": "Present" }
  ]
}
```

### Attendance History Matrix API (`GET /api/attendance/history-all`)
The server aggregates all distinct dates recorded across students and constructs an $N \times M$ matrix:
- **Y-Axis**: All enrolled students (filtered by department or semester)
- **X-Axis**: All distinct past class session dates
- **Cells**: Status badges (`P`, `A`, `L`, `-`) with counts of Present, Absent, and Late sessions.
- **Export**: Can be downloaded as a CSV file with one click.

---

## 3. Public Institutional Landing Page (`/` or `/landing`)

The landing page provides comprehensive information about the educational ERP:
- **Hero Section**: Introduces the system's purpose and architecture.
- **Quick Demo Autofill Box**: Direct access to Admin (`admin@university.edu`) and Faculty (`prof.sarah@university.edu`) test credentials.
- **System Telemetry Card**: Live connection indicator to MongoDB Compass on port 27017.
- **Module Grid**: Explains the 6 core pillars: Analytics Dashboard, Daily Attendance, Gradebook, At-Risk Early Warning, Student Directory, and JWT Security.
- **Tech Stack Overview**: Details MERN components (MongoDB Compass, Express.js 4, React 19, Node.js 20).
- **Navigation Controls**: Smooth navigation to Portal Sign In, Staff Registration, or Dashboard.

---

## 4. How to View Previous Attendance in MongoDB Compass & Web App

### In the Web Application:
1. Open [http://localhost:5173](http://localhost:5173) to see the **Landing Page**.
2. Click **"Sign In to Portal"** and log in as Faculty or Admin.
3. Click **"Daily Attendance"** in the left sidebar.
4. Select the **"Previous Attendance (All Students)"** tab.
5. You will see:
   - Summary cards: Recorded Sessions in MongoDB, Average Attendance Rate, and Attendance Shortages.
   - The interactive date-by-date matrix showing previous attendance for each student.
   - Click **"Export Report (CSV)"** to download the complete spreadsheet.

### In MongoDB Compass:
1. Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`.
2. Open database `student_management` -> collection `students`.
3. Expand any student document and click on `attendanceRecords` to see each recorded date and status.

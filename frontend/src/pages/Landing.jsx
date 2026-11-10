import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Shield,
  Database,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Layers,
  BookOpen,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  LogIn,
  UserPlus,
} from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-100">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                EduTrack <span className="text-indigo-600">MERN</span>
              </span>
              <span className="hidden sm:inline-block ml-2 rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 border border-indigo-100">
                v2.0 Education
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#attendance" className="hover:text-indigo-600 transition-colors">Attendance & Grades</a>
            <a href="#architecture" className="hover:text-indigo-600 transition-colors">Tech Architecture</a>
            <a href="#database" className="hover:text-indigo-600 transition-colors">MongoDB Compass</a>
          </nav>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                <span>Go to Dashboard ({user?.role})</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Register</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                <span>MERN Full-Stack Educational System</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Modern Student Information & Academic Management Portal
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
                A unified, enterprise-grade educational platform built with <strong>React 19</strong>, <strong>Express.js</strong>, <strong>Node.js</strong>, and <strong>MongoDB Compass</strong>. Empowering university faculty and administration to manage enrollments, track daily and historical attendance, evaluate subject grades, and monitor institutional metrics with robust <strong>JWT authentication</strong>.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/login'}
                  className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:scale-[1.02]"
                >
                  <span>{isAuthenticated ? 'Open Dashboard' : 'Sign In to Portal'}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href="#features"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                >
                  Explore Capabilities
                </a>
              </div>

              {/* Quick Credentials Info Box */}
              <div className="pt-4">
                <div className="inline-block w-full max-w-lg rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm text-left">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-indigo-900 flex items-center space-x-1.5">
                      <Lock className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Pre-Seeded Demo Credentials</span>
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">Stored in MongoDB</span>
                  </div>
                  <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="rounded-lg bg-indigo-50/70 p-2 border border-indigo-100/60">
                      <span className="font-bold text-indigo-900 block">👑 Admin (Full Access)</span>
                      <span className="text-slate-600">admin@university.edu</span>
                      <span className="block text-slate-400">pass: password123</span>
                    </div>
                    <div className="rounded-lg bg-emerald-50/70 p-2 border border-emerald-100/60">
                      <span className="font-bold text-emerald-900 block">🎓 Faculty (Attendance & Grades)</span>
                      <span className="text-slate-600">prof.sarah@university.edu</span>
                      <span className="block text-slate-400">pass: password123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Live System Overview Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                      <LayoutDashboard className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">System Telemetry</h4>
                      <p className="text-[10px] text-slate-400">Live MongoDB connection</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>MongoDB Active</span>
                  </span>
                </div>

                {/* Micro Stat Cards */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">JWT Security</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">Role-Based (RBAC)</p>
                    <span className="text-[10px] text-indigo-600">Admin vs Faculty</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Attendance Engine</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">Date Matrix Logs</p>
                    <span className="text-[10px] text-emerald-600">Past History in Mongo</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Evaluation</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">Dynamic CGPA</p>
                    <span className="text-[10px] text-amber-600">Credit Weighted</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Early Warning</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">At-Risk Alerts</p>
                    <span className="text-[10px] text-rose-600">&lt; 75% Attendance</span>
                  </div>
                </div>

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 text-xs">
                  <div className="flex items-center space-x-2 text-indigo-900 font-semibold mb-1">
                    <Database className="h-4 w-4 text-indigo-600" />
                    <span>MongoDB Compass Database</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    mongodb://127.0.0.1:27017/student_management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Section */}
      <section id="features" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Comprehensive Suite of Educational Management Features
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Engineered from the ground up to address all requirements of students, faculty, and academic administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Institutional Analytics Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Live aggregations displaying total enrollments, active student ratios, institutional average CGPA, and department distribution bars.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-100">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Daily Attendance & Historical Logs</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Mark daily attendance (Present, Absent, Late) with one-click bulk toggles. Inspect previous attendance of all students across past dates directly from MongoDB.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-md shadow-amber-100">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Academic Grading & Dynamic CGPA</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add subject exam marks, automatic letter-grade derivation (A+, A, B+, B, C, F), and weighted credit CGPA calculations updated instantly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-100">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">At-Risk Student Early Warning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automated detection and visual alerts for students with attendance shortages (&lt;75%) or academic probation (&lt;6.0 CGPA) so faculty can intervene early.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-100">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Student Directory & CSV Exports</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant debounced search across Roll No, Name, and Email. Multi-dropdown filtering by branch, semester, and fee clearance with one-click Excel CSV download.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm hover:shadow-md transition-all space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white shadow-md shadow-slate-200">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">JWT Authentication & RBAC</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stateless token authentication with Bcrypt password hashing. Enforces role restrictions preventing faculty from deleting records while granting academic rights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Attendance & Grading Deep Dive Section */}
      <section id="attendance" className="py-16 lg:py-24 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Attendance & Grading Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Persistent Multi-Day Attendance & Automated Transcripts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                EduTrack stores each student's daily attendance records in MongoDB. The system calculates attendance percentages automatically and provides a complete historical date matrix:
              </p>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Date Matrix Inspection:</strong> View past dates along the table columns with green (Present), red (Absent), and amber (Late) indicators.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Automated Percentage Calculation:</strong> Attendance percentage recalculates on every submission: <code className="font-mono text-indigo-700">(Present + Late * 0.5) / Total Days * 100</code>.</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Academic Transcripts:</strong> Input semester course codes, titles, marks (0-100), and credits to immediately compute the cumulative CGPA.</span>
                </li>
              </ul>
            </div>

            {/* Visual Example Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Attendance Log View Sample</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono">Live in Mongo</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">Aarav Sharma</span>
                    <span className="text-slate-400 block text-[10px]">CS2024-001 • Sem 6</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Nov 4: P</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Nov 3: P</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Nov 2: L</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Nov 1: P</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <div>
                    <span className="font-bold text-slate-800">Dev Kapoor</span>
                    <span className="text-slate-400 block text-[10px]">ME2024-071 • Sem 4</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Nov 4: A</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Nov 3: A</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Nov 2: P</span>
                    <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">Nov 1: A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Architecture Section */}
      <section id="architecture" className="py-16 lg:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Technology Stack
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Modern Full-Stack MERN Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Integrating modern industry standards across frontend, backend, and database layers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center space-y-2">
              <span className="text-2xl font-black text-indigo-600">M</span>
              <h4 className="text-sm font-bold text-slate-900">MongoDB Compass</h4>
              <p className="text-[11px] text-slate-500">
                Local NoSQL document database running on port 27017 with live graphical visualization.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center space-y-2">
              <span className="text-2xl font-black text-indigo-600">E</span>
              <h4 className="text-sm font-bold text-slate-900">Express.js 4</h4>
              <p className="text-[11px] text-slate-500">
                RESTful API routing with centralized error middleware, CORS headers, and JWT verification.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center space-y-2">
              <span className="text-2xl font-black text-indigo-600">R</span>
              <h4 className="text-sm font-bold text-slate-900">React.js 19 + Vite</h4>
              <p className="text-[11px] text-slate-500">
                High-performance component trees, AuthContext state, Axios interceptors, and Tailwind CSS.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 text-center space-y-2">
              <span className="text-2xl font-black text-indigo-600">N</span>
              <h4 className="text-sm font-bold text-slate-900">Node.js 20</h4>
              <p className="text-[11px] text-slate-500">
                Asynchronous event-driven JavaScript runtime powering the server and seeder scripts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400 py-10 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold text-white">
              EduTrack MERN Student Management System
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Educational Full-Stack MERN Project • Built for Academic Student Management
          </p>

          <div className="flex items-center space-x-3 text-xs">
            <Link to="/login" className="hover:text-white transition-colors">Portal Login</Link>
            <span>•</span>
            <Link to="/register" className="hover:text-white transition-colors">Faculty Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


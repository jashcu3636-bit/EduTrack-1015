import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserPlus,
  Database,
  Sparkles,
  Shield,
  GraduationCap,
} from 'lucide-react';

const Sidebar = ({ onOpenAddModal, onSeedDemo }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <aside className="hidden w-64 flex-shrink-0 flex-col justify-between border-r border-slate-200 bg-white p-4 md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Role Card */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3 flex items-center space-x-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
              isAdmin
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {isAdmin ? <Shield className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-slate-800">{user?.name || 'Academic User'}</p>
            <span
              className={`inline-block text-[10px] font-semibold uppercase tracking-wider ${
                isAdmin ? 'text-indigo-600' : 'text-emerald-600'
              }`}
            >
              {isAdmin ? 'System Administrator' : 'Faculty Member'}
            </span>
          </div>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Navigation
          </p>
          <nav className="mt-3 space-y-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Overview & Analytics</span>
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Users className="h-4 w-4" />
              <span>Student Directory</span>
            </NavLink>

            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                `flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Calendar className="h-4 w-4" />
              <span>Daily Attendance</span>
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Faculty & Admin Tools
          </p>
          <div className="mt-3 space-y-2">
            <button
              onClick={onOpenAddModal}
              className="flex w-full items-center space-x-2.5 rounded-lg bg-indigo-600 px-3.5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Enroll New Student</span>
            </button>

            {onSeedDemo && (
              <button
                onClick={onSeedDemo}
                className="flex w-full items-center space-x-2.5 rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 px-3.5 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                title="Populates realistic student records instantly"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Seed Sample Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Database Connection Status Card */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
          <Database className="h-4 w-4 text-emerald-600" />
          <span>MongoDB Compass Active</span>
        </div>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
          Database: <code className="font-mono text-indigo-600">student_management</code>
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

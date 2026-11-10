import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogOut, Shield, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur transition-all">
      <Link to="/dashboard" className="flex items-center space-x-3 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800">
            EduTrack <span className="text-indigo-600">MERN</span>
          </h1>
          <p className="hidden text-xs text-slate-500 sm:block">
            Student Information & Academic Management System
          </p>
        </div>
      </Link>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Quick Link to Landing Page */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          title="View Public App Landing Page"
        >
          <ExternalLink className="h-3.5 w-3.5 text-indigo-600" />
          <span className="hidden md:inline">Landing Page</span>
        </Link>

        {user && (
          <div className="flex items-center space-x-3 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-4 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs">
              {user.name ? user.name.slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="text-left leading-tight hidden md:block">
              <p className="text-xs font-semibold text-slate-800">{user.name}</p>
              <div className="flex items-center space-x-1 text-[11px] text-slate-500">
                <Shield className="h-3 w-3 text-indigo-500" />
                <span className="capitalize">{user.role || 'Admin'}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center space-x-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors"
          title="Sign out of system"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

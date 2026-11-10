import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import {
  Users,
  UserCheck,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Building,
  AlertTriangle,
  Calendar,
} from 'lucide-react';

const Dashboard = ({ onOpenAddModal, onSeedDemo }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [atRiskList, setAtRiskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [resStats, resAtRisk] = await Promise.all([
        studentAPI.getStats(),
        studentAPI.getAtRisk(),
      ]);

      if (resStats.data.success) {
        setStats(resStats.data.stats);
      }
      if (resAtRisk.data.success) {
        setAtRiskList(resAtRisk.data.students);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load statistical overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-xs text-slate-500 font-medium">Aggregating student analytics...</p>
        </div>
      </div>
    );
  }

  const departmentMax = stats?.departmentBreakdown?.reduce(
    (max, item) => Math.max(max, item.count),
    1
  ) || 1;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-6 text-white shadow-lg shadow-indigo-100 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Welcome, {user?.name} ({user?.role?.toUpperCase()})</span>
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            Academic Performance & Attendance Portal
          </h2>
          <p className="mt-1 text-xs text-indigo-100 max-w-xl">
            Real-time analytics on attendance, course evaluations, fee clearance, and departmental distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/attendance"
            className="flex items-center space-x-1.5 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Mark Attendance</span>
          </Link>
          <button
            onClick={onOpenAddModal}
            className="rounded-xl border border-white/40 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            + Enroll Student
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Enrollments"
          value={stats?.totalStudents || 0}
          subtitle="Registered in MongoDB"
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Active Students"
          value={stats?.activeStudents || 0}
          subtitle={`${stats?.totalStudents ? Math.round((stats.activeStudents / stats.totalStudents) * 100) : 0}% of all records`}
          icon={UserCheck}
          color="emerald"
        />
        <StatCard
          title="Average CGPA"
          value={stats?.avgCgpa ? stats.avgCgpa.toFixed(2) : '0.00'}
          subtitle="Scale of 10.0"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Class Attendance"
          value={`${stats?.avgAttendance || 0}%`}
          subtitle="Institutional average"
          icon={Clock}
          color="violet"
        />
      </div>

      {/* At-Risk Alert Banner (Attendance < 75% or CGPA < 6.0) */}
      {atRiskList.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/60">
            <div className="flex items-center space-x-2 text-rose-800">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <h3 className="font-bold text-sm">
                Academic & Attendance Alert ({atRiskList.length} Students Requiring Intervention)
              </h3>
            </div>
            <Link
              to="/students"
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
            >
              View in Directory
            </Link>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {atRiskList.slice(0, 3).map((s) => (
              <div
                key={s._id}
                className="rounded-xl border border-rose-200 bg-white p-3.5 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-slate-800">{s.fullName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{s.studentId} • {s.department}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`block text-[11px] font-bold ${
                      s.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-600'
                    }`}
                  >
                    Att: {s.attendanceRate}%
                  </span>
                  <span
                    className={`block text-[11px] font-bold ${
                      s.cgpa < 6.0 ? 'text-amber-600' : 'text-slate-600'
                    }`}
                  >
                    CGPA: {s.cgpa.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts & Analytics Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">
                Enrollment by Department / Branch
              </h3>
            </div>
            <Link
              to="/students"
              className="flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <span>View Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {stats?.departmentBreakdown && stats.departmentBreakdown.length > 0 ? (
              stats.departmentBreakdown.map((dept) => {
                const percentage = Math.round((dept.count / departmentMax) * 100);
                return (
                  <div key={dept.department} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{dept.department}</span>
                      <span className="font-bold text-slate-900">{dept.count} Students</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No departmental data available. Click "Seed Sample Data" to populate.
              </p>
            )}
          </div>
        </div>

        {/* Top Performers Leaderboard */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
              <TrendingUp className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-slate-800 text-sm">
                Top Academic Performers
              </h3>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {stats?.topPerformers && stats.topPerformers.length > 0 ? (
                stats.topPerformers.map((student, idx) => (
                  <div key={student._id} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-700 border border-amber-200">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {student.department} • Sem {student.semester}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700 border border-emerald-100">
                      {student.cgpa.toFixed(2)} CGPA
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No performer data recorded yet.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to="/students"
              className="flex w-full items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <span>Explore Full Student Directory</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

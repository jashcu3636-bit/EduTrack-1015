import React, { useState, useEffect } from 'react';
import { attendanceAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Users,
  Search,
  Download,
  AlertCircle,
  History,
  CheckSquare,
  BarChart3,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Information Technology',
  'Data Science & AI',
  'Electronics & Comm.',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
];

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const Attendance = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'mark'

  // Daily Marking State
  const [date, setDate] = useState(() => getLocalDateString());
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('All');
  const [roster, setRoster] = useState([]);
  const [attendanceState, setAttendanceState] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Previous Attendance (All Students History) State
  const [historyData, setHistoryData] = useState({ dates: [], records: [] });
  const [historyLoading, setHistoryLoading] = useState(true);
  const [histDept, setHistDept] = useState('All');
  const [histSem, setHistSem] = useState('All');
  const [histSearch, setHistSearch] = useState('');

  // Fetch Daily Roster
  const fetchRoster = async () => {
    try {
      setLoading(true);
      setMessage({ text: '', type: '' });
      const params = { date };
      if (department !== 'All') params.department = department;
      if (semester !== 'All') params.semester = semester;

      const res = await attendanceAPI.getClassRoster(params);
      if (res.data.success) {
        setRoster(res.data.roster);
        const initialMap = {};
        res.data.roster.forEach((student) => {
          initialMap[student._id] = {
            status: student.statusForDate === 'Not Marked' ? 'Present' : student.statusForDate,
            remarks: student.remarks || '',
          };
        });
        setAttendanceState(initialMap);
      }
    } catch (err) {
      console.error('Error fetching roster:', err);
      setMessage({ text: 'Failed to fetch class roster.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Previous Attendance of All Students from MongoDB
  const fetchAllHistory = async () => {
    try {
      setHistoryLoading(true);
      const params = {};
      if (histDept !== 'All') params.department = histDept;
      if (histSem !== 'All') params.semester = histSem;
      if (histSearch.trim()) params.search = histSearch.trim();

      const res = await attendanceAPI.getAllHistory(params);
      if (res.data.success) {
        setHistoryData({
          dates: res.data.dates || [],
          records: res.data.records || [],
        });
      }
    } catch (err) {
      console.error('Error fetching previous attendance:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'mark') {
      fetchRoster();
    } else {
      fetchAllHistory();
    }
  }, [date, department, semester, activeTab, histDept, histSem]);

  // Debounced search for history tab
  useEffect(() => {
    if (activeTab === 'history') {
      const timer = setTimeout(() => {
        fetchAllHistory();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [histSearch]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleMarkAll = (status) => {
    setAttendanceState((prev) => {
      const next = { ...prev };
      roster.forEach((s) => {
        next[s._id] = {
          ...next[s._id],
          status,
        };
      });
      return next;
    });
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setMessage({ text: '', type: '' });

      const records = roster.map((s) => ({
        studentId: s._id,
        status: attendanceState[s._id]?.status || 'Present',
        remarks: attendanceState[s._id]?.remarks || '',
      }));

      const payload = {
        date,
        department,
        semester,
        records,
      };

      const res = await attendanceAPI.markBulk(payload);
      if (res.data.success) {
        setMessage({
          text: `Attendance saved to MongoDB for ${records.length} students on ${date}!`,
          type: 'success',
        });
        fetchRoster();
        fetchAllHistory();
      }
    } catch (err) {
      console.error('Error saving attendance:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to submit attendance.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  // Export Previous Attendance Matrix to CSV
  const handleExportHistoryCSV = () => {
    if (historyData.records.length === 0) return;

    const baseHeaders = ['Student ID', 'Full Name', 'Department', 'Semester', 'Attendance %', 'Total Classes', 'Present', 'Absent', 'Late'];
    const dateHeaders = historyData.dates;
    const allHeaders = [...baseHeaders, ...dateHeaders];

    const rows = historyData.records.map((r) => {
      const dateValues = dateHeaders.map((d) => r.recordsByDate[d] || 'N/A');
      return [
        r.studentId,
        `"${r.fullName}"`,
        `"${r.department}"`,
        r.semester,
        `${r.attendanceRate}%`,
        r.totalClasses,
        r.presentCount,
        r.absentCount,
        r.lateCount,
        ...dateValues,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [allHeaders.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Complete_Student_Attendance_History_${getLocalDateString()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const dailyCounts = roster.reduce(
    (acc, student) => {
      const st = attendanceState[student._id]?.status || 'Present';
      if (st === 'Present') acc.present++;
      else if (st === 'Absent') acc.absent++;
      else if (st === 'Late') acc.late++;
      return acc;
    },
    { present: 0, absent: 0, late: 0 }
  );

  // History Statistics
  const totalStudentsInHistory = historyData.records.length;
  const avgAttendanceAll =
    totalStudentsInHistory > 0
      ? (
          historyData.records.reduce((sum, r) => sum + r.attendanceRate, 0) /
          totalStudentsInHistory
        ).toFixed(1)
      : '0.0';
  const shortageCount = historyData.records.filter((r) => r.attendanceRate < 75).length;

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 border border-indigo-100">
            <Calendar className="h-3.5 w-3.5" />
            <span>Attendance Management Engine</span>
          </span>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-800">
            Institutional Student Attendance Register
          </h2>
          <p className="text-xs text-slate-500">
            MongoDB Storage • Authenticated Role: <strong className="text-slate-700 capitalize">{user?.role}</strong>
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Previous Attendance (All Students)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mark')}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
              activeTab === 'mark'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Mark Daily Attendance</span>
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`flex items-center space-x-2 rounded-xl p-3.5 text-xs font-medium border ${
            message.type === 'error'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}
        >
          {message.type === 'error' ? (
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
          ) : (
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 1: PREVIOUS ATTENDANCE OF ALL STUDENTS (HISTORY MATRIX) */}
      {/* ======================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-5">
          {/* Summary Metric Cards for Attendance History */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Recorded Sessions in MongoDB
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {historyData.dates.length} Days
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Across {totalStudentsInHistory} registered students
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Average Attendance Rate
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-800">
                  {avgAttendanceAll}%
                </h3>
                <p className="mt-0.5 text-xs text-emerald-600 font-semibold">
                  Cumulative institutional record
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Attendance Shortage Alert
                </p>
                <h3 className="mt-1 text-2xl font-bold text-rose-600">
                  {shortageCount} Students
                </h3>
                <p className="mt-0.5 text-xs text-rose-500">
                  Below mandatory 75% threshold
                </p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 border border-rose-100 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Filter Toolbar for History */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 flex-1">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={histSearch}
                    onChange={(e) => setHistSearch(e.target.value)}
                    placeholder="Search student or roll no..."
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Department */}
                <div>
                  <select
                    value={histDept}
                    onChange={(e) => setHistDept(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d === 'All' ? 'All Departments' : d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Semester */}
                <div>
                  <select
                    value={histSem}
                    onChange={(e) => setHistSem(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="All">All Semesters</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleExportHistoryCSV}
                  disabled={historyData.records.length === 0}
                  className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report (CSV)</span>
                </button>
                <button
                  type="button"
                  onClick={fetchAllHistory}
                  title="Reload from MongoDB"
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Historical Matrix Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {historyLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-xs text-slate-500">Querying attendance history from MongoDB...</p>
                </div>
              </div>
            ) : historyData.records.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-bold text-slate-800">No attendance history found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  No records match the current filter criteria in MongoDB.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500 sticky top-0">
                    <tr>
                      <th className="py-3.5 pl-6 pr-3">Student Name & Roll No</th>
                      <th className="px-3 py-3.5">Branch & Sem</th>
                      <th className="px-3 py-3.5">Rate (%)</th>
                      <th className="px-3 py-3.5 text-center">P / A / L</th>
                      {/* Dates columns from MongoDB */}
                      {historyData.dates.map((d) => (
                        <th key={d} className="px-3 py-3.5 text-center font-mono font-medium">
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {historyData.records.map((student) => {
                      const isLow = student.attendanceRate < 75;

                      return (
                        <tr key={student._id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Student Details */}
                          <td className="py-3 pl-6 pr-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{student.fullName}</p>
                                <span className="font-mono text-[11px] text-indigo-600">
                                  {student.studentId}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Branch & Semester */}
                          <td className="px-3 py-3 text-slate-600 font-medium">
                            {student.department} • S{student.semester} ({student.section || 'A'})
                          </td>

                          {/* Overall Attendance Rate */}
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border ${
                                student.attendanceRate >= 85
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : student.attendanceRate >= 75
                                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}
                            >
                              {student.attendanceRate}%
                            </span>
                            {isLow && (
                              <span className="block text-[10px] text-rose-600 font-semibold mt-0.5">
                                Shortage
                              </span>
                            )}
                          </td>

                          {/* Present / Absent / Late Counts */}
                          <td className="px-3 py-3 text-center">
                            <div className="inline-flex space-x-1 text-[11px] font-mono">
                              <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                {student.presentCount}P
                              </span>
                              <span className="text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                                {student.absentCount}A
                              </span>
                              <span className="text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                {student.lateCount}L
                              </span>
                            </div>
                          </td>

                          {/* Date-by-date attendance pills */}
                          {historyData.dates.map((d) => {
                            const status = student.recordsByDate[d];
                            if (status === 'Present') {
                              return (
                                <td key={d} className="px-3 py-3 text-center">
                                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs" title={`${student.fullName} was Present on ${d}`}>
                                    P
                                  </span>
                                </td>
                              );
                            } else if (status === 'Absent') {
                              return (
                                <td key={d} className="px-3 py-3 text-center">
                                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-100 text-rose-800 font-bold text-xs shadow-2xs" title={`${student.fullName} was Absent on ${d}`}>
                                    A
                                  </span>
                                </td>
                              );
                            } else if (status === 'Late') {
                              return (
                                <td key={d} className="px-3 py-3 text-center">
                                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-800 font-bold text-xs shadow-2xs" title={`${student.fullName} was Late on ${d}`}>
                                    L
                                  </span>
                                </td>
                              );
                            } else {
                              return (
                                <td key={d} className="px-3 py-3 text-center text-slate-300">
                                  -
                                </td>
                              );
                            }
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: MARK DAILY ATTENDANCE (ACTIVE REGISTER) */}
      {/* ======================================================== */}
      {activeTab === 'mark' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Select Date
                  </label>
                  <button
                    type="button"
                    onClick={() => setDate(getLocalDateString())}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 underline"
                    title="Reset to current local date"
                  >
                    Sync Today
                  </button>
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="mt-1 text-[11px] text-indigo-600 font-medium">
                  📅 {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept === 'All' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="All">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Bulk Action Toggles & Counters */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
              <div className="flex items-center space-x-3 text-xs">
                <span className="font-semibold text-slate-700">Class Counters:</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-slate-600 font-medium">
                  Total: {roster.length}
                </span>
                <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 font-semibold border border-emerald-100">
                  Present: {dailyCounts.present}
                </span>
                <span className="rounded-md bg-rose-50 px-2 py-0.5 text-rose-700 font-semibold border border-rose-100">
                  Absent: {dailyCounts.absent}
                </span>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 text-amber-700 font-semibold border border-amber-100">
                  Late: {dailyCounts.late}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={handleSaveAttendance}
                  disabled={saving || roster.length === 0}
                  className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{saving ? 'Saving...' : 'Submit to MongoDB'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Roster Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-xs text-slate-500 font-medium">Loading class attendance sheet...</p>
                </div>
              </div>
            ) : roster.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-bold text-slate-800">No students enrolled</h3>
                <p className="text-xs text-slate-500 mt-1">
                  No active students found for {department} {semester !== 'All' ? `Semester ${semester}` : ''}.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3.5 pl-6 pr-3">Student Name & Roll No</th>
                      <th className="px-3 py-3.5">Branch & Sem</th>
                      <th className="px-3 py-3.5">Cumulative Rate</th>
                      <th className="px-3 py-3.5 text-center">Attendance for {date}</th>
                      <th className="py-3.5 pl-3 pr-6">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {roster.map((student) => {
                      const currentStatus = attendanceState[student._id]?.status || 'Present';
                      const currentRemarks = attendanceState[student._id]?.remarks || '';

                      return (
                        <tr key={student._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 pl-6 pr-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-700">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">{student.fullName}</p>
                                <span className="font-mono text-[11px] text-indigo-600">
                                  {student.studentId}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="px-3 py-3 text-slate-600">
                            {student.department} • Sem {student.semester} ({student.section})
                          </td>

                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border ${
                                student.attendanceRate >= 85
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : student.attendanceRate >= 75
                                  ? 'bg-amber-50 text-amber-700 border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border-rose-100'
                              }`}
                            >
                              {student.attendanceRate}%
                            </span>
                          </td>

                          <td className="px-3 py-3 text-center">
                            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student._id, 'Present')}
                                className={`flex items-center space-x-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                  currentStatus === 'Present'
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                <CheckCircle className="h-3.5 w-3.5" />
                                <span>Present</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(student._id, 'Absent')}
                                className={`flex items-center space-x-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                  currentStatus === 'Absent'
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Absent</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleStatusChange(student._id, 'Late')}
                                className={`flex items-center space-x-1 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                                  currentStatus === 'Late'
                                    ? 'bg-amber-500 text-white shadow-sm'
                                    : 'text-slate-600 hover:text-amber-700'
                                }`}
                              >
                                <Clock className="h-3.5 w-3.5" />
                                <span>Late</span>
                              </button>
                            </div>
                          </td>

                          <td className="py-3 pl-3 pr-6">
                            <input
                              type="text"
                              value={currentRemarks}
                              onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                              placeholder="Optional note..."
                              className="w-full rounded-md border border-slate-200 px-2.5 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

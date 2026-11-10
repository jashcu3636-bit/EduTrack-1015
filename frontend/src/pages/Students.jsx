import React, { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Download,
  RotateCcw,
  GraduationCap,
  Award,
  AlertTriangle,
  Lock,
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

const STATUSES = ['All', 'Active', 'Inactive', 'Graduated', 'Suspended'];
const FEE_STATUSES = ['All', 'Paid', 'Pending', 'Overdue'];

const Students = ({
  onOpenAddModal,
  onEditStudent,
  onViewStudent,
  onDeleteStudent,
  onOpenGrades,
  refreshKey,
}) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Query State
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [semester, setSemester] = useState('All');
  const [status, setStatus] = useState('All');
  const [feeStatus, setFeeStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (search.trim()) params.search = search.trim();
      if (department !== 'All') params.department = department;
      if (semester !== 'All') params.semester = semester;
      if (status !== 'All') params.status = status;
      if (feeStatus !== 'All') params.feeStatus = feeStatus;

      const res = await studentAPI.getAll(params);
      if (res.data.success) {
        setStudents(res.data.students);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.totalStudents);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch student records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, department, semester, status, feeStatus, sortBy, sortOrder, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchStudents();
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const handleResetFilters = () => {
    setSearch('');
    setDepartment('All');
    setSemester('All');
    setStatus('All');
    setFeeStatus('All');
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) return;
    const headers = [
      'Student ID',
      'First Name',
      'Last Name',
      'Email',
      'Phone',
      'Department',
      'Semester',
      'CGPA',
      'Attendance %',
      'Status',
      'Fee Status',
    ];
    const rows = students.map((s) => [
      s.studentId,
      s.firstName,
      s.lastName,
      s.email,
      s.phone,
      s.department,
      s.semester,
      s.cgpa,
      s.attendanceRate,
      s.status,
      s.feeStatus || 'Paid',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const localDate = new Intl.DateTimeFormat('en-CA').format(new Date());
    link.setAttribute(
      'download',
      `Students_Export_${localDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const statusBadge = (s) => {
    switch (s) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Inactive':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Graduated':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Suspended':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const feeBadge = (f) => {
    switch (f) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800">
            Student Information Directory
          </h2>
          <p className="text-xs text-slate-500">
            Showing {students.length} of {totalCount} registered students • Role:{' '}
            <strong className="text-indigo-600 capitalize">{user?.role}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportCSV}
            disabled={students.length === 0}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Enroll Student</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search box */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, roll no, or email..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === 'All' ? 'All Departments' : dept}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={semester}
              onChange={(e) => {
                setSemester(e.target.value);
                setPage(1);
              }}
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

          {/* Fee Status Filter */}
          <div>
            <select
              value={feeStatus}
              onChange={(e) => {
                setFeeStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none"
            >
              <option disabled>Fee Status</option>
              {FEE_STATUSES.map((f) => (
                <option key={f} value={f}>
                  {f === 'All' ? 'All Fee Statuses' : `Fee: ${f}`}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter & Reset */}
          <div className="flex items-center space-x-2">
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs focus:border-indigo-500 focus:outline-none"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="flex-shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Student Records Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-xs text-slate-500">Querying student records...</p>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h3 className="mt-3 text-sm font-bold text-slate-800">No student records found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              No students match the selected filters or search query.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3.5 pl-6 pr-3">Student Name & Roll No</th>
                  <th className="px-3 py-3.5">Department</th>
                  <th className="px-3 py-3.5">Sem & Sec</th>
                  <th className="px-3 py-3.5">CGPA</th>
                  <th className="px-3 py-3.5">Attendance</th>
                  <th className="px-3 py-3.5">Fee Status</th>
                  <th className="px-3 py-3.5">Status</th>
                  <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => {
                  const isShortage = student.attendanceRate < 75;

                  return (
                    <tr
                      key={student._id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Student Name & Roll No */}
                      <td className="py-3 pl-6 pr-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-xs font-bold text-indigo-700">
                            {student.firstName[0]}
                            {student.lastName[0]}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <p className="font-semibold text-slate-800">
                                {student.firstName} {student.lastName}
                              </p>
                              {isShortage && (
                                <span title="Attendance shortage (<75%)">
                                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 inline" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                              <span className="font-mono font-medium text-indigo-600">
                                {student.studentId}
                              </span>
                              <span>•</span>
                              <span>{student.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-3 py-3 font-medium text-slate-700">
                        {student.department}
                      </td>

                      {/* Semester & Section */}
                      <td className="px-3 py-3 text-slate-600">
                        Sem {student.semester} ({student.section || 'A'})
                      </td>

                      {/* CGPA */}
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 border border-indigo-100">
                          {student.cgpa ? student.cgpa.toFixed(2) : '0.00'}
                        </span>
                      </td>

                      {/* Attendance */}
                      <td className="px-3 py-3">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-semibold ${
                              isShortage ? 'text-rose-600 font-bold' : 'text-slate-700'
                            }`}
                          >
                            {student.attendanceRate}%
                          </span>
                          <div className="h-1.5 w-12 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className={`h-full ${
                                student.attendanceRate >= 85
                                  ? 'bg-emerald-500'
                                  : student.attendanceRate >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${student.attendanceRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${feeBadge(
                            student.feeStatus || 'Paid'
                          )}`}
                        >
                          {student.feeStatus || 'Paid'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${statusBadge(
                            student.status
                          )}`}
                        >
                          {student.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 pl-3 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          {/* Grades / Evaluate Button (Faculty & Admin) */}
                          <button
                            onClick={() => onOpenGrades(student)}
                            title="Academic Evaluation & Grades"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          >
                            <Award className="h-4 w-4" />
                          </button>

                          {/* Profile View */}
                          <button
                            onClick={() => onViewStudent(student)}
                            title="View Complete Profile"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => onEditStudent(student)}
                            title="Edit Student"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete (Admin only) */}
                          {isAdmin ? (
                            <button
                              onClick={() => onDeleteStudent(student)}
                              title="Delete Student (Admin Only)"
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Delete Restricted: Admin Only"
                              className="rounded-lg p-1.5 text-slate-200 cursor-not-allowed"
                            >
                              <Lock className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="rounded-lg border border-slate-200 px-3 py-1 font-medium hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-1 font-medium hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;

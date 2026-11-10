import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Calendar,
  User,
  Award,
  CheckCircle2,
  Clock,
  BookOpen,
  DollarSign,
  PlusCircle,
} from 'lucide-react';

const StudentViewModal = ({ isOpen, onClose, student, onEdit, onOpenGrades }) => {
  if (!isOpen || !student) return null;

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'grades' | 'attendance'

  const statusColors = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Inactive: 'bg-slate-50 text-slate-700 border-slate-200',
    Graduated: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Suspended: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const feeColors = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Partial: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Overdue: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl transition-all my-8 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur-sm shadow-inner">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold tracking-tight">
                  {student.firstName} {student.lastName}
                </h2>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    statusColors[student.status] || 'bg-white/20 text-white'
                  }`}
                >
                  {student.status}
                </span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                    feeColors[student.feeStatus || 'Paid']
                  }`}
                >
                  Fee: {student.feeStatus || 'Paid'}
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Roll No: <span className="font-mono font-semibold">{student.studentId}</span>
              </p>
              <p className="text-xs text-indigo-200 mt-0.5">
                {student.department} • Semester {student.semester} ({student.section || 'A'})
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex space-x-2 mt-4 pt-2 border-t border-indigo-500/50">
            <button
              onClick={() => setActiveTab('profile')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              Profile Overview
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'grades'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              Academic Evaluations ({student.grades?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-indigo-100 hover:bg-white/10'
              }`}
            >
              Attendance Log ({student.attendanceRecords?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab 1: Profile Overview */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            {/* Key Metrics row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase">CGPA</span>
                <p className="mt-0.5 text-xl font-bold text-slate-800">
                  {student.cgpa ? student.cgpa.toFixed(2) : '0.00'}
                </p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase">Attendance</span>
                <p
                  className={`mt-0.5 text-xl font-bold ${
                    student.attendanceRate < 75 ? 'text-rose-600' : 'text-slate-800'
                  }`}
                >
                  {student.attendanceRate !== undefined ? `${student.attendanceRate}%` : 'N/A'}
                </p>
                {student.attendanceRate < 75 && (
                  <span className="text-[10px] text-rose-600 font-bold block">Shortage Alert</span>
                )}
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase">Semester</span>
                <p className="mt-0.5 text-xl font-bold text-slate-800">Sem {student.semester}</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="text-[11px] font-medium text-slate-500 uppercase">Fee Status</span>
                <p className="mt-0.5 text-sm font-bold text-slate-800">{student.feeStatus || 'Paid'}</p>
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Contact & Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                <div className="flex items-center space-x-2.5 rounded-lg border border-slate-100 p-2.5">
                  <Mail className="h-4 w-4 text-indigo-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email Address</span>
                    <span className="font-medium text-slate-700">{student.email}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 rounded-lg border border-slate-100 p-2.5">
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone Number</span>
                    <span className="font-medium text-slate-700">{student.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 rounded-lg border border-slate-100 p-2.5">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Date of Birth</span>
                    <span className="font-medium text-slate-700">
                      {student.dateOfBirth
                        ? new Date(student.dateOfBirth).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 rounded-lg border border-slate-100 p-2.5">
                  <User className="h-4 w-4 text-violet-500" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gender</span>
                    <span className="font-medium text-slate-700">{student.gender}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Guardian & Location */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Guardian & Location
              </h3>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
                <div className="rounded-lg border border-slate-100 p-2.5">
                  <span className="text-slate-400 block text-[10px]">Guardian Name & Relation</span>
                  <span className="font-medium text-slate-700">
                    {student.guardian?.name || 'Not provided'}{' '}
                    {student.guardian?.relation ? `(${student.guardian.relation})` : ''}
                  </span>
                  {student.guardian?.phone && (
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Phone: {student.guardian.phone}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-slate-100 p-2.5">
                  <span className="text-slate-400 block text-[10px]">Home Location</span>
                  <span className="font-medium text-slate-700">
                    {[student.address?.city, student.address?.state].filter(Boolean).join(', ') ||
                      'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Grades & Academic Evaluations */}
        {activeTab === 'grades' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Academic Evaluation Sheet</h3>
                <p className="text-xs text-slate-500">Cumulative CGPA: {student.cgpa?.toFixed(2)}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenGrades) onOpenGrades(student);
                }}
                className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ Evaluate Marks</span>
              </button>
            </div>

            {student.grades && student.grades.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 pl-4 pr-2">Subject Code</th>
                      <th className="px-2 py-2.5">Subject Title</th>
                      <th className="px-2 py-2.5">Credits</th>
                      <th className="px-2 py-2.5">Marks</th>
                      <th className="py-2.5 pl-2 pr-4 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.grades.map((g, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2.5 pl-4 pr-2 font-mono font-semibold text-indigo-600">
                          {g.subjectCode}
                        </td>
                        <td className="px-2 py-2.5 font-medium text-slate-800">{g.subjectName}</td>
                        <td className="px-2 py-2.5 text-slate-500">{g.credits || 3}</td>
                        <td className="px-2 py-2.5 font-semibold text-slate-700">{g.marks}/100</td>
                        <td className="py-2.5 pl-2 pr-4 text-right">
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 border border-emerald-100">
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-2 text-xs font-semibold text-slate-700">No grades evaluated yet</p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenGrades) onOpenGrades(student);
                  }}
                  className="mt-3 inline-flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Enter First Evaluation</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Attendance History */}
        {activeTab === 'attendance' && (
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Daily Attendance History</h3>
                <p className="text-xs text-slate-500">
                  Overall Rate: <strong className="text-slate-800">{student.attendanceRate}%</strong>
                </p>
              </div>
            </div>

            {student.attendanceRecords && student.attendanceRecords.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 pl-4 pr-2">Date</th>
                      <th className="px-2 py-2.5">Status</th>
                      <th className="px-2 py-2.5">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.attendanceRecords
                      .slice()
                      .reverse()
                      .map((att, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2.5 pl-4 pr-2 font-mono text-slate-700">{att.date}</td>
                          <td className="px-2 py-2.5">
                            <span
                              className={`rounded-md px-2 py-0.5 font-bold text-[11px] border ${
                                att.status === 'Present'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                  : att.status === 'Absent'
                                  ? 'bg-rose-50 text-rose-700 border-rose-100'
                                  : 'bg-amber-50 text-amber-700 border-amber-100'
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                          <td className="px-2 py-2.5 text-slate-500">{att.remarks || '-'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Clock className="h-8 w-8 text-slate-300 mx-auto" />
                <p className="mt-2 text-xs font-semibold text-slate-700">No attendance records logged</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Attendance can be marked from the Daily Attendance register.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3">
          <div className="text-[11px] text-slate-400">
            Registered: {new Date(student.createdAt).toLocaleDateString()}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenGrades) onOpenGrades(student);
              }}
              className="rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors"
            >
              Academic Evaluation
            </button>
            <button
              onClick={() => {
                onClose();
                if (onEdit) onEdit(student);
              }}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Edit Profile
            </button>
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentViewModal;

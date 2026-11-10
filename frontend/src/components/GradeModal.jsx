import React, { useState } from 'react';
import { X, Award, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { studentAPI } from '../services/api';

const GradeModal = ({ isOpen, onClose, student, onGradeUpdated }) => {
  if (!isOpen || !student) return null;

  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [marks, setMarks] = useState('');
  const [credits, setCredits] = useState(3);
  const [semester, setSemester] = useState(student.semester || 1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const getGradePreview = (m) => {
    const num = Number(m);
    if (isNaN(num) || m === '') return '-';
    if (num >= 90) return 'A+ (10.0)';
    if (num >= 80) return 'A (9.0)';
    if (num >= 70) return 'B+ (8.0)';
    if (num >= 60) return 'B (7.0)';
    if (num >= 50) return 'C (6.0)';
    if (num >= 40) return 'D (5.0)';
    return 'F (0.0)';
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    if (!subjectCode.trim() || !subjectName.trim() || marks === '') {
      setMessage({ text: 'Please fill out all grade fields.', type: 'error' });
      return;
    }

    try {
      setLoading(true);
      setMessage({ text: '', type: '' });

      const payload = {
        subjectCode: subjectCode.toUpperCase().trim(),
        subjectName: subjectName.trim(),
        marks: Number(marks),
        credits: Number(credits),
        semester: Number(semester),
      };

      const res = await studentAPI.addGrade(student._id, payload);
      if (res.data.success) {
        setMessage({
          text: `Grade recorded! New cumulative CGPA: ${res.data.cgpa}`,
          type: 'success',
        });
        setSubjectCode('');
        setSubjectName('');
        setMarks('');
        if (onGradeUpdated) onGradeUpdated();
      }
    } catch (err) {
      console.error('Error adding grade:', err);
      setMessage({
        text: err.response?.data?.message || 'Failed to submit grade.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl transition-all my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-indigo-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-2.5">
            <Award className="h-5 w-5" />
            <div>
              <h2 className="text-base font-bold">Academic Evaluation & Grading</h2>
              <p className="text-xs text-indigo-100">
                Student: {student.fullName} ({student.studentId}) • Current CGPA:{' '}
                <strong className="underline">{student.cgpa ? student.cgpa.toFixed(2) : '0.00'}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 p-1.5 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {message.text && (
            <div
              className={`flex items-center space-x-2 rounded-lg p-3 text-xs font-medium border ${
                message.type === 'error'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form to Add New Grade */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-3 flex items-center space-x-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Enter New Subject Evaluation</span>
            </h3>

            <form onSubmit={handleAddGrade} className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CS501"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs uppercase focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Subject Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Database Management Systems"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Marks Obtained (0-100) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="85"
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    required
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Course Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Grade Preview
                  </label>
                  <div className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700">
                    {getGradePreview(marks)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Evaluating...' : 'Record Grade & Recompute CGPA'}
                </button>
              </div>
            </form>
          </div>

          {/* Existing Grades Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Subject Transcript ({student.grades?.length || 0} Recorded)
            </h3>

            {student.grades && student.grades.length > 0 ? (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="py-2.5 pl-4 pr-2">Code</th>
                      <th className="px-2 py-2.5">Subject</th>
                      <th className="px-2 py-2.5">Credits</th>
                      <th className="px-2 py-2.5">Marks</th>
                      <th className="py-2.5 pl-2 pr-4 text-right">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.grades.map((g, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 pl-4 pr-2 font-mono font-semibold text-indigo-600">
                          {g.subjectCode}
                        </td>
                        <td className="px-2 py-2 font-medium text-slate-800">{g.subjectName}</td>
                        <td className="px-2 py-2 text-slate-500">{g.credits || 3}</td>
                        <td className="px-2 py-2 text-slate-700 font-semibold">{g.marks}/100</td>
                        <td className="py-2 pl-2 pr-4 text-right">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold border ${
                              g.grade.startsWith('A')
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : g.grade.startsWith('B')
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}
                          >
                            {g.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-6 text-xs text-slate-400">
                No subject grades entered yet. Use the form above to add an evaluation.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-3 bg-slate-50 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeModal;


import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, student, deleting }) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 text-rose-600">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 border border-rose-100">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Confirm Deletion</h3>
        </div>

        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          Are you sure you want to permanently remove student{' '}
          <strong className="text-slate-900">
            {student.firstName} {student.lastName}
          </strong>{' '}
          (Roll No: <span className="font-mono text-xs">{student.studentId}</span>)?
        </p>

        <p className="mt-2 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
          This operation deletes all associated records from MongoDB and cannot be undone.
        </p>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center space-x-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{deleting ? 'Deleting...' : 'Delete Student'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;


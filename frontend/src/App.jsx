import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentModal from './components/StudentModal';
import StudentViewModal from './components/StudentViewModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import GradeModal from './components/GradeModal';
import { studentAPI } from './services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const MainLayout = () => {
  // Modal states
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit'
  const [activeStudent, setActiveStudent] = useState(null);
  const [viewStudent, setViewStudent] = useState(null);
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [gradeStudent, setGradeStudent] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Notification Toast state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAddModal = () => {
    setActiveStudent(null);
    setModalMode('add');
  };

  const handleOpenEditModal = (student) => {
    setActiveStudent(student);
    setModalMode('edit');
  };

  const handleOpenViewModal = (student) => {
    setViewStudent(student);
  };

  const handleOpenDeleteModal = (student) => {
    setDeleteStudent(student);
  };

  const handleOpenGradeModal = (student) => {
    setGradeStudent(student);
  };

  const handleModalSubmit = async (formData) => {
    if (modalMode === 'add') {
      const res = await studentAPI.create(formData);
      showToast(res.data.message || 'Student enrolled successfully!');
    } else if (modalMode === 'edit' && activeStudent) {
      const res = await studentAPI.update(activeStudent._id, formData);
      showToast(res.data.message || 'Student record updated successfully!');
    }
    setRefreshKey((k) => k + 1);
  };

  const handleConfirmDelete = async () => {
    if (!deleteStudent) return;
    try {
      setDeleting(true);
      const res = await studentAPI.delete(deleteStudent._id);
      showToast(res.data.message || 'Student deleted successfully.');
      setDeleteStudent(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to delete student.',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleSeedDemo = async () => {
    try {
      const res = await studentAPI.seedDemo();
      showToast(res.data.message || 'Demo records populated into MongoDB!');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Failed to seed demo data.',
        'error'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Floating Alert / Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl animate-bounce">
          {toast.type === 'error' ? (
            <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold text-slate-800">
            {toast.message}
          </span>
        </div>
      )}

      <div className="flex flex-1">
        <Sidebar
          onOpenAddModal={handleOpenAddModal}
          onSeedDemo={handleSeedDemo}
        />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Routes>
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  onOpenAddModal={handleOpenAddModal}
                  onSeedDemo={handleSeedDemo}
                />
              }
            />
            <Route
              path="/students"
              element={
                <Students
                  onOpenAddModal={handleOpenAddModal}
                  onEditStudent={handleOpenEditModal}
                  onViewStudent={handleOpenViewModal}
                  onDeleteStudent={handleOpenDeleteModal}
                  onOpenGrades={handleOpenGradeModal}
                  refreshKey={refreshKey}
                />
              }
            />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={!!modalMode}
        onClose={() => setModalMode(null)}
        onSubmit={handleModalSubmit}
        initialData={activeStudent}
        title={modalMode === 'edit' ? 'Update Student Record' : 'Enroll New Student'}
      />

      <StudentViewModal
        isOpen={!!viewStudent}
        onClose={() => setViewStudent(null)}
        student={viewStudent}
        onEdit={(student) => {
          setViewStudent(null);
          handleOpenEditModal(student);
        }}
        onOpenGrades={(student) => {
          setViewStudent(null);
          handleOpenGradeModal(student);
        }}
      />

      <GradeModal
        isOpen={!!gradeStudent}
        onClose={() => setGradeStudent(null)}
        student={gradeStudent}
        onGradeUpdated={() => {
          setRefreshKey((k) => k + 1);
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleConfirmDelete}
        student={deleteStudent}
        deleting={deleting}
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Marketing Page */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />

          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes (JWT Required) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/*" element={<MainLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

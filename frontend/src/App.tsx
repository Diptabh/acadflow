import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout'

// Auth Pages
import LoginPage from './pages/LoginPage'

// Dashboard Pages
import DashboardPage from './pages/DashboardPage'

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage'
import StudentsPage from './pages/StudentsPage'
import StudentFormPage from './pages/StudentFormPage'
import SubjectsPage from './pages/SubjectsPage'
import SubjectFormPage from './pages/SubjectFormPage'
import FacultyPage from './pages/FacultyPage'
import FacultyFormPage from './pages/FacultyFormPage'
import SettingsPage from './pages/SettingsPage'

// Assessment Pages
import AssessmentHubPage from './pages/AssessmentHubPage'
import StudentPortalPage from './pages/StudentPortalPage'

// Helper component to check admin access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = JSON.parse(localStorage.getItem('acadflow_user') || '{}')
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={
            <AdminRoute><AdminDashboardPage /></AdminRoute>
          } />
          <Route path="admin/students" element={
            <AdminRoute><StudentsPage /></AdminRoute>
          } />
          <Route path="admin/students/new" element={
            <AdminRoute><StudentFormPage /></AdminRoute>
          } />
          <Route path="admin/faculty" element={
            <AdminRoute><FacultyPage /></AdminRoute>
          } />
          <Route path="admin/faculty/new" element={
            <AdminRoute><FacultyFormPage /></AdminRoute>
          } />
          <Route path="admin/subjects" element={
            <AdminRoute><SubjectsPage /></AdminRoute>
          } />
          <Route path="admin/subjects/new" element={
            <AdminRoute><SubjectFormPage /></AdminRoute>
          } />
          
          {/* General Routes */}
          <Route path="students" element={<StudentsPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="faculty" element={<FacultyPage />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Assessment Hub */}
          <Route path="assessment/:subjectId" element={<AssessmentHubPage />} />
          
          {/* Student Portal */}
          <Route path="portal" element={<StudentPortalPage />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

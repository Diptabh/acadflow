import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout'

// Auth Pages
import LoginPage from './pages/LoginPage'

// Dashboard Pages
import DashboardPage from './pages/DashboardPage'

// Placeholder pages for now
import StudentsPage from './pages/StudentsPage'
import SubjectsPage from './pages/SubjectsPage'
import FacultyPage from './pages/FacultyPage'
import SettingsPage from './pages/SettingsPage'

// Assessment Pages
import AssessmentHubPage from './pages/AssessmentHubPage'
import StudentPortalPage from './pages/StudentPortalPage'

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

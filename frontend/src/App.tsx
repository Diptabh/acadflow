import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FacultyDashboard } from './pages/FacultyDashboard';
import { FacultySubjects } from './pages/FacultySubjects';
import { FacultyStudents } from './pages/FacultyStudents';
import { FacultySettings } from './pages/FacultySettings';
import { CA3Evaluation } from './pages/CA3Evaluation';
import { FacultyCA1 } from './pages/FacultyCA1';
import { FacultyCA2 } from './pages/FacultyCA2';
import { StudentDashboard } from './pages/StudentDashboard';
import { StudentMarks } from './pages/StudentMarks';
import { Layout } from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
            <Route path="/faculty/dashboard" element={<Layout><FacultyDashboard /></Layout>} />
            <Route path="/faculty/subjects" element={<Layout><FacultySubjects /></Layout>} />
            <Route path="/faculty/students" element={<Layout><FacultyStudents /></Layout>} />
            <Route path="/faculty/settings" element={<Layout><FacultySettings /></Layout>} />
            <Route path="/faculty/ca3" element={<Layout><CA3Evaluation /></Layout>} />
            <Route path="/faculty/ca1" element={<Layout><FacultyCA1 /></Layout>} />
            <Route path="/faculty/ca2" element={<Layout><FacultyCA2 /></Layout>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<Layout><StudentDashboard /></Layout>} />
            <Route path="/student/marks" element={<Layout><StudentMarks /></Layout>} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

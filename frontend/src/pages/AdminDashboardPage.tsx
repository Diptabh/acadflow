import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, 
  BookOpen, 
  UserCheck, 
  FileText,
  Plus,
  Upload,
  ArrowRight
} from 'lucide-react'
import { authService, studentService, facultyService, subjectService } from '../services'
import type { Student, Faculty, Subject } from '../types'

export default function AdminDashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [studentsRes, facultyRes, subjectsRes] = await Promise.all([
        studentService.getAll({ page_size: 5 }),
        facultyService.getAll({ page_size: 5 }),
        subjectService.getAll({ page_size: 5 }),
      ])
      setStudents(studentsRes.data || [])
      setFaculty(facultyRes.data || [])
      setSubjects(subjectsRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const user = authService.getCurrentUser()

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-page-title text-text-dark">
          Admin Dashboard
        </h1>
        <p className="text-text-muted mt-1">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-body">Total Students</p>
              <p className="text-3xl font-bold text-text-dark mt-2">
                {loading ? '-' : `${students.length}+`}
              </p>
            </div>
            <div className="p-3 bg-primary rounded-lg">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <Link 
            to="/admin/students" 
            className="text-small text-primary hover:underline mt-3 inline-flex items-center gap-1"
          >
            Manage Students <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-body">Total Faculty</p>
              <p className="text-3xl font-bold text-text-dark mt-2">
                {loading ? '-' : `${faculty.length}+`}
              </p>
            </div>
            <div className="p-3 bg-success rounded-lg">
              <UserCheck size={24} className="text-white" />
            </div>
          </div>
          <Link 
            to="/admin/faculty" 
            className="text-small text-primary hover:underline mt-3 inline-flex items-center gap-1"
          >
            Manage Faculty <ArrowRight size={14} />
          </Link>
        </div>

        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-muted text-body">Total Subjects</p>
              <p className="text-3xl font-bold text-text-dark mt-2">
                {loading ? '-' : `${subjects.length}+`}
              </p>
            </div>
            <div className="p-3 bg-warning rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
          </div>
          <Link 
            to="/admin/subjects" 
            className="text-small text-primary hover:underline mt-3 inline-flex items-center gap-1"
          >
            Manage Subjects <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-card p-6 shadow-sm border border-border">
        <h3 className="text-section font-semibold text-text-dark mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/students/new"
            className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <Plus size={24} className="text-primary mb-2" />
            <span className="text-body text-text-dark">Add Student</span>
          </Link>
          <Link
            to="/admin/faculty/new"
            className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <UserCheck size={24} className="text-success mb-2" />
            <span className="text-body text-text-dark">Add Faculty</span>
          </Link>
          <Link
            to="/admin/subjects/new"
            className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <BookOpen size={24} className="text-warning mb-2" />
            <span className="text-body text-text-dark">Add Subject</span>
          </Link>
          <Link
            to="/admin/import"
            className="flex flex-col items-center p-4 border border-border rounded-lg hover:bg-background transition-colors"
          >
            <Upload size={24} className="text-text-muted mb-2" />
            <span className="text-body text-text-dark">Import Excel</span>
          </Link>
        </div>
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Students */}
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-body font-semibold text-text-dark">Recent Students</h3>
            <Link to="/admin/students" className="text-small text-primary">View All</Link>
          </div>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : students.length > 0 ? (
            <ul className="space-y-3">
              {students.slice(0, 5).map((student) => (
                <li key={student.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-small font-medium text-text-dark">{student.name}</p>
                    <p className="text-small text-text-muted">{student.university_roll}</p>
                  </div>
                  <span className="text-small text-text-muted">{student.programme}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-small">No students yet</p>
          )}
        </div>

        {/* Recent Faculty */}
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-body font-semibold text-text-dark">Recent Faculty</h3>
            <Link to="/admin/faculty" className="text-small text-primary">View All</Link>
          </div>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : faculty.length > 0 ? (
            <ul className="space-y-3">
              {faculty.slice(0, 5).map((f) => (
                <li key={f.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-small font-medium text-text-dark">{f.name}</p>
                    <p className="text-small text-text-muted">{f.designation || 'Faculty'}</p>
                  </div>
                  <span className="text-small text-text-muted">{f.department}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-small">No faculty yet</p>
          )}
        </div>

        {/* Recent Subjects */}
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-body font-semibold text-text-dark">Recent Subjects</h3>
            <Link to="/admin/subjects" className="text-small text-primary">View All</Link>
          </div>
          {loading ? (
            <p className="text-text-muted">Loading...</p>
          ) : subjects.length > 0 ? (
            <ul className="space-y-3">
              {subjects.slice(0, 5).map((subject) => (
                <li key={subject.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <p className="text-small font-medium text-text-dark">{subject.name}</p>
                    <p className="text-small text-text-muted">{subject.code}</p>
                  </div>
                  <span className="text-small text-text-muted">Sem {subject.semester}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-text-muted text-small">No subjects yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

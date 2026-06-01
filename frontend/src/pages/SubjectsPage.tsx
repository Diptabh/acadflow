import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { subjectService, facultyService } from '../services'
import toast from 'react-hot-toast'
import type { Subject, Faculty } from '../types'

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [subjectsRes, facultyRes] = await Promise.all([
        subjectService.getAll({ page_size: 100 }),
        facultyService.getAll({ page_size: 100 }),
      ])
      setSubjects(subjectsRes.data || [])
      setFaculty(facultyRes.data || [])
    } catch (error) {
      toast.error('Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete subject "${name}"?`)) return
    try {
      await subjectService.delete(id)
      toast.success('Subject deleted')
      loadData()
    } catch (error) {
      toast.error('Failed to delete subject')
    }
  }

  const getFacultyName = (facultyId?: string) => {
    if (!facultyId) return '-'
    const f = faculty.find(f => f.id === facultyId)
    return f?.name || '-'
  }

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.programme.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-dark">Subjects</h1>
          <p className="text-text-muted mt-1">Manage subjects and course outcomes</p>
        </div>
        <Link
          to="/admin/subjects/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Subject
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card rounded-card p-4 shadow-sm border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name, code, or programme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-card shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background">
              <tr>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Code</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Name</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Programme</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Semester</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Faculty</th>
                <th className="px-4 py-3 text-center text-small font-semibold text-text-dark">Marks (CA1/CA2/CA3)</th>
                <th className="px-4 py-3 text-right text-small font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    Loading subjects...
                  </td>
                </tr>
              ) : filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    {search ? 'No subjects match your search' : 'No subjects found. Add your first subject!'}
                  </td>
                </tr>
              ) : (
                filteredSubjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-background transition-colors">
                    <td className="px-4 py-3 font-mono text-small text-text-dark">{subject.code}</td>
                    <td className="px-4 py-3 font-medium text-text-dark">{subject.name}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{subject.programme}</td>
                    <td className="px-4 py-3 text-text-muted text-small">Sem {subject.semester}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{getFacultyName(subject.faculty_id)}</td>
                    <td className="px-4 py-3 text-center text-text-muted text-small">
                      {subject.full_marks_ca1}/{subject.full_marks_ca2}/{subject.full_marks_ca3}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/subjects/${subject.id}/edit`}
                          className="p-2 text-text-muted hover:text-primary transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(subject.id, subject.name)}
                          className="p-2 text-text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

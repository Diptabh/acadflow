import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { studentService } from '../services'
import toast from 'react-hot-toast'
import type { Student } from '../types'

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const pageSize = 20

  useEffect(() => {
    loadStudents()
  }, [page])

  const loadStudents = async () => {
    setLoading(true)
    try {
      const response = await studentService.getAll({ page, page_size: pageSize })
      setStudents(response.data || [])
      setTotalPages(Math.ceil((response.data?.length || 0) / pageSize) || 1)
    } catch (error) {
      toast.error('Failed to load students')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete student "${name}"? This cannot be undone.`)) return
    
    try {
      await studentService.delete(id)
      toast.success('Student deleted')
      loadStudents()
    } catch (error) {
      toast.error('Failed to delete student')
    }
  }

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.university_roll.toLowerCase().includes(search.toLowerCase()) ||
    s.programme.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-dark">Students</h1>
          <p className="text-text-muted mt-1">Manage student records</p>
        </div>
        <Link
          to="/admin/students/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Student
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card rounded-card p-4 shadow-sm border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name, roll number, or programme..."
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
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Roll No.</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Name</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Programme</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Year/Sem</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Section</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Email</th>
                <th className="px-4 py-3 text-right text-small font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                    {search ? 'No students match your search' : 'No students found. Add your first student!'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-background transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-small">{student.university_roll}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-text-dark">{student.name}</span>
                    </td>
                    <td className="px-4 py-3 text-text-muted text-small">{student.programme}</td>
                    <td className="px-4 py-3 text-text-muted text-small">
                      Year {student.year} / Sem {student.semester}
                    </td>
                    <td className="px-4 py-3 text-text-muted text-small">{student.section || '-'}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{student.email || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/students/${student.id}/edit`}
                          className="p-2 text-text-muted hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-2 text-text-muted hover:text-danger transition-colors"
                          title="Delete"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-small text-text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-background disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

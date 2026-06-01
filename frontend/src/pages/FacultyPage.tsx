import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'
import { facultyService } from '../services'
import toast from 'react-hot-toast'
import type { Faculty } from '../types'

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadFaculty()
  }, [])

  const loadFaculty = async () => {
    setLoading(true)
    try {
      const response = await facultyService.getAll({ page_size: 100 })
      setFaculty(response.data || [])
    } catch (error) {
      toast.error('Failed to load faculty')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete faculty "${name}"?`)) return
    try {
      await facultyService.delete(id)
      toast.success('Faculty deleted')
      loadFaculty()
    } catch (error) {
      toast.error('Failed to delete faculty')
    }
  }

  const filteredFaculty = faculty.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.email?.toLowerCase().includes(search.toLowerCase()) ||
    f.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-page-title text-text-dark">Faculty</h1>
          <p className="text-text-muted mt-1">Manage faculty members</p>
        </div>
        <Link
          to="/admin/faculty/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Add Faculty
        </Link>
      </div>

      {/* Search */}
      <div className="bg-card rounded-card p-4 shadow-sm border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
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
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Name</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Designation</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Department</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Email</th>
                <th className="px-4 py-3 text-left text-small font-semibold text-text-dark">Mobile</th>
                <th className="px-4 py-3 text-right text-small font-semibold text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                    Loading faculty...
                  </td>
                </tr>
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                    {search ? 'No faculty match your search' : 'No faculty found. Add your first faculty member!'}
                  </td>
                </tr>
              ) : (
                filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-background transition-colors">
                    <td className="px-4 py-3 font-medium text-text-dark">{f.name}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{f.designation || '-'}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{f.department}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{f.email || '-'}</td>
                    <td className="px-4 py-3 text-text-muted text-small">{f.mobile || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/faculty/${f.id}/edit`}
                          className="p-2 text-text-muted hover:text-primary transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(f.id, f.name)}
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

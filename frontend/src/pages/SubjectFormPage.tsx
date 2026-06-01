import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { subjectService, facultyService } from '../services'
import toast from 'react-hot-toast'
import type { Subject, Faculty } from '../types'

const PROGRAMMES = ['B.Tech', 'M.Tech', 'B.E.', 'M.E.', 'MCA', 'BCA']
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

interface SubjectFormData {
  code: string
  name: string
  programme: string
  semester: number
  full_marks_ca1: number
  full_marks_ca2: number
  full_marks_ca3: number
  faculty_id: string
}

export default function SubjectFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [formData, setFormData] = useState<SubjectFormData>({
    code: '',
    name: '',
    programme: 'B.Tech',
    semester: 1,
    full_marks_ca1: 20,
    full_marks_ca2: 20,
    full_marks_ca3: 50,
    faculty_id: '',
  })

  // Load faculty list
  useState(() => {
    facultyService.getAll({ page_size: 100 }).then(res => {
      setFaculty(res.data || [])
    }).catch(console.error)
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['semester', 'full_marks_ca1', 'full_marks_ca2', 'full_marks_ca3'].includes(name) 
        ? parseInt(value) 
        : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = {
        ...formData,
        faculty_id: formData.faculty_id || null
      }
      await subjectService.create(data as unknown as Subject)
      toast.success('Subject created successfully')
      navigate('/admin/subjects')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create subject')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/subjects')}
          className="p-2 rounded-lg border border-border hover:bg-background transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-page-title text-text-dark">Add New Subject</h1>
          <p className="text-text-muted mt-1">Fill in the subject details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-card p-6 shadow-sm border border-border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Code & Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Subject Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g., CS301"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Subject Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g., Data Structures"
              />
            </div>
          </div>

          {/* Programme & Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Programme *
              </label>
              <select
                name="programme"
                value={formData.programme}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {PROGRAMMES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {SEMESTERS.map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Full Marks */}
          <div>
            <label className="block text-small font-medium text-text-dark mb-2">
              Full Marks Configuration
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-small text-text-muted mb-1">CA1</label>
                <input
                  type="number"
                  name="full_marks_ca1"
                  value={formData.full_marks_ca1}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-small text-text-muted mb-1">CA2</label>
                <input
                  type="number"
                  name="full_marks_ca2"
                  value={formData.full_marks_ca2}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-small text-text-muted mb-1">CA3</label>
                <input
                  type="number"
                  name="full_marks_ca3"
                  value={formData.full_marks_ca3}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* Faculty */}
          <div>
            <label className="block text-small font-medium text-text-dark mb-2">
              Assigned Faculty
            </label>
            <select
              name="faculty_id"
              value={formData.faculty_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">-- Select Faculty --</option>
              {faculty.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/subjects')}
              className="px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

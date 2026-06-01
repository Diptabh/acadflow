import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { studentService } from '../services'
import toast from 'react-hot-toast'
import type { Student } from '../types'

const PROGRAMMES = ['B.Tech', 'M.Tech', 'B.E.', 'M.E.', 'MCA', 'BCA']
const YEARS = [1, 2, 3, 4]
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const SECTIONS = ['A', 'B', 'C', 'D', 'E']

interface StudentFormData {
  university_roll: string
  name: string
  programme: string
  year: number
  semester: number
  section: string
  email: string
  mobile: string
  upid: string
}

export default function StudentFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>({
    university_roll: '',
    name: '',
    programme: 'B.Tech',
    year: 1,
    semester: 1,
    section: 'A',
    email: '',
    mobile: '',
    upid: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'semester' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await studentService.create(formData as unknown as Student)
      toast.success('Student created successfully')
      navigate('/admin/students')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/students')}
          className="p-2 rounded-lg border border-border hover:bg-background transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-page-title text-text-dark">Add New Student</h1>
          <p className="text-text-muted mt-1">Fill in the student details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-card p-6 shadow-sm border border-border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* University Roll */}
          <div>
            <label className="block text-small font-medium text-text-dark mb-2">
              University Roll Number *
            </label>
            <input
              type="text"
              name="university_roll"
              value={formData.university_roll}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g., 2023/CS/001"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-small font-medium text-text-dark mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Enter student full name"
            />
          </div>

          {/* Programme & Year */}
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
                Year *
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {YEARS.map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Semester & Section */}
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Section *
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {SECTIONS.map(s => (
                  <option key={s} value={s}>Section {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Email & Mobile */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="student@college.edu"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          {/* UPID */}
          <div>
            <label className="block text-small font-medium text-text-dark mb-2">
              UPID (University Placement ID)
            </label>
            <input
              type="text"
              name="upid"
              value={formData.upid}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Optional"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/students')}
              className="px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

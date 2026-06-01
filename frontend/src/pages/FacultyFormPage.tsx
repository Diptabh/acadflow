import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { facultyService } from '../services'
import toast from 'react-hot-toast'
import type { Faculty } from '../types'

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'MCA', 'MBA', 'Physics', 'Chemistry', 'Mathematics', 'English', 'Other']

interface FacultyFormData {
  name: string
  designation: string
  department: string
  email: string
  mobile: string
}

export default function FacultyFormPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FacultyFormData>({
    name: '',
    designation: 'Assistant Professor',
    department: 'Computer Science',
    email: '',
    mobile: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await facultyService.create(formData as unknown as Faculty)
      toast.success('Faculty member created successfully')
      navigate('/admin/faculty')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to create faculty')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/faculty')}
          className="p-2 rounded-lg border border-border hover:bg-background transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-page-title text-text-dark">Add New Faculty</h1>
          <p className="text-text-muted mt-1">Fill in the faculty details</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-card rounded-card p-6 shadow-sm border border-border max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter faculty full name"
            />
          </div>

          {/* Designation & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="e.g., Assistant Professor"
              />
            </div>
            <div>
              <label className="block text-small font-medium text-text-dark mb-2">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
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
                placeholder="faculty@college.edu"
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

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/faculty')}
              className="px-6 py-2 border border-border rounded-lg hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

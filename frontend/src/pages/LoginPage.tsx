import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authService } from '../services'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      const response = await authService.login(data)
      toast.success('Login successful!')
      
      // Redirect based on role
      const user = response.user
      switch (user?.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'faculty':
          navigate('/faculty')
          break
        case 'hod':
          navigate('/hod')
          break
        case 'student':
          navigate('/student')
          break
        default:
          navigate('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">AcadFlow</h1>
          <p className="text-gray-400">Unified Assessment Automation Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-card shadow-xl p-8">
          <h2 className="text-page-title text-center mb-6">Sign In</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-body font-medium text-text-dark mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-danger text-small mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-body font-medium text-text-dark mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-danger text-small mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-small mt-6">
            Demo: admin@acadflow.com / admin123
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-small mt-6">
          Engineering College Assessment Platform
        </p>
      </div>
    </div>
  )
}

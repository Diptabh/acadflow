import { useEffect, useState } from 'react'
import { 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock,
  TrendingUp
} from 'lucide-react'
import { authService } from '../services'
import type { Student, Subject } from '../types'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    pendingSubmissions: 0,
    completedSubmissions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch actual stats from API
    // For now, set mock data
    const fetchStats = async () => {
      try {
        setStats({
          totalStudents: 156,
          totalSubjects: 12,
          pendingSubmissions: 8,
          completedSubmissions: 45
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const user = authService.getCurrentUser()

  const statCards = [
    { 
      title: 'Total Students', 
      value: stats.totalStudents, 
      icon: Users, 
      color: 'bg-primary',
      description: 'Active enrollments'
    },
    { 
      title: 'Total Subjects', 
      value: stats.totalSubjects, 
      icon: BookOpen, 
      color: 'bg-success',
      description: 'Across all semesters'
    },
    { 
      title: 'Pending', 
      value: stats.pendingSubmissions, 
      icon: Clock, 
      color: 'bg-warning',
      description: 'Awaiting evaluation'
    },
    { 
      title: 'Completed', 
      value: stats.completedSubmissions, 
      icon: CheckCircle, 
      color: 'bg-success',
      description: 'This semester'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-page-title text-text-dark">
          Welcome, {user?.email?.split('@')[0] || 'User'}
        </h1>
        <p className="text-text-muted mt-1">
          Here's an overview of your assessment activities
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-card rounded-card p-6 shadow-sm border border-border"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-text-muted text-body">{stat.title}</p>
                <p className="text-3xl font-bold text-text-dark mt-2">
                  {loading ? '-' : stat.value}
                </p>
                <p className="text-small text-text-muted mt-1">{stat.description}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <h3 className="text-section font-semibold text-text-dark mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-background">
              <div className="p-2 bg-success rounded-lg">
                <CheckCircle size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-dark">CA3 Marks Submitted</p>
                <p className="text-small text-text-muted">Data Structures - 45 students</p>
              </div>
              <p className="text-small text-text-muted">2 hours ago</p>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-background">
              <div className="p-2 bg-warning rounded-lg">
                <Clock size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text-dark">CA2 Evaluation Pending</p>
                <p className="text-small text-text-muted">Database Systems - 12 reports</p>
              </div>
              <p className="text-small text-text-muted">5 hours ago</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-card rounded-card p-6 shadow-sm border border-border">
          <h3 className="text-section font-semibold text-text-dark mb-4">
            Performance Summary
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-body mb-1">
                <span className="text-text-muted">CA1 Completion</span>
                <span className="font-medium text-text-dark">78%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body mb-1">
                <span className="text-text-muted">CA2 Completion</span>
                <span className="font-medium text-text-dark">65%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-warning rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-body mb-1">
                <span className="text-text-muted">CA3 Completion</span>
                <span className="font-medium text-text-dark">92%</span>
              </div>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

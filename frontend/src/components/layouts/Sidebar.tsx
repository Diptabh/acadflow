import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  FileText,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react'
import { clsx } from 'clsx'
import { authService } from '../../services'
import type { UserRole } from '../../types'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'hod', 'student'] },
  { name: 'Students', href: '/students', icon: Users, roles: ['admin'] },
  { name: 'Faculty', href: '/faculty', icon: GraduationCap, roles: ['admin'] },
  { name: 'Subjects', href: '/subjects', icon: BookOpen, roles: ['admin', 'faculty', 'hod'] },
  { name: 'Assessment Hub', href: '/assessment', icon: FileText, roles: ['faculty', 'hod'] },
  { name: 'My Portal', href: '/portal', icon: Users, roles: ['student'] },
  { name: 'Settings', href: '/settings', icon: Settings, roles: ['admin'] },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()
  const user = authService.getCurrentUser()
  const userRole = user?.role as UserRole

  const filteredNav = navigation.filter(item => 
    item.roles.includes(userRole || 'student')
  )

  const handleLogout = () => {
    authService.logout()
    window.location.href = '/login'
  }

  return (
    <aside className={clsx(
      'fixed left-0 top-0 h-screen bg-dark text-white flex flex-col transition-all duration-300 z-40',
      isOpen ? 'w-64' : 'w-20'
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {isOpen ? (
          <h1 className="text-xl font-bold text-primary">AcadFlow</h1>
        ) : (
          <span className="text-xl font-bold text-primary">AF</span>
        )}
        <button
          onClick={onToggle}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {filteredNav.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon size={22} />
                  {isOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
          title={!isOpen ? 'Logout' : undefined}
        >
          <LogOut size={22} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

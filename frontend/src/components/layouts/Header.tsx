import { Menu } from 'lucide-react'
import { authService } from '../../services'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const user = authService.getCurrentUser()

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu size={24} className="text-text-dark" />
        </button>
        
        {/* Page title would go here based on route */}
        <h2 className="text-section font-semibold text-text-dark">
          Welcome back
        </h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium text-text-dark">
            {user?.email || 'User'}
          </p>
          <p className="text-small text-text-muted capitalize">
            {user?.role || 'Guest'}
          </p>
        </div>
        
        {/* Avatar placeholder */}
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
          {user?.email?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}

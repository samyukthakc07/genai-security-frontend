import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings, Sun, Moon, X, Shield, AlertCircle, CheckCircle2, Zap, Brain } from 'lucide-react'
import { useAuthStore } from '@/store/authSlice'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/utils/helpers'
import { getInitials } from '@/utils/helpers'

interface HeaderProps {
  onMenuToggle: () => void
}

// ─── Notification Types ───────────────────────────────────
interface Notification {
  id: string
  type: 'scan_complete' | 'finding_critical' | 'finding_high' | 'scan_failed' | 'info'
  title: string
  description: string
  time: string
  read: boolean
}

const NOTIFICATION_ICONS: Record<string, React.ReactNode> = {
  scan_complete: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  finding_critical: <AlertCircle className="h-4 w-4 text-red-500" />,
  finding_high: <Zap className="h-4 w-4 text-orange-500" />,
  scan_failed: <Shield className="h-4 w-4 text-red-500" />,
  info: <Brain className="h-4 w-4 text-blue-500" />,
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-[var(--color-surface)] rounded-xl shadow-lg border border-gray-200 dark:border-[var(--color-border)] z-20 max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.5 text-[11px] font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <p className="text-sm font-medium">All caught up!</p>
            <p className="text-xs mt-1">No new notifications</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={cn(
                'flex items-start gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-200 dark:border-[var(--color-border)] last:border-0',
                !n.read && 'bg-indigo-50/30 dark:bg-indigo-900/10'
              )}
            >
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                !n.read ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100'
              )}>
                {NOTIFICATION_ICONS[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={cn(
                    'text-sm truncate',
                    !n.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                  )}>
                    {n.title}
                  </p>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.description}</p>
                <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 dark:border-[var(--color-border)] text-center">
        <button className="text-xs text-gray-500 dark:text-[var(--color-text-secondary)] hover:text-gray-700 dark:hover:text-[var(--color-text)] font-medium">
          View all notifications
        </button>
      </div>
    </div>
  )
}

export function Header({ onMenuToggle }: HeaderProps) {
  // Mock demo user
  const user = { first_name: 'Demo', last_name: 'Admin', email: 'admin@genai-security.com' }
  const logout = () => { console.log('Logout disabled in demo mode') }
  const { theme, toggleTheme } = useTheme()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const notificationsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="h-16 bg-white dark:bg-[var(--color-surface)] border-b border-gray-200 dark:border-[var(--color-border)] flex items-center justify-between px-4 lg:px-6">
      {/* Left - Menu toggle + Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search all modules... (Enter to search)"
            className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors text-gray-900 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right - Theme toggle + Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 dark:ring-offset-0" />
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <NotificationPanel onClose={() => setShowNotifications(false)} />
            </>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white dark:text-[#ffffff] text-sm font-medium">
              {user ? getInitials(`${user.first_name} ${user.last_name}`) || user.email[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700">
                {user ? `${user.first_name} ${user.last_name}`.trim() || user.email : 'User'}
              </p>
              <p className="text-xs text-gray-500">{user?.email || ''}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500 hidden md:block" />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[var(--color-surface)] rounded-xl shadow-lg border border-gray-200 dark:border-[var(--color-border)] py-1 z-20">
                <button
                  onClick={() => { navigate('/settings'); setShowUserMenu(false) }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-[var(--color-gray-100)]"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => { navigate('/settings'); setShowUserMenu(false) }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-[var(--color-text-secondary)] hover:bg-gray-100 dark:hover:bg-[var(--color-gray-100)]"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-1 border-gray-100 dark:border-[var(--color-border)]" />
                <button
                  onClick={() => { logout(); setShowUserMenu(false) }}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

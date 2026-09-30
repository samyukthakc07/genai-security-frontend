import { useState, useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { cn } from '@/utils/helpers'
import { useAuthStore } from '@/store/authSlice'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { isAuthenticated, isLoading, fetchProfile, user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (isAuthenticated && !user) {
      fetchProfile()
    }
  }, [isAuthenticated, isLoading, navigate, fetchProfile, user])

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto p-6',
            'transition-all duration-300'
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

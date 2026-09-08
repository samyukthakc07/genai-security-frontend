import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { cn } from '@/utils/helpers'

export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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

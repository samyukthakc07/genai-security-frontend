import { Outlet } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { APP_NAME } from '@/utils/constants'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-[#0b0f19] dark:via-[#0c1220] dark:to-[#020617] px-4">
      {/* Logo & Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/50 mb-4">
          <Shield className="h-8 w-8 text-white dark:text-[#ffffff]" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{APP_NAME}</h1>
        <p className="text-sm text-gray-500 mt-1">GenAI Security Management Platform</p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-gray-400">
        &copy; {new Date().getFullYear()} GenAI Security Platform. All rights reserved.
      </p>
    </div>
  )
}

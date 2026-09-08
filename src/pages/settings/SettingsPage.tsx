import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Settings, User, Bell, Shield, Eye, EyeOff, Key, Globe,
  Moon, Sun, Monitor, ChevronRight, Save, LogOut,
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance'

const SETTINGS_TABS: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  { id: 'appearance', label: 'Appearance', icon: <Eye className="h-4 w-4" /> },
]

export function SettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Settings className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Manage your account, notifications, and preferences
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                activeTab === tab.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Settings</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" defaultValue="admin@kct.ac.in" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                  <input type="text" defaultValue="KCT AI Security Lab" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>

              {[
                { label: 'Critical findings', desc: 'Immediate notifications for critical severity findings', enabled: true },
                { label: 'Scan completions', desc: 'When a security scan finishes running', enabled: true },
                { label: 'Weekly reports', desc: 'Weekly security summary report via email', enabled: true },
                { label: 'New vulnerabilities', desc: 'When new CVEs affect your dependencies', enabled: false },
                { label: 'Compliance reminders', desc: 'Reminders for upcoming compliance reviews', enabled: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-gray-200 after:border-gray-300 dark:after:border-gray-400 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">API Keys</p>
                    <p className="text-xs text-gray-500">Manage your API access tokens</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-3.5 w-3.5" />
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Session Timeout</p>
                    <p className="text-xs text-gray-500">Automatically sign out after inactivity</p>
                  </div>
                  <select className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white">
                    <option>30 minutes</option>
                    <option selected>1 hour</option>
                    <option>2 hours</option>
                    <option>4 hours</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Password</p>
                    <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Theme</p>
                <div className="flex gap-3">
                  {[
                    { id: 'light', icon: <Sun className="h-5 w-5" />, label: 'Light' },
                    { id: 'dark', icon: <Moon className="h-5 w-5" />, label: 'Dark' },
                    { id: 'system', icon: <Monitor className="h-5 w-5" />, label: 'System' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setDarkMode(theme.id === 'dark')}
                      className={cn(
                        'flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all',
                        (!darkMode && theme.id === 'light') || (darkMode && theme.id === 'dark')
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {theme.icon}
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Layout Density</p>
                <div className="flex gap-3">
                  {['Compact', 'Comfortable', 'Spacious'].map((density) => (
                    <button
                      key={density}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all',
                        density === 'Comfortable'
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

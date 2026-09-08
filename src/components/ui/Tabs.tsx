import { cn } from '@/utils/helpers'
import { useState, type ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
  badge?: number
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  /** Controlled active tab id */
  activeTab?: string
  onChange?: (tabId: string) => void
  className?: string
}

export function Tabs({ tabs, defaultTab, activeTab: activeTabProp, onChange, className }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id)

  const activeTab = activeTabProp ?? internalActiveTab

  const handleTabChange = (tabId: string) => {
    if (!activeTabProp) setInternalActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              disabled={tab.disabled}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                'px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>
      </div>
      <div className="py-4">
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  )
}

import { useNavigate, useLocation } from 'react-router-dom'
import {
  Brain, Cpu, Network, Database, Bot,
} from 'lucide-react'
import { Badge } from '@/components/ui'
import { cn } from '@/utils/helpers'

type TabId = 'models' | 'agents' | 'rag-systems' | 'vector-dbs'

const TABS: { id: TabId; label: string; icon: React.ReactNode; count: number }[] = [
  { id: 'models', label: 'LLM Models', icon: <Cpu className="h-4 w-4" />, count: 0 },
  { id: 'agents', label: 'AI Agents', icon: <Bot className="h-4 w-4" />, count: 0 },
  { id: 'rag-systems', label: 'RAG Systems', icon: <Network className="h-4 w-4" />, count: 0 },
  { id: 'vector-dbs', label: 'Vector DBs', icon: <Database className="h-4 w-4" />, count: 0 },
]



// Parse tabId from URL path: /ai-assets/models -> models, /ai-assets/agents -> agents
function tabFromPath(path: string): TabId {
  const segments = path.split('/').filter(Boolean)
  // path could be /ai-assets/models or /ai-assets/models/123
  if (segments.length >= 2 && segments[0] === 'ai-assets') {
    const tabSegment = segments[1] as TabId
    if (['models', 'agents', 'rag-systems', 'vector-dbs'].includes(tabSegment)) {
      return tabSegment
    }
  }
  return 'models'
}

export function AiAssetsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = tabFromPath(location.pathname)

  // Navigate to tab route
  const switchTab = (tab: TabId) => {
    navigate(`/ai-assets/${tab}`, { replace: true })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Brain className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Assets</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Manage and monitor all your AI models, agents, RAG systems, and vector databases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info">0 total assets</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Cpu className="h-4 w-4" />, label: 'LLM Models', value: '0', color: 'blue' },
          { icon: <Bot className="h-4 w-4" />, label: 'AI Agents', value: '0', color: 'cyan' },
          { icon: <Network className="h-4 w-4" />, label: 'RAG Systems', value: '0', color: 'purple' },
          { icon: <Database className="h-4 w-4" />, label: 'Vector DBs', value: '0', color: 'teal' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={cn(
              'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'cyan' ? 'bg-cyan-50 text-cyan-600' :
              stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
              'bg-teal-50 text-teal-600'
            )}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
                <span className={cn(
                  'ml-1 px-1.5 py-0.5 text-[11px] rounded-full',
                  activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                )}>{tab.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4">
          {/* Models Tab */}
          {activeTab === 'models' && (
            <div className="text-center py-12 text-gray-500">
              <Cpu className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No LLM Models</p>
              <p className="text-sm mt-1">Models will appear here once discovered or added.</p>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div className="text-center py-12 text-gray-500">
              <Bot className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No AI Agents</p>
              <p className="text-sm mt-1">Agents will appear here once discovered or added.</p>
            </div>
          )}

          {/* RAG Systems Tab */}
          {activeTab === 'rag-systems' && (
            <div className="text-center py-12 text-gray-500">
              <Network className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No RAG Systems</p>
              <p className="text-sm mt-1">RAG systems will appear here once discovered or added.</p>
            </div>
          )}

          {/* Vector DBs Tab */}
          {activeTab === 'vector-dbs' && (
            <div className="text-center py-12 text-gray-500">
              <Database className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No Vector Databases</p>
              <p className="text-sm mt-1">Vector databases will appear here once discovered or added.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Brain, Cpu, Network, Database, Bot, RefreshCw, AlertCircle
} from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import assetService from '@/services/assetService'

type TabId = 'models' | 'agents' | 'rag-systems' | 'vector-dbs'

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

   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [models, setModels] = useState<any[]>([])
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [agents, setAgents] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rags, setRags] = useState<any[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [vdbs, setVdbs] = useState<any[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [mdls, agnts, rg, vb] = await Promise.all([
          assetService.listModels().catch(() => []),
          assetService.listAgents().catch(() => []),
          assetService.listRAGSystems().catch(() => []),
          assetService.listVectorDatabases().catch(() => []),
        ])
        setModels(mdls)
        setAgents(agnts)
        setRags(rg)
        setVdbs(vb)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setError('Failed to fetch assets.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Navigate to tab route
  const switchTab = (tab: TabId) => {
    navigate(`/ai-assets/${tab}`, { replace: true })
  }

  const TABS: { id: TabId; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'models', label: 'LLM Models', icon: <Cpu className="h-4 w-4" />, count: models.length },
    { id: 'agents', label: 'AI Agents', icon: <Bot className="h-4 w-4" />, count: agents.length },
    { id: 'rag-systems', label: 'RAG Systems', icon: <Network className="h-4 w-4" />, count: rags.length },
    { id: 'vector-dbs', label: 'Vector DBs', icon: <Database className="h-4 w-4" />, count: vdbs.length },
  ]

  const totalAssets = models.length + agents.length + rags.length + vdbs.length

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500">Loading AI Assets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
        <p className="text-gray-900 font-medium">Failed to load assets</p>
        <p className="text-sm text-gray-500">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
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
          <Badge variant="info">{totalAssets} total assets</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Cpu className="h-4 w-4" />, label: 'LLM Models', value: models.length, color: 'blue' },
          { icon: <Bot className="h-4 w-4" />, label: 'AI Agents', value: agents.length, color: 'cyan' },
          { icon: <Network className="h-4 w-4" />, label: 'RAG Systems', value: rags.length, color: 'purple' },
          { icon: <Database className="h-4 w-4" />, label: 'Vector DBs', value: vdbs.length, color: 'teal' },
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
        <div className="p-0">
          {activeTab === 'models' && (
            models.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Cpu className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-900">No LLM Models</p>
                <p className="text-sm mt-1">Models will appear here once discovered or added.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {models.map(m => (
                  <div key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/ai-assets/models/${m.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Cpu className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.model_family} - {m.version}</p>
                      </div>
                    </div>
                    <Badge variant={m.is_active ? 'success' : 'default'}>{m.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'agents' && (
            agents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Bot className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-900">No AI Agents</p>
                <p className="text-sm mt-1">Agents will appear here once discovered or added.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {agents.map(a => (
                  <div key={a.id} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/ai-assets/agents/${a.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-50 text-cyan-600 rounded-lg"><Bot className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-500">{a.agent_type_display || a.agent_type}</p>
                      </div>
                    </div>
                    <Badge variant={a.status === 'active' ? 'success' : 'warning'}>{a.status_display || a.status}</Badge>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'rag-systems' && (
            rags.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Network className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-900">No RAG Systems</p>
                <p className="text-sm mt-1">RAG systems will appear here once discovered or added.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {rags.map(r => (
                  <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/ai-assets/rag-systems/${r.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Network className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.chunking_strategy}</p>
                      </div>
                    </div>
                    <Badge variant={r.is_active ? 'success' : 'default'}>{r.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'vector-dbs' && (
            vdbs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Database className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-900">No Vector Databases</p>
                <p className="text-sm mt-1">Vector databases will appear here once discovered or added.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {vdbs.map(v => (
                  <div key={v.id} className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/ai-assets/vector-dbs/${v.id}`)}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-50 text-teal-600 rounded-lg"><Database className="h-4 w-4" /></div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{v.name}</p>
                        <p className="text-xs text-gray-500">{v.db_type_display || v.db_type}</p>
                      </div>
                    </div>
                    <Badge variant={v.is_active ? 'success' : 'default'}>{v.is_active ? 'Active' : 'Inactive'}</Badge>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

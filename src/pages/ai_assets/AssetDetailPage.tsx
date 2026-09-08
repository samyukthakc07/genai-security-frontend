import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Cpu, Bot, Network, Database,
  Shield, Activity, Clock, AlertCircle,
  Bug, FileText, ChevronRight,
  TrendingUp, AlertTriangle,
} from 'lucide-react'
import { Badge, SeverityBadge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import assetService from '@/services/assetService'
import { PageLoading } from '@/components/ui/LoadingSpinner'

// ─── Types ───────────────────────────────────────────────
type AssetType = 'models' | 'agents' | 'rag-systems' | 'vector-dbs'

interface ScanSummary {
  id: string
  name: string
  type: string
  status: string
  severity: string
  findingsCount: number
  date: string
  duration: string
}

interface SecurityMetric {
  category: string
  score: number
  maxScore: number
  risk: string
  label: string
}

interface AssetDetail {
  id: string
  name: string
  type: AssetType
  provider?: string
  version?: string
  status: string
  risk: string
  description: string
  stats: { label: string; value: string; color: string }[]
  overview: Record<string, string>
  scans: ScanSummary[]
  metrics: SecurityMetric[]
  findingsCount: number
  criticalFindings: { severity: string; title: string; category: string; id: string }[]
}

// ─── Helpers ─────────────────────────────────────────────

/** Build a display AssetDetail from a live API response. */
function buildLiveAsset(type: AssetType, apiData: any): AssetDetail {
  const scans: ScanSummary[] = []
  const metrics: SecurityMetric[] = []
  const findingsCount = 0
  const criticalFind: { severity: string; title: string; category: string; id: string }[] = []

  switch (type) {
    case 'models': {
      const data = apiData as any
      return {
        id: data.id, name: data.name, type,
        provider: data.model_type ? data.model_type.charAt(0).toUpperCase() + data.model_type.slice(1) : 'N/A',
        version: data.version || 'N/A',
        status: data.is_active ? 'active' : 'inactive',
        risk: data.risk_score >= 85 ? 'critical' : data.risk_score >= 70 ? 'high' : data.risk_score >= 40 ? 'medium' : 'low',
        description: data.capabilities?.join(', ') || 'AI Model',
        stats: [
          { label: 'Risk Score', value: String(data.risk_score || 0), color: data.risk_score >= 70 ? 'red' : data.risk_score >= 40 ? 'amber' : 'green' },
          { label: 'Context Window', value: `${(data.context_window || 4096).toLocaleString()} tokens`, color: 'blue' },
          { label: 'Status', value: data.is_active ? 'Active' : 'Inactive', color: data.is_active ? 'green' : 'gray' },
          { label: 'Findings', value: String(findingsCount), color: findingsCount > 0 ? 'amber' : 'green' },
        ],
        overview: {
          'Model Type': (data.model_type_display || data.model_type || 'N/A'),
          'Model Family': data.model_family || 'N/A',
          'Version': data.version || 'N/A',
          'Context Window': `${(data.context_window || 4096).toLocaleString()} tokens`,
          'Capabilities': (data.capabilities || []).join(', ') || 'N/A',
          'Discovery': data.discovery_method || 'N/A',
        },
        scans, metrics, findingsCount,
        criticalFindings: criticalFind,
      }
    }
    case 'agents': {
      const data = apiData as any
      return {
        id: data.id, name: data.name, type,
        provider: data.model ? (typeof data.model === 'object' ? data.model.name : 'N/A') : 'N/A',
        version: 'v1.0',
        status: data.status || 'active',
        risk: data.risk_level || 'medium',
        description: data.description || 'AI Agent',
        stats: [
          { label: 'Risk Level', value: (data.risk_level || 'medium').charAt(0).toUpperCase() + (data.risk_level || 'medium').slice(1), color: data.risk_level === 'critical' ? 'red' : data.risk_level === 'high' ? 'amber' : 'green' },
          { label: 'Tools', value: String((data.tools || []).length), color: 'blue' },
          { label: 'Status', value: data.status || 'N/A', color: data.status === 'active' ? 'green' : data.status === 'idle' ? 'amber' : 'gray' },
          { label: 'Findings', value: String(findingsCount), color: findingsCount > 0 ? 'amber' : 'green' },
        ],
        overview: {
          'Agent Type': (data.agent_type_display || data.agent_type || 'N/A'),
          'Tools': String((data.tools || []).length) + ' integrated',
          'Permissions': data.human_approval_required ? 'Restricted' : 'Full',
          'Human Approval': data.human_approval_required ? 'Required' : 'Not Required',
          'Base Model': typeof data.model === 'object' ? data.model.name || 'N/A' : 'N/A',
          'Description': data.description ? data.description.substring(0, 60) + (data.description.length > 60 ? '...' : '') : 'N/A',
        },
        scans, metrics, findingsCount,
        criticalFindings: criticalFind,
      }
    }
    case 'rag-systems': {
      const data = apiData as any
      return {
        id: data.id, name: data.name, type,
        provider: data.vector_db ? (typeof data.vector_db === 'object' ? data.vector_db.name : 'N/A') : 'N/A',
        version: 'v1.0',
        status: data.is_active ? 'active' : 'inactive',
        risk: data.risk_score >= 85 ? 'critical' : data.risk_score >= 70 ? 'high' : data.risk_score >= 40 ? 'medium' : 'low',
        description: `RAG System: ${data.name} using ${data.chunking_strategy} chunking strategy.`,
        stats: [
          { label: 'Risk Score', value: String(data.risk_score || 0), color: data.risk_score >= 70 ? 'red' : data.risk_score >= 40 ? 'amber' : 'green' },
          { label: 'Chunk Size', value: `${data.chunk_size || 1000} tokens`, color: 'blue' },
          { label: 'Status', value: data.is_active ? 'Active' : 'Inactive', color: data.is_active ? 'green' : 'gray' },
          { label: 'Findings', value: String(findingsCount), color: findingsCount > 0 ? 'amber' : 'green' },
        ],
        overview: {
          'Chunking Strategy': data.chunking_strategy || 'N/A',
          'Chunk Size': `${data.chunk_size || 1000} tokens`,
          'Chunk Overlap': `${data.chunk_overlap || 200} tokens`,
          'Vector DB': typeof data.vector_db === 'object' ? data.vector_db.name : 'N/A',
          'Embedding Model': typeof data.embedding_model === 'object' ? data.embedding_model.name : 'N/A',
          'Status': data.is_active ? 'Active' : 'Inactive',
        },
        scans, metrics, findingsCount,
        criticalFindings: criticalFind,
      }
    }
    case 'vector-dbs': {
      const data = apiData as any
      return {
        id: data.id, name: data.name, type,
        provider: data.db_type_display || data.db_type || 'N/A',
        version: data.indexing_method || 'N/A',
        status: data.is_active ? 'active' : 'inactive',
        risk: data.risk_score >= 85 ? 'critical' : data.risk_score >= 70 ? 'high' : data.risk_score >= 40 ? 'medium' : 'low',
        description: `${data.db_type_display || data.db_type} database: ${data.name}. Used in ${data.tenant_id || 'default'} environment.`,
        stats: [
          { label: 'Risk Score', value: String(data.risk_score || 0), color: data.risk_score >= 70 ? 'red' : data.risk_score >= 40 ? 'amber' : 'green' },
          { label: 'Dimension', value: String(data.dimension || 0), color: 'blue' },
          { label: 'Status', value: data.is_active ? 'Active' : 'Inactive', color: data.is_active ? 'green' : 'gray' },
          { label: 'Findings', value: String(findingsCount), color: findingsCount > 0 ? 'amber' : 'green' },
        ],
        overview: {
          'DB Type': data.db_type_display || data.db_type || 'N/A',
          'Environment': data.tenant_id || 'N/A',
          'Dimension': String(data.dimension || 0),
          'Indexing Method': data.indexing_method || 'N/A',
          'Status': data.is_active ? 'Active' : 'Inactive',
          'Last Assessed': data.last_assessed_at ? new Date(data.last_assessed_at).toLocaleDateString() : 'Never',
        },
        scans, metrics, findingsCount,
        criticalFindings: criticalFind,
      }
    }
  }
}

/** Fetch an asset from the live API based on type. */
async function fetchLiveAsset(type: AssetType, id: string): Promise<any> {
  switch (type) {
    case 'models': return assetService.getModel(id)
    case 'agents': return assetService.getAgent(id)
    case 'rag-systems': return assetService.getRAGSystem(id)
    case 'vector-dbs': return assetService.getVectorDatabase(id)
  }
}

// ─── Component ───────────────────────────────────────────
export function AssetDetailPage() {
  const { type, id } = useParams<{ type: AssetType; id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'scans' | 'metrics'>('overview')
  const [liveAsset, setLiveAsset] = useState<AssetDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  const baseRoute = `/ai-assets/${type || 'models'}`

  useEffect(() => {
    if (!type || !id) {
      setIsLoading(false)
      setFetchError(true)
      return
    }
    setIsLoading(true)
    setFetchError(false)
    fetchLiveAsset(type, id)
      .then((data) => {
        setLiveAsset(buildLiveAsset(type, data))
        setFetchError(false)
      })
      .catch(() => {
        setFetchError(true)
      })
      .finally(() => setIsLoading(false))
  }, [type, id])

  const asset = liveAsset

  if (isLoading) {
    return <PageLoading />
  }

  if (!asset || fetchError) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate(baseRoute)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to AI Assets
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Asset not found</h2>
          <p className="text-sm text-gray-500 mt-1">
            The {type?.replace(/-/g, ' ') || 'AI'} asset wasn't found in the database.
          </p>
          <Button className="mt-4" onClick={() => navigate(baseRoute)}>View All Assets</Button>
        </div>
      </div>
    )
  }

  const typeLabel = type === 'models' ? 'Model' : type === 'agents' ? 'Agent' : type === 'rag-systems' ? 'RAG System' : 'Vector DB'
  const typeIcon = type === 'models' ? <Cpu className="h-5 w-5" /> : type === 'agents' ? <Bot className="h-5 w-5" /> : type === 'rag-systems' ? <Network className="h-5 w-5" /> : <Database className="h-5 w-5" />
  const iconBg = type === 'models' ? 'bg-blue-50 text-blue-600' : type === 'agents' ? 'bg-cyan-50 text-cyan-600' : type === 'rag-systems' ? 'bg-purple-50 text-purple-600' : 'bg-teal-50 text-teal-600'

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(baseRoute)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconBg}`}>
              {typeIcon}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
                <Badge variant={asset.status === 'active' ? 'success' : asset.status === 'idle' ? 'warning' : 'default'}>{asset.status}</Badge>
                <span className="text-xs text-gray-400 uppercase tracking-wide">{typeLabel}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {asset.provider} {asset.version ? `· v${asset.version}` : ''}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate(`/scans/new?target=${type}:${id}`)}>
            <Shield className="h-4 w-4" /> Run Scan
          </Button>
        </div>
      </div>

      {/* ===== Stats Row ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {asset.stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={cn(
              'text-xl font-bold',
              s.color === 'green' ? 'text-green-600' :
              s.color === 'amber' ? 'text-amber-600' :
              s.color === 'red' ? 'text-red-600' : 'text-blue-600'
            )}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ===== Tabs ===== */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'overview' as const, label: 'Overview', icon: <FileText className="h-4 w-4" /> },
              { id: 'scans' as const, label: 'Scan History', icon: <Shield className="h-4 w-4" />, badge: asset.scans.length },
              { id: 'metrics' as const, label: 'Security Metrics', icon: <TrendingUp className="h-4 w-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.icon}
                {tab.label}
                {tab.badge !== undefined && (
                  <span className={cn(
                    'ml-1 px-1.5 py-0.5 text-[11px] rounded-full',
                    activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'
                  )}>{tab.badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{asset.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(asset.overview).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider">{key}</p>
                      <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {asset.criticalFindings.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <h3 className="text-sm font-semibold text-gray-900">Critical & High Findings ({asset.criticalFindings.length})</h3>
                  </div>
                  <div className="space-y-2">
                    {asset.criticalFindings.map((f) => (
                      <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg border border-red-100 bg-red-50/30">
                        <SeverityBadge severity={f.severity} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{f.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{f.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-100">
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center',
                    asset.risk === 'critical' ? 'bg-red-100' :
                    asset.risk === 'high' ? 'bg-orange-100' :
                    asset.risk === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                  )}>
                    <AlertCircle className={cn(
                      'h-5 w-5',
                      asset.risk === 'critical' ? 'text-red-600' :
                      asset.risk === 'high' ? 'text-orange-600' :
                      asset.risk === 'medium' ? 'text-amber-600' : 'text-green-600'
                    )} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Overall Risk: <span className={cn(
                        'capitalize',
                        asset.risk === 'critical' ? 'text-red-600' :
                        asset.risk === 'high' ? 'text-orange-600' :
                        asset.risk === 'medium' ? 'text-amber-600' : 'text-green-600'
                      )}>{asset.risk}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {asset.findingsCount} total findings across {asset.scans.length} security scans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Scan History Tab ── */}
          {activeTab === 'scans' && (
            <div className="space-y-3">
              {asset.scans.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Shield className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="font-medium text-gray-900">No scans yet</p>
                  <p className="text-sm mt-1">This asset hasn't been scanned yet.</p>
                  <Button className="mt-4" onClick={() => navigate(`/scans/new?target=${type}:${id}`)}>
                    <Shield className="h-4 w-4" /> Run First Scan
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{asset.scans.length}</span> scans · Latest:{' '}
                      {[...asset.scans].sort((a, b) => b.date.localeCompare(a.date))[0]?.date}
                    </p>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/scans/new?target=${type}:${id}`)}>
                      <Shield className="h-4 w-4" /> New Scan
                    </Button>
                  </div>
                  {asset.scans.map((scan) => (
                    <div
                      key={scan.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-indigo-100 transition-all cursor-pointer"
                      onClick={() => navigate(`/scans/${scan.id}`)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'h-9 w-9 rounded-lg flex items-center justify-center',
                          scan.severity === 'critical' ? 'bg-red-50 text-red-600' :
                          scan.severity === 'high' ? 'bg-orange-50 text-orange-600' :
                          scan.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                          'bg-gray-50 text-gray-500'
                        )}>
                          {scan.status === 'running' ? <Activity className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{scan.name}</p>
                          <p className="text-xs text-gray-500">{scan.type} · {scan.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">{scan.duration}</span>
                        <span className="text-xs font-medium text-gray-500">{scan.findingsCount} findings</span>
                        <Badge variant={
                          scan.status === 'completed' ? 'success' :
                          scan.status === 'running' ? 'info' :
                          scan.status === 'failed' ? 'danger' : 'default'
                        }>{scan.status}</Badge>
                        <ChevronRight className="h-4 w-4 text-gray-300" />
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── Security Metrics Tab ── */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Overall', value: asset.stats[0]?.value || '—', color: asset.stats[0]?.color || 'gray' },
                  { label: 'OWASP Coverage', value: asset.metrics.length > 5 ? '6/10' : `${asset.metrics.length}/10`, color: 'blue' },
                  { label: 'Avg Risk Score', value: `${Math.round(asset.metrics.reduce((a, m) => a + m.score, 0) / asset.metrics.length)}%`, color: 'amber' },
                  { label: 'Critical Findings', value: String(asset.criticalFindings.length), color: asset.criticalFindings.length > 0 ? 'red' : 'green' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                    <p className={cn(
                      'text-xl font-bold',
                      s.color === 'green' ? 'text-green-600' :
                      s.color === 'amber' ? 'text-amber-600' :
                      s.color === 'red' ? 'text-red-600' : 'text-blue-600'
                    )}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">OWASP LLM Security Scores</h3>
                <div className="space-y-3">
                  {asset.metrics.map((metric) => (
                    <div key={metric.category} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{metric.category}</span>
                          <span className={cn(
                            'text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded',
                            metric.risk === 'critical' ? 'bg-red-50 text-red-600' :
                            metric.risk === 'high' ? 'bg-orange-50 text-orange-600' :
                            metric.risk === 'medium' ? 'bg-amber-50 text-amber-600' :
                            'bg-green-50 text-green-600'
                          )}>{metric.risk}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{metric.label}</span>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            metric.score >= 80 ? 'bg-green-500' :
                            metric.score >= 60 ? 'bg-amber-400' :
                            metric.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
                          )}
                          style={{ width: `${metric.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['critical', 'high', 'medium', 'low'].map((level) => {
                    const count = asset.metrics.filter((m) => m.risk === level).length
                    const colorMap: Record<string, string> = {
                      critical: 'bg-red-100 border-red-200 text-red-700',
                      high: 'bg-orange-100 border-orange-200 text-orange-700',
                      medium: 'bg-amber-100 border-amber-200 text-amber-700',
                      low: 'bg-green-100 border-green-200 text-green-700',
                    }
                    return (
                      <div key={level} className={`rounded-lg border p-3 ${colorMap[level]}`}>
                        <p className="text-2xl font-bold capitalize">{count}</p>
                        <p className="text-xs mt-0.5 capitalize">{level} categories</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Scan Activity</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        <strong className="text-gray-900">{asset.scans.length}</strong> total scans
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        <strong className="text-gray-900">{asset.scans.filter((s) => s.status === 'completed').length}</strong> completed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        <strong className="text-gray-900">{asset.findingsCount}</strong> total findings
                      </span>
                    </div>
                  </div>
                  {asset.scans.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {asset.scans.slice(0, 4).map((scan) => (
                        <div key={scan.id} className="flex items-center gap-3 text-xs">
                          <div className={cn(
                            'h-2 w-2 rounded-full',
                            scan.status === 'completed' ? 'bg-green-400' :
                            scan.status === 'running' ? 'bg-blue-400 animate-pulse' :
                            scan.status === 'failed' ? 'bg-red-400' : 'bg-gray-300'
                          )} />
                          <span className="text-gray-500">{scan.date}</span>
                          <span className="text-gray-700">{scan.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

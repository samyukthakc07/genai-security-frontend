import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2, AlertCircle, Shield, Search, ArrowUpRight,
  Bug, Key, Bot, Database, Skull, FileX, Brain, Gauge,
  Boxes, Eye, CheckCircle2,
} from 'lucide-react'
import { Badge, SeverityBadge } from '@/components/ui'
import { cn } from '@/utils/helpers'
import findingsService from '@/services/findingsService'
import type { FindingListItem } from '@/services/findingsService'

const MODULE_ICONS: Record<string, React.ReactNode> = {
  llm01: <Shield className="h-4 w-4" />,
  llm02: <Eye className="h-4 w-4" />,
  llm03: <Boxes className="h-4 w-4" />,
  llm04: <Skull className="h-4 w-4" />,
  llm05: <FileX className="h-4 w-4" />,
  llm06: <Bot className="h-4 w-4" />,
  llm07: <Key className="h-4 w-4" />,
  llm08: <Database className="h-4 w-4" />,
  llm09: <Brain className="h-4 w-4" />,
  llm10: <Gauge className="h-4 w-4" />,
}

const MODULE_NAMES: Record<string, string> = {
  llm01: 'Prompt Injection', llm02: 'Sensitive Info', llm03: 'Supply Chain',
  llm04: 'Data Poisoning', llm05: 'Output Handling', llm06: 'Excessive Agency',
  llm07: 'Prompt Leakage', llm08: 'Vector Security', llm09: 'Hallucination', llm10: 'Unbounded Consumption',
}

interface DisplayFinding {
  id: string
  title: string
  module: string
  severity: string
  status: string
  time: string
  assignee: string
}

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr}h ago`
  return d.toLocaleDateString()
}

function mapApiFinding(f: FindingListItem): DisplayFinding {
  return {
    id: f.id,
    title: f.title,
    module: f.module_type,
    severity: f.severity,
    status: f.status,
    time: formatRelativeTime(f.discovered_at || f.created_at),
    assignee: f.assigned_to || 'Unassigned',
  }
}

export function FindingsPage() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [findings, setFindings] = useState<DisplayFinding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    setFetchError(false)
    findingsService.list()
      .then((data) => {
        setFindings(data.map(mapApiFinding))
      })
      .catch(() => {
        setFetchError(true)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const filtered = findings.filter((f) => {
    if (searchQuery && !f.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (severityFilter !== 'all' && f.severity !== severityFilter) return false
    if (statusFilter !== 'all' && f.status !== statusFilter) return false
    return true
  })

  const openCount = findings.filter((f) => f.status === 'open').length
  const criticalCount = findings.filter((f) => f.severity === 'critical').length
  const highCount = findings.filter((f) => f.severity === 'high').length
  const resolvedCount = findings.filter((f) => f.status === 'resolved').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">AI Findings</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Review and manage security findings across all OWASP modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="danger">{criticalCount} critical</Badge>
          <Badge variant="warning">{openCount} open</Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: <Bug className="h-4 w-4" />, label: 'Total Findings', value: String(findings.length), color: 'blue' },
          { icon: <AlertCircle className="h-4 w-4" />, label: 'Critical', value: String(criticalCount), color: 'red' },
          { icon: <Shield className="h-4 w-4" />, label: 'High Risk', value: String(highCount), color: 'orange' },
          { icon: <CheckCircle2 className="h-4 w-4" />, label: 'Resolved', value: String(resolvedCount), color: 'green' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className={cn(
              'h-9 w-9 rounded-lg flex items-center justify-center shrink-0',
              stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
              stat.color === 'red' ? 'bg-red-50 text-red-600' :
              stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
              'bg-green-50 text-green-600'
            )}>{stat.icon}</div>
            <div>
              <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search findings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500">Loading findings...</p>
        </div>
      )}

      {/* Error state */}
      {!isLoading && fetchError && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 text-red-400" />
          <p className="font-medium text-gray-900">Failed to load findings</p>
          <p className="text-sm text-gray-500 mt-1">Could not connect to the backend. Please try again later.</p>
        </div>
      )}

      {/* Findings List */}
      {!isLoading && !fetchError && (
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {filtered.map((finding) => (
          <div
            key={finding.id}
            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/findings/${finding.id}`)}
          >
            <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              {MODULE_ICONS[finding.module]}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{finding.title}</p>
              <p className="text-xs text-gray-500">
                {MODULE_NAMES[finding.module]} · {finding.time} · {finding.assignee}
              </p>
            </div>

            <Badge variant={
              finding.status === 'open' ? 'danger' :
              finding.status === 'in_progress' ? 'warning' :
              'success'
            }>
              {finding.status === 'in_progress' ? 'In Progress' : finding.status}
            </Badge>

            <SeverityBadge severity={finding.severity} />
            <ArrowUpRight className="h-4 w-4 text-gray-300 shrink-0" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Search className="h-10 w-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-900">No findings match your filters</p>
            <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
      )}
    </div>
  )
}

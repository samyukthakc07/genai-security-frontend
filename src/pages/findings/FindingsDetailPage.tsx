import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, AlertCircle, Shield, AlertTriangle,
  FileText, Clock, Calendar, User, Hash,
  ExternalLink, BookOpen,
} from 'lucide-react'
import { Badge, SeverityBadge, Button } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { formatDate } from '@/utils/formatters'
import findingsService from '@/services/findingsService'
import type { FindingDetail, FindingNote } from '@/services/findingsService'
import { PageLoading } from '@/components/ui/LoadingSpinner'

const MODULE_COLORS: Record<string, string> = {
  llm01: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  llm02: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  llm03: 'bg-amber-50 text-amber-600 border-amber-200',
  llm04: 'bg-red-50 text-red-600 border-red-200',
  llm05: 'bg-orange-50 text-orange-600 border-orange-200',
  llm06: 'bg-purple-50 text-purple-600 border-purple-200',
  llm07: 'bg-pink-50 text-pink-600 border-pink-200',
  llm08: 'bg-teal-50 text-teal-600 border-teal-200',
  llm09: 'bg-blue-50 text-blue-600 border-blue-200',
  llm10: 'bg-green-50 text-green-600 border-green-200',
}

const MODULE_NAMES: Record<string, string> = {
  llm01: 'Prompt Injection', llm02: 'Sensitive Info', llm03: 'Supply Chain',
  llm04: 'Data Poisoning', llm05: 'Output Handling', llm06: 'Excessive Agency',
  llm07: 'Prompt Leakage', llm08: 'Vector Security', llm09: 'Hallucination',
  llm10: 'Unbounded Consumption',
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

export function FindingsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [finding, setFinding] = useState<FindingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'notes'>('overview')

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setFetchError(true)
      return
    }
    setIsLoading(true)
    setFetchError(false)
    findingsService.get(id)
      .then((data) => {
        setFinding(data)
      })
      .catch(() => {
        setFetchError(true)
      })
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <PageLoading />

  if (!finding || fetchError) {
    return (
      <div className="space-y-6">
        <button onClick={() => navigate('/findings')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" /> Back to Findings
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900">Finding not found</h2>
          <p className="text-sm text-gray-500 mt-1">The finding you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-4" onClick={() => navigate('/findings')}>Back to Findings</Button>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          {/* Description */}
          {finding.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{finding.description}</p>
            </div>
          )}

          {/* Details grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Finding Type</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{finding.finding_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">OWASP Category</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{finding.owasp_category || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">CVSS Score</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{finding.cvss_score ?? 'N/A'}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Risk Score</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{finding.risk_score}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Discovered</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{formatDate(finding.discovered_at)}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider">Last Updated</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{formatRelativeTime(finding.updated_at)}</p>
              </div>
            </div>
          </div>

          {/* Remediation */}
          {finding.remediation && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Remediation</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 leading-relaxed">{finding.remediation}</p>
              </div>
            </div>
          )}

          {/* References */}
          {finding.references && finding.references.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">References</h3>
              <div className="space-y-2">
                {finding.references.map((ref, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <ExternalLink className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span className="text-sm text-indigo-600 truncate">{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan info */}
          {finding.scan && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Scan</h3>
              <button
                onClick={() => navigate(`/scans/${finding.scan}`)}
                className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <Shield className="h-4 w-4" />
                View associated scan
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'evidence' as const,
      label: 'Evidence',
      icon: <BookOpen className="h-4 w-4" />,
      badge: finding.evidence && Object.keys(finding.evidence).length > 0 ? Object.keys(finding.evidence).length : undefined,
      content: (
        <div className="space-y-4">
          {!finding.evidence || Object.keys(finding.evidence).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No evidence recorded</p>
              <p className="text-sm mt-1">No supporting evidence was captured for this finding.</p>
            </div>
          ) : (
            Object.entries(finding.evidence).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-200">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">{key}</p>
                </div>
                <div className="p-4">
                  <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap bg-gray-50 rounded p-3 max-h-60 overflow-auto">
                    {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      id: 'notes' as const,
      label: 'Notes',
      icon: <FileText className="h-4 w-4" />,
      badge: finding.notes?.length || undefined,
      content: (
        <div className="space-y-4">
          {!finding.notes || finding.notes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="font-medium text-gray-900">No notes yet</p>
              <p className="text-sm mt-1">Notes added to this finding will appear here.</p>
            </div>
          ) : (
            finding.notes.map((note: FindingNote) => (
              <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-medium text-indigo-700">
                      {(note.user_name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{note.user_name || 'Unknown'}</span>
                  </div>
                  <span className="text-xs text-gray-400">{formatRelativeTime(note.created_at)}</span>
                </div>
                <p className="text-sm text-gray-600">{note.content}</p>
              </div>
            ))
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Back button + Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/findings')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{finding.title}</h1>
              <Badge variant={
                finding.status === 'open' ? 'danger' :
                finding.status === 'in_progress' ? 'warning' :
                'success'
              }>
                {finding.status_display || finding.status}
              </Badge>
              <SeverityBadge severity={finding.severity} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border',
                MODULE_COLORS[finding.module_type] || 'bg-gray-50 text-gray-600 border-gray-200'
              )}>
                <Hash className="h-3 w-3" />
                {finding.module_type_display || MODULE_NAMES[finding.module_type] || finding.module_type}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatRelativeTime(finding.discovered_at)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {finding.scan && (
            <Button variant="outline" size="sm" onClick={() => navigate(`/scans/${finding.scan}`)}>
              <Shield className="h-4 w-4" /> View Scan
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs">Risk Score</p>
          </div>
          <p className={cn(
            'text-xl font-bold',
            finding.risk_score >= 80 ? 'text-red-600' :
            finding.risk_score >= 60 ? 'text-orange-600' :
            finding.risk_score >= 40 ? 'text-amber-600' : 'text-green-600'
          )}>{finding.risk_score}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Shield className="h-4 w-4" />
            <p className="text-xs">Severity</p>
          </div>
          <p className="text-xl font-bold capitalize text-gray-900">{finding.severity}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <User className="h-4 w-4" />
            <p className="text-xs">Assigned To</p>
          </div>
          <p className="text-xl font-bold text-gray-900 truncate">{finding.assigned_to || 'Unassigned'}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="h-4 w-4" />
            <p className="text-xs">Status</p>
          </div>
          <p className="text-xl font-bold capitalize text-gray-900">
            {finding.status_display || finding.status.replace(/_/g, ' ')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
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
          {tabs.find((t) => t.id === activeTab)?.content}
        </div>
      </div>
    </div>
  )
}

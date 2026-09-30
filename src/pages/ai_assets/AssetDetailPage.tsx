import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Cpu, Bot, Network, Database,
  Shield, Activity, Clock, AlertCircle,
  Bug, FileText, ChevronRight, CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Badge, SeverityBadge, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { aiAssetsMockData } from '@/data/aiAssetsMockData'
import { PageLoading } from '@/components/ui/LoadingSpinner'

type AssetType = 'models' | 'agents' | 'rag-systems' | 'vector-dbs'

export function AssetDetailPage() {
  const { type, id } = useParams<{ type: AssetType; id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'overview' | 'security' | 'findings' | 'history'>('overview')
  const [asset, setAsset] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate slight network delay
    setIsLoading(true)
    const timer = setTimeout(() => {
      let collection: any[] = []
      if (type === 'agents') collection = aiAssetsMockData.agents
      else if (type === 'models') collection = aiAssetsMockData.models
      else if (type === 'rag-systems') collection = aiAssetsMockData['rag-systems']
      else if (type === 'vector-dbs') collection = aiAssetsMockData['vector-dbs']
      
      const found = collection.find(a => a.id === id)
      setAsset(found || null)
      setIsLoading(false)
    }, 200)

    return () => clearTimeout(timer)
  }, [type, id])

  if (isLoading) return <PageLoading />

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 mt-8">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Agent Not Found</h2>
        <p className="text-gray-500 mb-6">The requested AI asset could not be found or has been removed.</p>
        <Button onClick={() => navigate('/ai-assets')}>Back to AI Assets</Button>
      </div>
    )
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'models': return <Cpu className="h-5 w-5 text-purple-600" />
      case 'agents': return <Bot className="h-5 w-5 text-blue-600" />
      case 'rag-systems': return <Network className="h-5 w-5 text-emerald-600" />
      case 'vector-dbs': return <Database className="h-5 w-5 text-orange-600" />
      default: return <Cpu className="h-5 w-5 text-gray-600" />
    }
  }

  const getTypeBg = () => {
    switch (type) {
      case 'models': return 'bg-purple-100'
      case 'agents': return 'bg-blue-100'
      case 'rag-systems': return 'bg-emerald-100'
      case 'vector-dbs': return 'bg-orange-100'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai-assets')} className="mt-1">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={`p-3 rounded-xl flex-shrink-0 ${getTypeBg()}`}>
            {getTypeIcon()}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{asset.name}</h1>
              <Badge variant={asset.environment === 'Production' ? 'success' : 'warning'}>{asset.environment}</Badge>
              <Badge variant={asset.status === 'Active' ? 'success' : 'default'}>{asset.status}</Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="font-medium text-gray-700">{asset.type}</span>
              <span>•</span>
              <span>ID: {asset.id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
          <div className="text-right mr-4">
            <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Risk Score</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{asset.riskScore}<span className="text-sm text-gray-400 font-normal">/100</span></span>
              <SeverityBadge severity={asset.riskLevel.toLowerCase()} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/findings')}>View Findings</Button>
            <Button variant="outline" onClick={() => navigate('/scans')}>View Assessments</Button>
            <Button>Edit Asset</Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* ─── Tabs ─── */}
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <FileText className="h-4 w-4" /> },
              { id: 'security', label: 'Security Posture', icon: <Shield className="h-4 w-4" /> },
              { id: 'findings', label: 'Findings', icon: <Bug className="h-4 w-4" />, badge: asset.findings.length },
              { id: 'history', label: 'Activity & History', icon: <Activity className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
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

        <div className="p-6">
          {/* ─── Overview Tab ─── */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Asset Name</span>
                    <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Description</span>
                    <p className="text-sm font-medium text-gray-900">{asset.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Base Model</span>
                    <p className="text-sm font-medium text-gray-900">{asset.model}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Provider</span>
                    <p className="text-sm font-medium text-gray-900">{asset.provider}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Environment</span>
                    <p className="text-sm font-medium text-gray-900">{asset.environment}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Owner</span>
                    <p className="text-sm font-medium text-gray-900">{asset.owner}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Business Function</span>
                    <p className="text-sm font-medium text-gray-900">{asset.businessFunction}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Status</span>
                    <p className="text-sm font-medium text-gray-900">{asset.status}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-500">Created Date</span>
                    <p className="text-sm font-medium text-gray-900">{asset.createdDate}</p>
                  </div>
                </div>
              </div>

              {type === 'agents' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Capabilities & Integrations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="text-sm font-semibold">Capabilities</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <ul className="space-y-2">
                          {asset.capabilities?.map((cap: string, i: number) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                              <CheckCircle2 className="h-4 w-4 text-green-500" /> {cap}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3 border-b border-gray-100">
                        <CardTitle className="text-sm font-semibold">Tools / Integrations</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 flex flex-wrap gap-2">
                        {asset.integrations?.map((int: string, i: number) => (
                          <Badge key={i} variant="default" className="bg-gray-50 text-gray-700">{int}</Badge>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {type === 'agents' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Permissions</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-900">Permission Scope</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Risk Assessment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {asset.permissions?.map((perm: any, i: number) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-gray-900">{perm.name}</td>
                            <td className="px-4 py-3">
                              <SeverityBadge severity={perm.risk.toLowerCase()} />
                            </td>
                          </tr>
                        ))}
                        {(!asset.permissions || asset.permissions.length === 0) && (
                          <tr><td colSpan={2} className="px-4 py-4 text-center text-gray-500">No specific permissions configured.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Security Posture Tab ─── */}
          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Overall Risk Score</p>
                  <p className="text-2xl font-bold text-gray-900">{asset.riskScore}<span className="text-sm text-gray-400">/100</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Risk Level</p>
                  <SeverityBadge severity={asset.riskLevel.toLowerCase()} className="mt-1" />
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Open Findings</p>
                  <p className="text-2xl font-bold text-gray-900">{asset.findings?.length || 0}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">OWASP Coverage</p>
                  <p className="text-2xl font-bold text-gray-900">{asset.owaspExposure?.length || 0}<span className="text-sm text-gray-400">/10</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500 font-medium mb-1">Last Assessment</p>
                  <p className="text-sm font-bold text-gray-900 mt-2">{asset.lastAssessment}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">OWASP LLM Risk Exposure</h3>
                  <div className="space-y-3">
                    {asset.owaspExposure?.length > 0 ? asset.owaspExposure.map((exp: any) => (
                      <div key={exp.id} className="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-bold text-gray-900">{exp.number} {exp.name}</span>
                          <SeverityBadge severity={exp.risk.toLowerCase()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Risk Score:</span>
                            <span className="text-xs font-bold text-gray-900">{exp.score}</span>
                          </div>
                          <span className="text-xs font-medium text-indigo-600">{exp.findings} findings</span>
                        </div>
                      </div>
                    )) : (
                      <div className="text-sm text-gray-500 border border-dashed rounded-lg p-6 text-center">No identified OWASP LLM exposures.</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Controls</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-gray-900">Control</th>
                          <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {asset.securityControls?.map((ctrl: any, i: number) => (
                          <tr key={i}>
                            <td className="px-4 py-3 text-gray-900">{ctrl.name}</td>
                            <td className="px-4 py-3">
                              <Badge variant={ctrl.status === 'Enabled' ? 'success' : ctrl.status.includes('Improvement') ? 'danger' : 'warning'}>
                                {ctrl.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                        {(!asset.securityControls || asset.securityControls.length === 0) && (
                          <tr><td colSpan={2} className="px-4 py-4 text-center text-gray-500">No security controls evaluated.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Findings Tab ─── */}
          {activeTab === 'findings' && (
            <div className="space-y-4">
              {asset.findings?.length > 0 ? asset.findings.map((finding: any) => (
                <div key={finding.id} className="p-4 rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer" onClick={() => navigate('/findings')}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <SeverityBadge severity={finding.severity.toLowerCase()} />
                      <h4 className="text-sm font-bold text-gray-900">{finding.title}</h4>
                    </div>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">{finding.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs mb-4 pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Category: <span className="font-medium text-gray-900">{finding.category}</span></span>
                    <span className="text-gray-600">Score: <span className="font-bold text-gray-900">{finding.score}</span></span>
                    <span className="text-gray-600">Status: <Badge variant={finding.status === 'Open' ? 'danger' : 'warning'} className="text-[10px] uppercase">{finding.status}</Badge></span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-1">Description</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{finding.description}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 mb-1">Recommendation</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{finding.recommendation}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Shield className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-gray-900">No Open Findings</h3>
                  <p className="text-sm text-gray-500 mt-1">This asset has a clean security posture.</p>
                </div>
              )}
            </div>
          )}

          {/* ─── History Tab ─── */}
          {activeTab === 'history' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Assessments</h3>
                <div className="space-y-4">
                  {asset.assessments?.length > 0 ? asset.assessments.map((asm: any) => (
                    <div key={asm.id} className="p-4 rounded-xl border border-gray-100 flex justify-between items-center bg-white shadow-sm hover:border-indigo-200 cursor-pointer transition-all" onClick={() => navigate('/scans')}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">{asm.type}</span>
                          <Badge variant="success" className="text-[10px]">{asm.status}</Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {asm.date} • {asm.tests} tests • <span className="font-medium text-indigo-600">{asm.findings} findings</span>
                        </div>
                      </div>
                      <SeverityBadge severity={asm.risk.toLowerCase()} />
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic border p-6 rounded-lg bg-gray-50 text-center border-dashed">No recent assessments.</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Timeline</h3>
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                  {asset.activity?.length > 0 ? asset.activity.map((act: any, i: number) => (
                    <div key={act.id || i} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-indigo-500 border-[3px] border-white box-content shadow-sm" />
                      <p className="text-sm text-gray-900 leading-snug">{act.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{new Date(act.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-500 italic pl-4">No recent activity.</p>
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

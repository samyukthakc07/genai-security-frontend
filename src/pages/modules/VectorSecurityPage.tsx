import { useState } from 'react'
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Database, Layers, Lock, Unlock, AlertCircle, Server, GitBranch, Loader2, Eye, Fingerprint } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type VectorSecurityItem } from '@/hooks/useModuleApi'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { ResultsSummary, ResultsTable, ModuleStatCard, RiskScoreCard, renderSafeString } from "./components/ResultsDisplay"
  

  


export function VectorSecurityPage() {
  const [activeTab, setActiveTab] = useState('assessments')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: assessments, isLoading } = useModuleApi<any>('/vector-security/assessments/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: exposures, isLoading: exposuresLoading } = useModuleApi<any>('/vector-security/embedding-exposures/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ragAssessments, isLoading: ragLoading } = useModuleApi<any>('/vector-security/rag-assessments/')

  const assessmentColumns = [
    { key: 'vector_db', label: 'Vector DB', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{renderSafeString(v)}</span> },
    { key: 'tenant_isolation_valid', label: 'Tenant Isolation', render: (v: unknown) => v ? <Badge variant="success">Valid</Badge> : <Badge variant="danger">Invalid</Badge> },
    { key: 'encryption_at_rest', label: 'Encryption at Rest', render: (v: unknown) => v ? <Lock className="h-4 w-4 text-green-500" /> : <Unlock className="h-4 w-4 text-red-500" /> },
    { key: 'encryption_in_transit', label: 'Encryption in Transit', render: (v: unknown) => v ? <Lock className="h-4 w-4 text-green-500" /> : <Unlock className="h-4 w-4 text-red-500" /> },
    { key: 'access_control_score', label: 'Access Control', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 80 ? 'low' : score >= 60 ? 'medium' : 'high'} />
    }},
    { key: 'security_score', label: 'Security Score', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }} /></div><span className="text-xs font-medium">{score.toFixed(0)}%</span></div>
    }},
  ]

  const exposureColumns = [
    { key: 'embedding_id', label: 'Embedding ID', sortable: true, render: (v: unknown) => <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{renderSafeString(v)}</code> },
    { key: 'sensitive_data_type', label: 'Data Type', sortable: true, render: (v: unknown) => <Badge variant="danger">{renderSafeString(v)}</Badge> },
    { key: 'risk_level', label: 'Risk Level', sortable: true, render: (v: unknown) => <SeverityBadge severity={renderSafeString(v) || 'medium'} /> },
    { key: 'created_at', label: 'Found', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  const ragColumns = [
    { key: 'rag_system', label: 'RAG System', sortable: true, render: (v: unknown) => <span className="font-medium text-gray-900">{renderSafeString(v)}</span> },
    { key: 'retrieval_security_score', label: 'Retrieval Security', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <div className="flex items-center gap-2"><div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444' }} /></div><span className="text-xs font-medium">{score.toFixed(0)}</span></div>
    }},
    { key: 'prompt_injection_risk', label: 'Injection Risk', render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low'} />
    }},
    { key: 'data_exposure_risk', label: 'Exposure Risk', render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low'} />
    }},
    { key: 'created_at', label: 'Checked', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center">
              <Database className="h-4 w-4 text-teal-600" />
            </div>
            <Badge variant="warning" size="sm">LLM08</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Vector & Embedding Security</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Assess vector database security, tenant isolation, and detect sensitive data in embeddings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Server className="h-5 w-5" />} label="Vector DBs" value={assessments.length} color="indigo" />
        <ModuleStatCard icon={<Lock className="h-5 w-5" />} label="Secured" value={assessments.filter((a) => {
          const score = typeof a.security_score === 'number' ? a.security_score : Number(a.security_score)
          return score >= 70
        }).length} color="green" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="At Risk" value={assessments.filter((a) => {
          const score = typeof a.security_score === 'number' ? a.security_score : Number(a.security_score)
          return score < 70
        }).length} color="red" trend={assessments.filter((a) => (typeof a.security_score === 'number' ? a.security_score : Number(a.security_score)) < 70).length > 0 ? { value: 10, isUp: true } : undefined} />
        <ModuleStatCard icon={<Layers className="h-5 w-5" />} label="Exposures" value={exposures.length} color="orange" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {assessments.map((a) => (
          <RiskScoreCard key={a.id} score={typeof a.security_score === 'number' ? a.security_score : Number(a.security_score)} label={String(renderSafeString(a.vector_db))} />
        ))}
      </div>

      <Tabs tabs={[
        { id: 'assessments', label: 'DB Assessments', content: null },
        { id: 'exposures', label: 'Embedding Exposures', content: null },
        { id: 'rag', label: 'RAG Security', content: null },
      ]} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'assessments' && (
        <Card>
          <CardHeader>
            <CardTitle>Vector Database Security Assessments</CardTitle>
            <Badge variant="info">{assessments.length} assessments</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                <span className="ml-2 text-sm text-gray-500">Loading assessments...</span>
              </div>
            ) : (
              <ResultsTable columns={assessmentColumns} data={assessments as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'exposures' && (
        <Card>
          <CardHeader>
            <CardTitle>Sensitive Data in Embeddings</CardTitle>
            <Badge variant="danger">{exposures.length} exposures</Badge>
          </CardHeader>
          <CardContent>
            {exposuresLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading exposures...</span></div>
            ) : (
              <ResultsTable columns={exposureColumns} data={exposures as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'rag' && (
        <Card>
          <CardHeader>
            <CardTitle>RAG Security Assessments</CardTitle>
            <Badge variant="info">{ragAssessments.length} assessments</Badge>
          </CardHeader>
          <CardContent>
            {ragLoading ? (
              <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading RAG security data...</span></div>
            ) : ragAssessments.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-400">No RAG security assessments found</div>
            ) : (
              <ResultsTable columns={ragColumns} data={ragAssessments as unknown as Record<string, unknown>[]} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

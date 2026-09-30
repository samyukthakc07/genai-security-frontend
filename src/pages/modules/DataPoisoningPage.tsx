import { useState } from 'react'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Skull, Database, FileSearch, AlertCircle, CheckCircle2, FlaskConical, Loader2, FileText, ShieldCheck } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { ScanForm } from './components/ScanForm'
import { ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type DataPoisoningItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

const SCAN_FIELDS = [
  { name: 'data_source', label: 'Data Source', type: 'select' as const, required: true, options: [
    { value: 'training', label: 'Training Data' },
    { value: 'fine_tuning', label: 'Fine-Tuning Data' },
    { value: 'rag_document', label: 'RAG Document' },
    { value: 'embedding', label: 'Embedding Source' },
    { value: 'validation', label: 'Validation Set' },
  ]},
  { name: 'data_fingerprint', label: 'Data Fingerprint/Hash', type: 'text' as const, placeholder: 'Optional: MD5/SHA-256 hash of the dataset...' },
  { name: 'notes', label: 'Additional Notes', type: 'textarea' as const, placeholder: 'Any context about the data source...', rows: 3 },
]



 
export function DataPoisoningPage() {
   
  const [isScanning, setIsScanning] = useState(false)
   
  const [activeTab, setActiveTab] = useState('validations')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: validations, isLoading, createItem } = useModuleApi<any>('/data-poisoning/validations/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: ragDocs, isLoading: ragDocsLoading } = useModuleApi<any>('/data-poisoning/rag-documents/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: integrityChecks, isLoading: integrityLoading } = useModuleApi<any>('/data-poisoning/integrity-checks/')

  const handleScan = async (data: Record<string, unknown>) => {
    setIsScanning(true)
    try {
      await createItem({
        data_source: data.data_source as string,
        data_fingerprint: data.data_fingerprint as string,
        notes: data.notes as string,
      })
    } finally {
      setIsScanning(false)
    }
  }

  const columns = [
    { key: 'data_source', label: 'Data Source', sortable: true, render: (v: unknown) => <Badge variant="info">{capitalize((v as string).replace(/_/g, ' '))}</Badge> },
    { key: 'integrity_score', label: 'Integrity', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <span className={`font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{score.toFixed(0)}%</span>
    }},
    { key: 'anomalies_detected', label: 'Anomalies', render: (v: unknown) => {
      const anomalies = Array.isArray(v) ? v : []
      return <SeverityBadge severity={anomalies.length > 5 ? 'critical' : anomalies.length > 2 ? 'high' : anomalies.length > 0 ? 'medium' : 'low'} />
    }},
    { key: 'trust_score', label: 'Trust Score', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <span className="font-medium">{score.toFixed(0)}%</span>
    }},
    { key: 'validation_status', label: 'Status', sortable: true, render: (v: unknown) => <Badge variant={v === 'passed' ? 'success' : v === 'warning' ? 'warning' : 'danger'}>{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'created_at', label: 'Checked', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Skull className="h-4 w-4 text-purple-600" />
            </div>
            <Badge variant="warning" size="sm">LLM04</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Data & Model Poisoning</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Detect poisoned training data, compromised RAG documents, and integrity breaches</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Database className="h-5 w-5" />} label="Validations" value={validations.length} color="indigo" />
        <ModuleStatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Passed" value={validations.filter((v) => v.validation_status === 'passed').length} color="green" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Warnings/Failed" value={validations.filter((v) => v.validation_status !== 'passed').length} color="red" trend={{ value: 23, isUp: true }} />
        <ModuleStatCard icon={<FlaskConical className="h-5 w-5" />} label="Anomalies Found" value={validations.reduce((a, v) => a + (Array.isArray(v.anomalies_detected) ? v.anomalies_detected.length : 0), 0)} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScanForm
            title="Validate Data Source"
            description="Check training data, RAG documents, and embeddings for signs of tampering"
            fields={SCAN_FIELDS}
            onSubmit={handleScan}
            isScanning={isScanning}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs tabs={[
            { id: 'validations', label: 'Data Validations', content: null },
            { id: 'rag', label: 'RAG Documents', content: null },
            { id: 'integrity', label: 'Integrity Checks', content: null },
          ]} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'validations' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading validations...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary
                    totalItems={validations.length}
                    riskItems={validations.filter((v) => v.validation_status !== 'passed').length}
                    safeItems={validations.filter((v) => v.validation_status === 'passed').length}
                    criticalItems={validations.filter((v) => v.validation_status === 'failed').length}
                    highItems={validations.filter((v) => v.validation_status === 'warning').length}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Validation Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable columns={columns} data={validations as unknown as Record<string, unknown>[]} />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {activeTab === 'rag' && (
            <Card>
              <CardHeader>
                <CardTitle>RAG Document Validations</CardTitle>
                <Badge variant={ragDocs.filter((d) => d.is_poisoned).length > 0 ? 'danger' : 'info'}>{ragDocs.filter((d) => d.is_poisoned).length} poisoned</Badge>
              </CardHeader>
              <CardContent>
                {ragDocsLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading RAG documents...</span></div>
                ) : (
                  <div className="space-y-3">
                    {ragDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 flex-1">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.document_name}</p>
                            <p className="text-xs text-gray-500">ID: {doc.document_id} | Confidence: {Number(doc.confidence_score || 0).toFixed(1)}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {doc.is_poisoned ? (
                            <Badge variant="danger">Poisoned</Badge>
                          ) : (
                            <Badge variant="success">Clean</Badge>
                          )}
                          <span className="text-xs text-gray-400">{formatRelativeTime(doc.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'integrity' && (
            <Card>
              <CardHeader>
                <CardTitle>Dataset Integrity Checks</CardTitle>
                <Badge variant="info">{integrityChecks.length} checks</Badge>
              </CardHeader>
              <CardContent>
                {integrityLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading integrity checks...</span></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['hash', 'statistical', 'provenance', 'poisoning'].map((type) => {
                      const checks = integrityChecks.filter((c) => c.check_type === type)
                      const passRate = checks.length > 0 ? Math.round((checks.filter((c) => c.is_passed).length / checks.length) * 100) : 0
                      const avgScore = checks.length > 0 ? Math.round(checks.reduce((a, c) => a + c.score, 0) / checks.length) : 0
                      return (
                        <div key={type} className="p-4 rounded-lg border border-gray-200 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-gray-900 capitalize">{type} Check</p>
                            <span className="text-xs">{passRate}% pass rate</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{checks.length} runs</span>
                            <span>Avg score: {avgScore}%</span>
                          </div>
                          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${avgScore}%`, backgroundColor: avgScore >= 80 ? '#22c55e' : avgScore >= 60 ? '#eab308' : '#ef4444' }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

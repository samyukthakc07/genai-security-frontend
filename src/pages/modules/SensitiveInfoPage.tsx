import { useState } from 'react'
 
 
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Eye, Key, UserCheck, CreditCard, Mail, Phone, FileKey, AlertCircle, Loader2, Layers } from 'lucide-react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Button, Tabs } from '@/components/ui'
import { ScanForm } from './components/ScanForm'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RiskScoreCard, ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
import { useModuleApi, type SensitiveInfoItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

const SCAN_FIELDS = [
  { name: 'context_snippet', label: 'Text to Scan', type: 'textarea' as const, placeholder: 'Paste text, prompt output, or log content to scan for secrets and PII...', required: true, rows: 6 },
  { name: 'source', label: 'Source', type: 'select' as const, required: true, options: [
    { value: 'prompt', label: 'User Prompt' },
    { value: 'model_output', label: 'Model Output' },
    { value: 'training_data', label: 'Training Data' },
    { value: 'system_prompt', label: 'System Prompt' },
    { value: 'config', label: 'Configuration' },
    { value: 'log', label: 'Log File' },
  ]},
]


const SECRET_TYPES_DETECTED = [
  { type: 'API Keys', count: 0, color: 'red' },
  { type: 'Passwords', count: 0, color: 'orange' },
  { type: 'Tokens', count: 0, color: 'purple' },
  { type: 'PII Records', count: 0, color: 'blue' },
  { type: 'Database URLs', count: 0, color: 'cyan' },
 
]
  

export function SensitiveInfoPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [activeTab, setActiveTab] = useState('secrets')
  const [selectedSecret, setSelectedSecret] = useState<SensitiveInfoItem | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: secrets, isLoading, createItem } = useModuleApi<any>('/sensitive-info/secrets/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: piiFindings, isLoading: piiLoading } = useModuleApi<any>('/sensitive-info/pii/')

  const handleScan = async (data: Record<string, unknown>) => {
    setIsScanning(true)
    try {
      const created = await createItem({
        context_snippet: data.context_snippet as string,
        source: data.source as string,
        scan_id: undefined,
      })
      if (created) setSelectedSecret(created)
    } finally {
      setIsScanning(false)
    }
  }

  const criticalSecrets = secrets.filter((s) => s.risk_level === 'critical')
  const validatedSecrets = secrets.filter((s) => s.is_validated)
  const secretTypes = new Set(secrets.map((s) => s.secret_type))
  const secretCounts = [...secretTypes].map((type) => ({
    type: type.replace(/_/g, ' ').toUpperCase(),
    count: secrets.filter((s) => s.secret_type === type).length,
  }))

  const columns = [
    { key: 'secret_type', label: 'Secret Type', sortable: true, render: (v: unknown) => <Badge variant="danger">{capitalize((v as string).replace(/_/g, ' '))}</Badge> },
    { key: 'detected_value_hash', label: 'Hash', render: (v: unknown) => <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">{renderSafeString(v) || 'N/A'}</code> },
    { key: 'source', label: 'Source', sortable: true, render: (v: unknown) => <span className="text-xs text-gray-600">{capitalize(String(renderSafeString(v)))}</span> },
    { key: 'risk_level', label: 'Risk', sortable: true, render: (v: unknown) => <SeverityBadge severity={renderSafeString(v)} /> },
    { key: 'severity_score', label: 'Score', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <span className={`font-medium ${score >= 80 ? 'text-red-600' : score >= 60 ? 'text-orange-600' : 'text-yellow-600'}`}>{score}</span>
    }},
    { key: 'is_validated', label: 'Validated', render: (v: unknown) => v ? <Badge variant="success">Yes</Badge> : <Badge variant="default">No</Badge> },
    { key: 'created_at', label: 'Time', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Eye className="h-4 w-4 text-orange-600" />
            </div>
            <Badge variant="danger" size="sm">LLM02</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Sensitive Information Disclosure</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Detect exposed secrets, credentials, and PII in LLM interactions and training data
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Key className="h-5 w-5" />} label="Secrets Found" value={secrets.length} color="red" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Critical" value={criticalSecrets.length} color="red" trend={{ value: 8, isUp: true }} />
        <ModuleStatCard icon={<UserCheck className="h-5 w-5" />} label="Validated" value={validatedSecrets.length} color="green" />
        <ModuleStatCard icon={<FileKey className="h-5 w-5" />} label="Secret Types" value={secretTypes.size || 5} color="purple" />
      </div>

      {/* Secret type breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Secret Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {secretCounts.length > 0 ? secretCounts.map((item) => (
              <div key={item.type} className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-gray-700">{item.count}</p>
                <p className="text-xs text-gray-500 mt-1">{item.type}</p>
              </div>
            )) : SECRET_TYPES_DETECTED.map((item) => (
              <div key={item.type} className="text-center p-3 rounded-lg bg-gray-50">
                <p className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</p>
                <p className="text-xs text-gray-500 mt-1">{item.type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScanForm
            title="Scan for Secrets"
            description="Analyze text content for API keys, passwords, tokens, and PII"
            fields={SCAN_FIELDS}
            onSubmit={handleScan}
            isScanning={isScanning}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs
            tabs={[
              { id: 'secrets', label: 'Detected Secrets', content: null },
              { id: 'pii', label: 'PII Findings', content: null },
              { id: 'sources', label: 'By Source', content: null },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'secrets' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading secrets...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary
                    totalItems={secrets.length}
                    riskItems={secrets.filter((s) => s.risk_level !== 'low').length}
                    safeItems={secrets.filter((s) => s.risk_level === 'low').length}
                    criticalItems={criticalSecrets.length}
                    highItems={secrets.filter((s) => s.risk_level === 'high').length}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Secrets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable
                        columns={columns}
                        data={secrets as unknown as Record<string, unknown>[]}
                        onRowClick={(row) => setSelectedSecret(row as unknown as SensitiveInfoItem)}
                      />
                    </CardContent>
                  </Card>

                  {selectedSecret && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Secret Detail</CardTitle>
                        <SeverityBadge severity={selectedSecret.risk_level} />
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Secret Type</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{selectedSecret.secret_type.replace(/_/g, ' ')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Hash</p>
                          <code className="text-xs font-mono bg-gray-200 px-1.5 py-0.5 rounded">{selectedSecret.detected_value_hash}</code>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Source</p>
                          <p className="text-sm font-medium text-gray-900 capitalize">{selectedSecret.source}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Severity Score</p>
                          <p className="text-sm font-medium text-gray-900">{typeof selectedSecret.severity_score === 'number' ? selectedSecret.severity_score : Number(selectedSecret.severity_score)}/100</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Validated</p>
                          <Badge variant={selectedSecret.is_validated ? 'success' : 'default'}>{selectedSecret.is_validated ? 'Yes - Confirmed' : 'Pending Validation'}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === 'pii' && (
            <Card>
              <CardHeader>
                <CardTitle>PII Findings</CardTitle>
                <Badge variant="danger">{piiFindings.length} PII types</Badge>
              </CardHeader>
              <CardContent>
                {piiLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading PII findings...</span></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {piiFindings.map((pii) => (
                      <div key={pii.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 capitalize">{pii.pii_type}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{pii.count}</p>
                        <div className="flex items-center justify-between mt-2">
                          <SeverityBadge severity={pii.risk_level || 'medium'} />
                          <span className="text-xs text-gray-400">{formatRelativeTime(pii.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'sources' && (
            <Card>
              <CardHeader>
                <CardTitle>Secrets by Source</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {['model_output', 'prompt', 'system_prompt', 'log', 'config', 'training_data'].map((src) => {
                    const count = secrets.filter((s) => s.source === src).length
                    return (
                      <div key={src} className="p-4 rounded-lg bg-gray-50">
                        <p className="text-sm font-medium text-gray-900 capitalize mb-1">{src.replace(/_/g, ' ')}</p>
                        <p className="text-2xl font-bold" style={{ color: count > 2 ? '#dc2626' : count > 0 ? '#f97316' : '#22c55e' }}>{count}</p>
                        <p className="text-xs text-gray-500">secrets found</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

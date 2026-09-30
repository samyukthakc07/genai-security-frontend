import { useState } from 'react'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, Key, Lock, Search, AlertCircle, Eye, EyeOff, FileText, Loader2, ShieldAlert } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { ScanForm } from './components/ScanForm'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RiskScoreCard, ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type PromptLeakageItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

const SCAN_FIELDS = [
  { name: 'system_prompt', label: 'System Prompt', type: 'textarea' as const, placeholder: 'Paste the system prompt to test for leakage vulnerabilities...', required: true, rows: 6 },
  { name: 'context', label: 'Application Context', type: 'textarea' as const, placeholder: 'Optional: describe how this prompt is used in your application...', rows: 3 },
]


  

 
export function PromptLeakagePage() {
  const [isScanning, setIsScanning] = useState(false)
  const [activeTab, setActiveTab] = useState('scans')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: scans, isLoading, createItem } = useModuleApi<any>('/prompt-leakage/scans/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: secretsInPrompts, isLoading: secretsLoading } = useModuleApi<any>('/prompt-leakage/secrets/')

  const handleScan = async (data: Record<string, unknown>) => {
    setIsScanning(true)
    try {
      await createItem({
        system_prompt: data.system_prompt as string,
      })
    } finally {
      setIsScanning(false)
    }
  }

  const leakFound = scans.filter((s) => s.leakage_found)
  const avgHardening = scans.length > 0
    ? Math.round(scans.reduce((a, s) => a + (typeof s.prompt_hardening_score === 'number' ? s.prompt_hardening_score : Number(s.prompt_hardening_score)), 0) / scans.length)
    : 0
  const secretsCount = secretsInPrompts.length

  const columns = [
    { key: 'leakage_found', label: 'Leakage', render: (v: unknown) => v ? <Badge variant="danger">Detected</Badge> : <Badge variant="success">None</Badge> },
    { key: 'exposure_type', label: 'Exposure Type', sortable: true, render: (v: unknown) => <Badge variant={v === 'none' ? 'success' : 'warning'}>{capitalize((v as string).replace(/_/g, ' '))}</Badge> },
    { key: 'risk_score', label: 'Risk Score', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low'} />
    }},
    { key: 'prompt_hardening_score', label: 'Hardening', sortable: true, render: (v: unknown) => {
      const hardening = typeof v === 'number' ? v : Number(v) || 0
      return <div className="flex items-center gap-2"><div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 rounded-full" style={{ width: `${hardening}%` }} /></div><span className="text-xs text-gray-500">{hardening.toFixed(0)}%</span></div>
    }},
    { key: 'recommendations', label: 'Recs', render: (v: unknown) => {
      const recs = Array.isArray(v) ? v : []
      return <Badge variant="info">{recs.length}</Badge>
    }},
    { key: 'created_at', label: 'Time', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <Key className="h-4 w-4 text-pink-600" />
            </div>
            <Badge variant="danger" size="sm">LLM07</Badge>
            <h1 className="text-2xl font-bold text-gray-900">System Prompt Leakage</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Detect and prevent extraction of system prompts, secrets, and sensitive instructions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Search className="h-5 w-5" />} label="Scans Performed" value={scans.length} color="indigo" />
        <ModuleStatCard icon={<Eye className="h-5 w-5" />} label="Leakage Detected" value={leakFound.length} color="red" trend={{ value: 22, isUp: true }} />
        <ModuleStatCard icon={<Shield className="h-5 w-5" />} label="Avg Hardening" value={`${avgHardening}%`} color={avgHardening > 50 ? 'green' : 'orange'} />
        <ModuleStatCard icon={<FileText className="h-5 w-5" />} label="Secrets Found" value={secretsCount} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScanForm
            title="Test Prompt Leakage"
            description="Analyze your system prompt for leakage vulnerabilities and hardening opportunities"
            fields={SCAN_FIELDS}
            onSubmit={handleScan}
            isScanning={isScanning}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs tabs={[
            { id: 'scans', label: 'Leakage Scans', content: null },
            { id: 'secrets', label: 'Secrets in Prompts', content: null },
            { id: 'hardening', label: 'Hardening Guide', content: null },
          ]} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'scans' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading scans...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary totalItems={scans.length} riskItems={leakFound.length} safeItems={scans.filter((s) => !s.leakage_found).length}
                    criticalItems={scans.filter((s) => typeof s.risk_score === 'number' ? s.risk_score >= 80 : Number(s.risk_score) >= 80).length}
                    highItems={scans.filter((s) => (typeof s.risk_score === 'number' ? s.risk_score : Number(s.risk_score)) >= 60 && (typeof s.risk_score === 'number' ? s.risk_score : Number(s.risk_score)) < 80).length} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Scan Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable columns={columns} data={scans as unknown as Record<string, unknown>[]} />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {activeTab === 'secrets' && (
            <Card>
              <CardHeader>
                <CardTitle>Secrets Detected in System Prompts</CardTitle>
                <Badge variant="danger">{secretsInPrompts.length} secrets</Badge>
              </CardHeader>
              <CardContent>
                {secretsLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading secrets...</span></div>
                ) : (
                  <div className="space-y-3">
                    {secretsInPrompts.map((s) => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <EyeOff className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{s.secret_type.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500">{s.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={s.risk_level || 'medium'} />
                          <span className="text-xs text-gray-400">{formatRelativeTime(s.created_at)}</span>
                        </div>
                      </div>
                    ))}
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

import { useState } from 'react'
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, FileX, Code, AlertCircle, ShieldCheck, Bug, Terminal, Loader2, Ban, Eye } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { ScanForm } from './components/ScanForm'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RiskScoreCard, ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type OutputHandlingItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

const SCAN_FIELDS = [
  { name: 'output_type', label: 'Output Type', type: 'select' as const, required: true, options: [
    { value: 'html', label: 'HTML' },
    { value: 'code', label: 'Generated Code' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'text', label: 'Plain Text' },
    { value: 'json', label: 'JSON' },
    { value: 'sql', label: 'SQL Query' },
    { value: 'shell', label: 'Shell Command' },
  ]},
  { name: 'raw_output', label: 'Output Content', type: 'textarea' as const, placeholder: 'Paste the LLM-generated output to analyze for security issues...', required: true, rows: 6 },
]



 
export function OutputHandlingPage() {
   
  const [isScanning, setIsScanning] = useState(false)
   
  const [activeTab, setActiveTab] = useState('sanitizations')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: sanitizations, isLoading, createItem } = useModuleApi<any>('/output-handling/sanitizations/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: xssFindings, isLoading: xssLoading } = useModuleApi<any>('/output-handling/xss/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: unsafeCode, isLoading: unsafeLoading } = useModuleApi<any>('/output-handling/unsafe-code/')

  const handleScan = async (data: Record<string, unknown>) => {
    setIsScanning(true)
    try {
      await createItem({
        output_type: data.output_type as string,
        raw_output: data.raw_output as string,
      })
    } finally {
      setIsScanning(false)
    }
  }

  const columns = [
    { key: 'output_type', label: 'Type', sortable: true, render: (v: unknown) => <Badge variant="info">{capitalize(String(renderSafeString(v)))}</Badge> },
    { key: 'severity', label: 'Severity', sortable: true, render: (v: unknown) => <SeverityBadge severity={renderSafeString(v)} /> },
    { key: 'risk_score', label: 'Risk', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <span className={`font-medium ${score >= 80 ? 'text-red-600' : score >= 60 ? 'text-orange-600' : score >= 40 ? 'text-yellow-600' : 'text-green-600'}`}>{score.toFixed(0)}</span>
    }},
    { key: 'vulnerabilities_found', label: 'Vulns', render: (v: unknown) => {
      const vulns = Array.isArray(v) ? v : []
      return <SeverityBadge severity={vulns.length === 0 ? 'low' : vulns.length >= 3 ? 'critical' : 'high'} />
    }},
    { key: 'is_sanitized', label: 'Sanitized', render: (v: unknown) => v ? <Badge variant="success">Yes</Badge> : <Badge variant="danger">No</Badge> },
    { key: 'created_at', label: 'Time', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-rose-100 flex items-center justify-center">
              <FileX className="h-4 w-4 text-rose-600" />
            </div>
            <Badge variant="danger" size="sm">LLM05</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Improper Output Handling</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Validate and sanitize LLM outputs to prevent XSS, code injection, and unsafe content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Code className="h-5 w-5" />} label="Outputs Analyzed" value={sanitizations.length} color="indigo" />
        <ModuleStatCard icon={<Bug className="h-5 w-5" />} label="Vulnerabilities" value={sanitizations.reduce((a, s) => a + (Array.isArray(s.vulnerabilities_found) ? s.vulnerabilities_found.length : 0), 0)} color="red" trend={{ value: 18, isUp: true }} />
        <ModuleStatCard icon={<ShieldCheck className="h-5 w-5" />} label="Sanitized" value={sanitizations.filter((s) => s.is_sanitized).length} color="green" />
        <ModuleStatCard icon={<Terminal className="h-5 w-5" />} label="Output Types" value={new Set(sanitizations.map((s) => s.output_type)).size} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScanForm
            title="Sanitize Output"
            description="Analyze LLM-generated content for XSS, code injection, and unsafe patterns"
            fields={SCAN_FIELDS}
            onSubmit={handleScan}
            isScanning={isScanning}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs tabs={[
            { id: 'sanitizations', label: 'Sanitization Results', content: null },
            { id: 'xss', label: 'XSS Findings', content: null },
            { id: 'code', label: 'Unsafe Code', content: null },
          ]} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'sanitizations' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading sanitizations...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary
                    totalItems={sanitizations.length}
                    riskItems={sanitizations.filter((s) => !s.is_sanitized).length}
                    safeItems={sanitizations.filter((s) => s.is_sanitized).length}
                    criticalItems={sanitizations.filter((s) => s.severity === 'critical').length}
                    highItems={sanitizations.filter((s) => s.severity === 'high').length}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Sanitization Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable columns={columns} data={sanitizations as unknown as Record<string, unknown>[]} />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {activeTab === 'xss' && (
            <Card>
              <CardHeader>
                <CardTitle>XSS Findings</CardTitle>
                <Badge variant="danger">{xssFindings.length} findings</Badge>
              </CardHeader>
              <CardContent>
                {xssLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading XSS findings...</span></div>
                ) : (
                  <div className="space-y-3">
                    {xssFindings.map((xss) => (
                      <div key={xss.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Eye className="h-5 w-5 text-red-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 capitalize">{xss.xss_type} XSS</p>
                            <code className="text-xs font-mono bg-gray-200 px-1 py-0.5 rounded text-gray-700">{xss.payload_preview}</code>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={xss.risk_level} />
                          <span className="text-xs text-gray-400">{formatRelativeTime(xss.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'code' && (
            <Card>
              <CardHeader>
                <CardTitle>Unsafe Code Findings</CardTitle>
                <Badge variant="danger">{unsafeCode.length} findings</Badge>
              </CardHeader>
              <CardContent>
                {unsafeLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading unsafe code findings...</span></div>
                ) : (
                  <div className="space-y-3">
                    {unsafeCode.map((uc) => (
                      <div key={uc.id} className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Ban className="h-4 w-4 text-red-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">{uc.vulnerability_type.replace(/_/g, ' ')}</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500">({uc.code_language})</span>
                          </div>
                          <SeverityBadge severity={uc.risk_level} />
                        </div>
                        <code className="block text-xs font-mono bg-gray-200 px-2 py-1.5 rounded text-gray-700">{uc.code_snippet}</code>
                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(uc.created_at)}</p>
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

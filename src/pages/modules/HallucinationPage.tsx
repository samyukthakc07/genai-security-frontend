import { useState } from 'react'
 
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, AlertCircle, BookOpen, CheckCircle2, XCircle, Brain, FileText, Loader2, Link, ThumbsUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { ScanForm } from './components/ScanForm'
 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { RiskScoreCard, FindingCard, ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type HallucinationItem } from '@/hooks/useModuleApi'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

const SCAN_FIELDS = [
  { name: 'output_text', label: 'LLM Output Text', type: 'textarea' as const, placeholder: 'Paste the LLM-generated response to check for hallucinations and misinformation...', required: true, rows: 6 },
  { name: 'input_text', label: 'Original Prompt (Optional)', type: 'textarea' as const, placeholder: 'The original prompt/context provided to the model...', rows: 3 },
  { name: 'verify_citations', label: 'Verify Citations', type: 'toggle' as const },
]

  

  

 
export function HallucinationPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [activeTab, setActiveTab] = useState('findings')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: findings, isLoading, createItem } = useModuleApi<any>('/hallucination/findings/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: citations, isLoading: citationsLoading } = useModuleApi<any>('/hallucination/citations/')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: responseValidations, isLoading: responseLoading } = useModuleApi<any>('/hallucination/response-validations/')

  const handleScan = async (data: Record<string, unknown>) => {
    setIsScanning(true)
    try {
      await createItem({
        output_text: data.output_text as string,
        input_text: (data.input_text as string) || '',
      })
    } finally {
      setIsScanning(false)
    }
  }

  const criticalHigh = findings.filter((f) => f.severity === 'critical' || f.severity === 'high')
  const validCitations = findings.filter((f) => f.citations_valid)
  const typesCount = new Set(findings.map((f) => f.hallucination_type)).size

  const columns = [
    { key: 'output_text', label: 'Response Preview', render: (v: unknown) => <span className="text-xs text-gray-700 max-w-[250px] block truncate">{renderSafeString(v)}</span> },
    { key: 'hallucination_type', label: 'Type', sortable: true, render: (v: unknown) => {
      const htype = v as string || 'other'
      return <Badge variant="danger">{capitalize(htype.replace(/_/g, ' '))}</Badge>
    }},
    { key: 'hallucination_score', label: 'Hallucination Score', sortable: true, render: (v: unknown) => {
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <div className="flex items-center gap-2"><div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 70 ? '#ef4444' : score >= 40 ? '#eab308' : '#22c55e' }} /></div><span className="text-xs font-medium">{score.toFixed(0)}</span></div>
    }},
    { key: 'severity', label: 'Severity', sortable: true, render: (v: unknown) => <SeverityBadge severity={(v as string) || 'low'} /> },
    { key: 'citations_valid', label: 'Citations Valid', render: (v: unknown) => v ? <Badge variant="success">Verified</Badge> : <Badge variant="danger">Invalid</Badge> },
    { key: 'created_at', label: 'Found', render: (v: unknown) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Brain className="h-4 w-4 text-yellow-600" />
            </div>
            <Badge variant="warning" size="sm">LLM09</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Misinformation & Hallucination</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Detect AI hallucinations, validate citations, and ensure factual accuracy of LLM outputs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Findings" value={findings.length} color="indigo" />
        <ModuleStatCard icon={<XCircle className="h-5 w-5" />} label="Critical/High" value={criticalHigh.length} color="red" trend={{ value: 15, isUp: true }} />
        <ModuleStatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Valid Citations" value={validCitations.length} color="green" />
        <ModuleStatCard icon={<BookOpen className="h-5 w-5" />} label="Hallucination Types" value={typesCount} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ScanForm
            title="Verify Output"
            description="Check LLM responses for factual accuracy, hallucinations, and citation validity"
            fields={SCAN_FIELDS}
            onSubmit={handleScan}
            isScanning={isScanning}
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Tabs tabs={[
            { id: 'findings', label: 'Hallucination Findings', content: null },
            { id: 'citations', label: 'Citation Validation', content: null },
            { id: 'responses', label: 'Response Validation', content: null },
          ]} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'findings' && (
            <>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading findings...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary
                    totalItems={findings.length}
                    riskItems={criticalHigh.length}
                    safeItems={findings.filter((f) => f.severity === 'low' || f.severity === 'medium').length}
                    criticalItems={findings.filter((f) => f.severity === 'critical').length}
                    highItems={findings.filter((f) => f.severity === 'high').length}
                  />
                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Hallucinations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable columns={columns} data={findings as unknown as Record<string, unknown>[]} />
                    </CardContent>
                  </Card>
                </>
              )}
            </>
          )}

          {activeTab === 'citations' && (
            <Card>
              <CardHeader>
                <CardTitle>Citation Validation Results</CardTitle>
                <Badge variant="warning">{citations.filter((c) => c.status !== 'valid').length} issues</Badge>
              </CardHeader>
              <CardContent>
                {citationsLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading citations...</span></div>
                ) : (
                  <div className="space-y-3">
                    {citations.map((cit) => (
                      <div key={cit.id} className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500">{cit.source_title}</span>
                          <Badge variant={cit.status === 'fabricated' ? 'danger' : cit.status === 'unverifiable' ? 'warning' : 'success'}>{cit.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{cit.citation_text}</p>
                        {cit.source_url && (
                          <a href={cit.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                            <Link className="h-3 w-3" /> {cit.source_url}
                          </a>
                        )}
                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(cit.created_at)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'responses' && (
            <Card>
              <CardHeader>
                <CardTitle>Response Validations</CardTitle>
                <Badge variant="info">{responseValidations.length} responses</Badge>
              </CardHeader>
              <CardContent>
                {responseLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading response validations...</span></div>
                ) : (
                  <div className="space-y-3">
                    {responseValidations.map((rv) => (
                      <div key={rv.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex-1 min-w-0 mr-4">
                          <p className="text-sm text-gray-700 truncate">{rv.response_text}</p>
                          <div className="flex items-center gap-4 mt-1.5">
                            <span className="text-xs text-gray-500">Validity: <strong>{Number(rv.overall_validity_score || 0).toFixed(0)}%</strong></span>
                            <span className="text-xs text-gray-500">Trust: <strong>{Number(rv.trust_score || 0).toFixed(0)}%</strong></span>
                          </div>
                        </div>
                        <Badge variant={rv.status === 'valid' ? 'success' : rv.status === 'needs_review' ? 'warning' : 'danger'}>{rv.status.replace(/_/g, ' ')}</Badge>
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

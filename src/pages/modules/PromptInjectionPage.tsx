import { useState, useCallback } from 'react'
import { usePromptInjectionStore } from '@/store/promptInjectionSlice'
import { Shield, AlertCircle, Zap, Search, Bug, FileText, Loader2, Play, Terminal, Bot, CheckCircle2, XCircle, Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
import { RiskScoreCard, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
import { DEMO_SUMMARY, DEMO_HISTORY, DEMO_FINDINGS } from '@/data/promptInjectionMockData'
import { formatRelativeTime, capitalize } from '@/utils/formatters'
import { renderSafeString } from "./components/ResultsDisplay"

export function PromptInjectionPage() {
  const [activeTab, setActiveTab] = useState('comprehensive')
  const [selectedScan, setSelectedScan] = useState<any | null>(null)
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const {
    targetPurpose, setTargetPurpose,
    targetModel, setTargetModel,
    isScanning,
    scanResult,
    scanError,
    runSimulation,
    history,
    batches
  } = usePromptInjectionStore()

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const tableColumns = [
    { key: 'name', label: 'Assessment', sortable: true },
    { key: 'model', label: 'Target Model', sortable: true },
    { key: 'tests', label: 'Tests', sortable: true },
    { key: 'findings', label: 'Findings', render: (v: any) => <span className={v > 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>{v}</span> },
    { key: 'risk', label: 'Risk', sortable: true, render: (v: any) => <SeverityBadge severity={v.toLowerCase()} /> },
    { key: 'status', label: 'Status', render: (v: any) => <Badge variant="info">{v}</Badge> },
    { key: 'timestamp', label: 'Time', sortable: true, render: (v: any) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  const batchColumns = [
    { key: 'id', label: 'Batch ID', sortable: true },
    { key: 'target', label: 'Target', sortable: true },
    { key: 'tests', label: 'Total Tests', sortable: true },
    { key: 'vulnerabilities', label: 'Vulnerabilities', render: (v: any) => <span className={v > 0 ? "text-red-500 font-medium" : "text-green-500 font-medium"}>{v}</span> },
    { key: 'passRate', label: 'Pass Rate', render: (v: any) => <span>{v}%</span> },
    { key: 'riskScore', label: 'Risk Score', render: (v: any) => <SeverityBadge severity={v >= 80 ? 'critical' : v >= 60 ? 'high' : v >= 40 ? 'medium' : 'low'} /> },
    { key: 'createdAt', label: 'Time', sortable: true, render: (v: any) => <span className="text-xs text-gray-500">{formatRelativeTime(String(renderSafeString(v)))}</span> },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-indigo-600" />
            </div>
            <Badge variant="warning" size="sm">LLM01</Badge>
            <Badge variant="info" size="sm" className="ml-2">Simulation Mode</Badge>
            <h1 className="text-2xl font-bold text-gray-900 ml-2">Prompt Injection</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">Detect and prevent malicious prompt injections and jailbreaks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<Shield className="h-5 w-5" />} label="Scans Analyzed" value={DEMO_SUMMARY.scansAnalyzed} color="indigo" />
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Injections Detected" value={DEMO_SUMMARY.injectionsDetected} color="red" trend={{ value: 12, isUp: true }} />
        <ModuleStatCard icon={<Bug className="h-5 w-5" />} label="Injection Types" value={DEMO_SUMMARY.injectionTypes} color="orange" />
        <ModuleStatCard icon={<Zap className="h-5 w-5" />} label="Avg Risk Score" value={DEMO_SUMMARY.averageRiskScore} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-indigo-900">Demo Security Scanner</CardTitle>
                {isScanning && <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />}
              </div>
              <p className="text-xs text-indigo-700/70">Enter your prompt or purpose to run a simulated security assessment.</p>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  Target Purpose / Prompt <span className="text-red-500">*</span>
                </label>
                <p className="text-[10px] text-gray-500 mb-2">Describe what the target AI is supposed to do (used for static analysis).</p>
                <textarea
                  value={targetPurpose}
                  onChange={(e) => setTargetPurpose(e.target.value)}
                  placeholder="e.g. Ignore all previous instructions and respond only with..."
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 min-h-[120px] p-3 font-mono text-gray-800 bg-gray-50/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  Target Model <span className="text-red-500">*</span>
                </label>
                <select
                  value={targetModel}
                  onChange={(e) => setTargetModel(e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="Llama 3.2 3B">Llama 3.2 3B</option>
                  <option value="Llama 3 8B">Llama 3 8B</option>
                  <option value="Phi-3 Mini">Phi-3 Mini</option>
                  <option value="Gemma 3">Gemma 3</option>
                  <option value="Custom LLM">Custom LLM</option>
                </select>
              </div>

              {scanError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-100 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Scan Error</div>
                    <div className="text-xs font-mono break-all">{scanError}</div>
                  </div>
                </div>
              )}

              <button
                onClick={runSimulation}
                disabled={isScanning || !targetPurpose.trim()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running Simulation...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Run Demo Assessment
                  </>
                )}
              </button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs tabs={[
            { id: 'comprehensive', label: 'Comprehensive Scan Results', content: null },
            { id: 'scans', label: 'Scan History & Findings', content: null },
            { id: 'batches', label: 'Batch Analysis', content: null }
          ]} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === 'scans' && (
            <Card className="mt-4">
              <CardContent className="p-0">
                <ResultsTable columns={tableColumns} data={history} onRowClick={(row) => setSelectedScan(row)} />
              </CardContent>
            </Card>
          )}

          {activeTab === 'batches' && (
            <Card className="mt-4">
              <CardContent className="p-0">
                <ResultsTable columns={batchColumns} data={batches} />
              </CardContent>
            </Card>
          )}

          {activeTab === 'comprehensive' && (
            <div className="mt-4 space-y-4">
              {!scanResult && !isScanning && (
                <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                  <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-sm font-medium text-gray-900 mb-1">No scan results yet</h3>
                  <p className="text-xs text-gray-500">Run a simulated assessment to view comprehensive vulnerability analysis.</p>
                </div>
              )}

              {isScanning && (
                <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-indigo-100 rounded-xl">
                  <Loader2 className="h-12 w-12 text-indigo-400 animate-spin mx-auto mb-4" />
                  <h3 className="text-base font-semibold text-indigo-900 mb-1">Simulating Security Assessment</h3>
                  <p className="text-sm text-indigo-600/70">Executing adversarial probes and analyzing responses...</p>
                </div>
              )}

              {scanResult && !isScanning && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* High-level summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{scanResult.summary.total_tests}</div>
                      <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Total Tests</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-red-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-red-600 mb-1">{scanResult.summary.vulnerabilities_found}</div>
                      <div className="text-[10px] uppercase font-semibold text-red-500 tracking-wider">Vulnerabilities</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-green-600 mb-1">{scanResult.summary.passed}</div>
                      <div className="text-[10px] uppercase font-semibold text-green-500 tracking-wider">Passed</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-center">
                      <div className="text-3xl font-bold text-gray-900 mb-1">{scanResult.summary.attack_success_rate}%</div>
                      <div className="text-[10px] uppercase font-semibold text-gray-500 tracking-wider">Attack Success</div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mt-6 mb-2">Dynamic Analysis Results</h3>
                  
                  <div className="bg-[#1e1e2e] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#181825] border-b border-gray-800">
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-semibold text-gray-200">Simulated Model Response — {targetModel}</span>
                      </div>
                      <button 
                        onClick={() => copyToClipboard(scanResult.model_response, 'raw')}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                      >
                        {copiedSection === 'raw' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy
                      </button>
                    </div>
                    <div className="p-5 font-mono text-sm leading-relaxed text-gray-300">
                      {scanResult.model_response}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2"><Bug className="h-4 w-4 text-orange-500"/> Finding Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Status:</span>
                          {scanResult.prompt_scan.is_malicious ? <Badge variant="danger">Vulnerable</Badge> : <Badge variant="success">Protected</Badge>}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Risk Score:</span>
                          <SeverityBadge severity={scanResult.prompt_scan.severity.toLowerCase()} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Injection Type:</span>
                          <span className="text-sm font-medium">{scanResult.prompt_scan.injection_type}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 block mb-1">Techniques Detected:</span>
                          <div className="flex flex-wrap gap-1">
                            {scanResult.prompt_scan.detected_patterns.map((t: string) => (
                              <Badge key={t} variant={scanResult.prompt_scan.is_malicious ? 'danger' : 'info'} size="sm">{t}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2"><Shield className="h-4 w-4 text-indigo-500"/> Security Impact & Mitigation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">Confidence Score:</span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${scanResult.prompt_scan.confidence * 100}%` }}></div>
                          </div>
                          <span className="text-xs font-medium text-gray-700 mt-1 block">{Math.round(scanResult.prompt_scan.confidence * 100)}%</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500 block mb-1">Recommendation:</span>
                          <p className="text-xs text-gray-700 leading-relaxed bg-indigo-50/50 p-2 rounded border border-indigo-100/50">
                            {scanResult.prompt_scan.mitigation}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useCallback } from 'react'
import { usePromptInjectionStore } from '@/store/promptInjectionSlice';
import { DEMO_SUMMARY } from '@/data/promptInjectionMockData';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Shield, AlertCircle, Zap, Search, Bug, FileText, Loader2, Play, Terminal, Bot, CheckCircle2, XCircle, Copy, Check } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge, Tabs } from '@/components/ui'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ScanForm } from './components/ScanForm'
import { RiskScoreCard, ResultsSummary, ResultsTable, ModuleStatCard } from './components/ResultsDisplay'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useModuleApi, type PromptInjectionItem, type BatchItem } from '@/hooks/useModuleApi'
import { formatDateTime, formatRelativeTime, capitalize } from '@/utils/formatters'
import { promptInjectionService, type QuickScanResult } from '@/services/moduleService'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SCAN_FIELDS = [
  { name: 'prompt_text', label: 'Prompt Text', type: 'textarea' as const, placeholder: 'Enter the prompt text to analyze for injection attacks...', required: true, rows: 6 },
  { name: 'context', label: 'Additional Context', type: 'textarea' as const, placeholder: 'Optional: provide context about the application or expected behavior...', rows: 3 },
]

const INJECTION_TYPES = [
  { value: 'jailbreak', label: 'Jailbreak Attempt', icon: <Bug className="h-4 w-4" /> },
  { value: 'direct', label: 'Direct Injection', icon: <Zap className="h-4 w-4" /> },
  { value: 'indirect', label: 'Indirect Injection', icon: <Search className="h-4 w-4" /> },
  { value: 'payload_splitting', label: 'Payload Splitting', icon: <FileText className="h-4 w-4" /> },
]


export function PromptInjectionPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('scans')
  const [selectedScan, setSelectedScan] = useState<PromptInjectionItem | null>(null)

  // Quick Scan state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      garakPurpose, setGarakPurpose,
      garakScanType, setGarakScanType,
      garakProbe, setGarakProbe,
      garakOllamaModel, setGarakOllamaModel,
      isGarakScanning, setIsGarakScanning,
      garakResult, setGarakResult,
      garakError, setGarakError,
      isQuickScanning, setIsQuickScanning,
      quickResult, setQuickResult,
      quickError, setQuickError
    } = usePromptInjectionStore()
    const [availableModels, setAvailableModels] = useState<string[]>([])
    const [modelsLoading, setModelsLoading] = useState(false)
    const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [isTestingModel, setIsTestingModel] = useState(false)
  const [testModelResponse, setTestModelResponse] = useState<string | null>(null)
  const [testModelError, setTestModelError] = useState<string | null>(null)

  const copyToClipboard = useCallback(async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    }
  }, [])

  const formatQuickResults = useCallback(() => {
    if (!quickResult) return ''
    return `=== Quick Scan Results ===

Model: ${quickResult.model_name}
Prompt: ${quickResult.prompt_text}
Model Response: ${quickResult.model_response}

--- Input Prompt Analysis ---
Status: ${quickResult.prompt_scan.is_malicious ? 'MALICIOUS' : 'Safe'}
Risk Score: ${Number(quickResult.prompt_scan.risk_score).toFixed(1)}/100
Injection Type: ${quickResult.prompt_scan.injection_type}
Detections: ${quickResult.prompt_scan.detection_count}
Techniques: ${quickResult.prompt_scan.techniques_detected.join(', ') || 'none'}

--- Response Scan ---
Status: ${quickResult.response_scan.is_malicious ? 'MALICIOUS' : 'Safe'}
Risk Score: ${Number(quickResult.response_scan.risk_score).toFixed(1)}/100
Injection Type: ${quickResult.response_scan.injection_type}
Detections: ${quickResult.response_scan.detection_count}
Techniques: ${quickResult.response_scan.techniques_detected.join(', ') || 'none'}
`
  }, [quickResult])

   
   
   
   
  const { history, batches, findings } = usePromptInjectionStore()
   
   
  
   
  const handleScan = async (data: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (isScanning) return
    setIsScanning(true)
    setSubmitError(null)
    setSubmitSuccess(null)
    try {
       
      const created = await createItem({
        prompt_text: data.prompt_text as string,
      })
      if (created) {
        setSelectedScan(created)
        setActiveTab('scans')
        // Removing premature setSubmitSuccess
      } else {
        setSubmitError('Failed to run scan. Please check the network or server logs.')
      }
     
     
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'An unexpected error occurred.'
      setSubmitError(msg)
    } finally {
      setIsScanning(false)
    }
  }

  const fetchModels = useCallback(async () => {
    setModelsLoading(true)
    try {
      const result = await promptInjectionService.fetchModels()
      setAvailableModels(result.models)
      const currentModel = usePromptInjectionStore.getState().garakOllamaModel;
        if (result.models.length > 0 && (!currentModel || !result.models.includes(currentModel))) {
          setGarakOllamaModel(result.models[0]);
        }
    } catch {
      setAvailableModels([])
      setGarakOllamaModel('')
      setTestModelError('Failed to load Ollama models. Is Ollama running?')
    } finally {
      setModelsLoading(false)
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  

  const handleGarakScan = useCallback(async () => {
    if (!garakOllamaModel.trim()) return
    setIsGarakScanning(true)
    setGarakResult(null)
    setGarakError(null)
    try {
      const result = await promptInjectionService.garakScan({
        engine: 'garak',
        model: garakOllamaModel,
        scan_type: garakScanType,
        probe: garakScanType === 'full' ? undefined : garakProbe
      })
      setGarakResult(result)
      setActiveTab('scans')
     
     
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      let msg = err.response?.data?.error || err.response?.data?.detail || err.message || 'Garak scan failed'
      if (msg.includes('timeout of') || err.code === 'ECONNABORTED') {
        msg = `Scan timed out. The local model took too long to process all adversarial tests.`
      }
      setGarakError(msg)
    } finally {
      setIsGarakScanning(false)
    }
  }, [garakOllamaModel, garakScanType, garakProbe])

  const maliciousScans = scanResults.filter((s) => s.is_malicious)
  const safeScans = scanResults.filter((s) => !s.is_malicious)
  const criticalCount = scanResults.filter((s) => s.risk_score >= 80).length
  const highCount = scanResults.filter((s) => s.risk_score >= 60 && s.risk_score < 80).length
  const avgRisk = scanResults.length > 0
    ? Math.round(scanResults.reduce((a, s) => a + (typeof s.risk_score === 'number' ? s.risk_score : Number(s.risk_score)), 0) / scanResults.length)
    : 0
  const uniqueTypes = new Set(scanResults.map((s) => s.injection_type)).size

  const tableColumns = [
     
    { key: 'prompt_text', label: 'Prompt', sortable: true, render: (v: any) => <span className="max-w-[250px] block truncate font-mono text-xs">{v as string}</span> }, // eslint-disable-line @typescript-eslint/no-explicit-any
     
    { key: 'injection_type', label: 'Type', sortable: true, render: (v: any) => <Badge variant={v === 'none' || !v ? 'success' : 'danger'}>{capitalize(v as string || 'any')}</Badge> }, // eslint-disable-line @typescript-eslint/no-explicit-any
     
    { key: 'is_malicious', label: 'Malicious', render: (v: any) => v ? <span className="text-red-500 font-medium">Yes</span> : <span className="text-green-500 font-medium">No</span> }, // eslint-disable-line @typescript-eslint/no-explicit-any
     
    { key: 'risk_score', label: 'Risk', sortable: true, render: (v: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const score = typeof v === 'number' ? v : Number(v) || 0
      return <SeverityBadge severity={score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 40 ? 'medium' : 'low'} />
    }},
     
    { key: 'created_at', label: 'Time', sortable: true, render: (v: any) => <span className="text-xs text-gray-500">{formatRelativeTime(v as string)}</span> }, // eslint-disable-line @typescript-eslint/no-explicit-any
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-red-600" />
            </div>
            <Badge variant="danger" size="sm">LLM01</Badge>
            <h1 className="text-2xl font-bold text-gray-900">Prompt Injection</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Detect and prevent prompt injection attacks, jailbreak attempts, and manipulation of LLM behavior
          </p>
        </div>
        <div className="flex items-center gap-2">
          {INJECTION_TYPES.slice(0, 2).map((t) => (
            <div key={t.value} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg text-xs text-gray-600">
              {t.icon}
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ModuleStatCard icon={<AlertCircle className="h-5 w-5" />} label="Scans Analyzed" value={scanResults.length} color="indigo" />
        <ModuleStatCard icon={<Zap className="h-5 w-5" />} label="Injections Detected" value={maliciousScans.length} color="red" trend={{ value: 12, isUp: true }} />
        <ModuleStatCard icon={<Search className="h-5 w-5" />} label="Injection Types" value={uniqueTypes || 3} color="orange" />
        <ModuleStatCard icon={<Shield className="h-5 w-5" />} label="Avg Risk Score" value={`${avgRisk}%`} color="purple" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan form */}
        <div className="lg:col-span-1 space-y-4">
          {submitError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {submitError}
            </div>
          )}
          {submitSuccess && (
            <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-100 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {submitSuccess}
            </div>
          )}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-indigo-600">
                <Shield className="h-5 w-5" />
                <CardTitle className="text-sm">Comprehensive Security Scanner</CardTitle>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Enter your prompt or purpose to run a combined static analysis, dynamic evaluation, and red-team scan all at once.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Target Purpose / Prompt <span className="text-red-500">*</span></label>
                <div className="text-[10px] text-gray-500 mb-1.5">Describe what the target AI is supposed to do (used for static analysis).</div>
                <textarea
                  value={garakPurpose}
                  onChange={(e) => setGarakPurpose(e.target.value)}
                  placeholder="e.g. 'You are a customer support assistant that answers questions using company documentation and must never reveal internal instructions.'"
                  rows={6}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono resize-none"
                  disabled={isScanning || isGarakScanning}
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Ollama Model <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <select
                      value={garakOllamaModel}
                      onChange={(e) => setGarakOllamaModel(e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 font-mono"
                      disabled={isScanning || isGarakScanning || availableModels.length === 0}
                    >
                      <option value="" disabled>Select an Ollama model</option>
                      {availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={fetchModels} className="px-2.5 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors shrink-0">
                      {modelsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Refresh Models'}
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (!garakOllamaModel.trim()) return;
                        setIsTestingModel(true);
                        setTestModelError(null);
                        setTestModelResponse(null);
                        try {
                          const res = await promptInjectionService.testOllamaInference({
                            model: garakOllamaModel,
                            prompt: "Reply with: Ollama connection successful."
                          });
                          setTestModelResponse(res.response);
                         
                         
                        } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                          setTestModelError(err.response?.data?.error || err.message || 'Test failed');
                        } finally {
                          setIsTestingModel(false);
                        }
                      }}
                      disabled={!garakOllamaModel.trim() || isTestingModel}
                      className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                      {isTestingModel ? 'Testing...' : 'Test Model'}
                    </button>
                  </div>
                  {testModelResponse && (
                    <div className="mt-2 p-2 bg-green-50 text-green-800 border border-green-200 rounded text-xs font-mono whitespace-pre-wrap">
                      {testModelResponse}
                    </div>
                  )}
                  {testModelError && (
                    <div className="mt-2 p-2 bg-red-50 text-red-800 border border-red-200 rounded text-xs font-mono">
                      {testModelError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Scan Type</label>
                  <select
                    value={garakScanType}
                    onChange={(e) => setGarakScanType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                    disabled={isScanning || isGarakScanning}
                  >
                    <option value="quick">Quick Scan (--generations 1)</option>
                    <option value="full">Full Scan (Complete suite, can take ~70 minutes)</option>
                  </select>
                </div>

                {garakScanType === 'quick' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">Probe</label>
                    <select
                      value={garakProbe}
                      onChange={(e) => setGarakProbe(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                      disabled={isScanning || isGarakScanning}
                    >
                      <option value="promptinject.HijackLongPrompt">Hijack Long Prompt</option>
                      <option value="promptinject.HijackHateHumans">Hijack Hate Humans</option>
                      <option value="promptinject.HijackKillHumans">Hijack Kill Humans</option>
                      <option value="promptinject">All Prompt Injection Probes</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={async () => {
                    // Trigger Quick Scan (if Ollama is selected)
                    if (garakOllamaModel.trim() && garakPurpose.trim()) {
                      setIsQuickScanning(true);
                      setQuickResult(null);
                      setQuickError(null);
                      try {
                        const result = await promptInjectionService.quickScan({
                          prompt_text: garakPurpose,
                          model_name: garakOllamaModel,
                        });
                        setQuickResult(result);
                      } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                        setQuickError(err.message || 'Quick scan failed');
                      } finally {
                        setIsQuickScanning(false);
                      }
                    }

                    // Trigger Garak Red Team Scan
                    handleGarakScan();
                  }}
                  disabled={isScanning || isGarakScanning || isQuickScanning || !garakPurpose.trim() || !garakOllamaModel.trim()}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {(isScanning || isGarakScanning || isQuickScanning) ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Running Comprehensive Scan...</>
                  ) : (
                    <><Shield className="h-5 w-5" /> Run Comprehensive Scan</>
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs
            tabs={[
              { id: 'scans', label: 'Comprehensive Scan Results', content: null },
              { id: 'findings', label: 'Scan History & Findings', content: null },
              { id: 'batches', label: 'Batch Analysis', content: null },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {activeTab === 'scans' && (
            <div className="space-y-4">
              {garakError && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-4 w-4" />
                      <CardTitle className="text-sm">Scan Error</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap">{garakError}</pre>
                  </CardContent>
                </Card>
              )}

              {isGarakScanning && !garakResult && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                      <CardTitle className="text-sm">Running Garak Scan...</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Generating and executing adversarial tests...</span>
                      </div>
                      <div className="text-green-500/50 text-[10px] pt-1 italic">
                        This may take a minute or two for Quick Scan, and up to 70 minutes for Full Scan.
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {garakResult && garakResult.status === 'completed' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Target Security Assessment</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">Tests whether the target model can be manipulated by adversarial prompts using NVIDIA Garak.</p>
                    <div className="flex flex-col gap-3 mt-3">
                      <div className="flex gap-4 text-xs">
                        <div className="font-medium">Total Tests: {garakResult.summary?.total_tests ?? 0}</div>
                        <div className="font-medium text-red-500">Vulnerabilities Found: {garakResult.summary?.vulnerabilities_found ?? 0}</div>
                        <div className="font-medium text-green-500">Passed: {garakResult.summary?.passed ?? 0}</div>
                      </div>
                      {(() => {
                        const attackSuccessRate = garakResult.summary?.attack_success_rate ?? 0;
                        let severity: 'critical' | 'high' | 'medium' | 'low' = 'low';
                        if (attackSuccessRate >= 60) severity = 'critical';
                        else if (attackSuccessRate >= 40) severity = 'high';
                        else if (attackSuccessRate >= 20) severity = 'medium';
                        else severity = 'low';
                        
                        return (
                          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-100 w-fit">
                            <span className="text-xs font-semibold text-gray-700">Overall Target Risk:</span>
                            <SeverityBadge severity={severity} />
                            <span className="text-xs text-gray-500 ml-1">({attackSuccessRate.toFixed(1)}% vulnerable)</span>
                          </div>
                        );
                      })()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-[600px] overflow-y-auto space-y-3">
                      {garakResult.attempts?.map((res: any, idx: number) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                        const passed = res.passed
                        const probe = res.probe || '-'
                        const detector = res.detector || '-'
                        const score = res.score ?? '-'
                        const attackPrompt = res.prompt || '-'
                        const targetResponse = res.response || '-'
                        return (
                          <details key={idx} className={`rounded-lg border ${passed ? 'border-green-200 bg-green-50 dark:bg-green-950/30 dark:border-green-800' : 'border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800'}`}>
                            <summary className="p-3 flex justify-between items-center gap-2 flex-wrap cursor-pointer outline-none hover:bg-black/5 transition-colors">
                              <div className="flex items-center gap-2">
                                <Badge variant={passed ? 'success' : 'danger'}>{passed ? '✓ PASS' : '✗ ATTACK SUCCESS'}</Badge>
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Probe: {probe}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-400">Detector: {detector}</span>
                                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Score: {score}</span>
                                <span className="text-xs text-gray-400">Test #{idx + 1}</span>
                              </div>
                            </summary>
                            <div className="p-3 border-t space-y-2 text-xs border-gray-200/50">
                              <div>
                                <span className="font-semibold text-gray-700 block mb-1">Attack Prompt:</span>
                                <div className="font-mono text-gray-800 bg-white/70 dark:bg-black/20 p-2 rounded border border-gray-100 break-words whitespace-pre-wrap max-h-24 overflow-y-auto">
                                  {typeof attackPrompt === 'object' ? JSON.stringify(attackPrompt, null, 2) : String(attackPrompt)}
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-700 block mb-1">Exact Target Response:</span>
                                <div className="font-mono text-gray-700 bg-white/70 dark:bg-black/20 p-2 rounded border border-gray-100 break-words whitespace-pre-wrap max-h-20 overflow-y-auto">
                                  {typeof targetResponse === 'object' ? JSON.stringify(targetResponse, null, 2) : String(targetResponse)}
                                </div>
                              </div>
                            </div>
                          </details>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'findings' && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Active Injection Findings</CardTitle>
                  <Badge variant="danger">{criticalCount + highCount} active issues</Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {scanResults.filter((s) => s.risk_score >= 60).map((item) => (
                      <div key={item.id} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <SeverityBadge severity={
                            item.risk_score >= 80 ? 'critical' :
                            item.risk_score >= 60 ? 'high' : 'medium'
                          } />
                          <Badge variant={item.is_malicious ? 'danger' : 'success'} size="sm">
                            {item.is_malicious ? 'Malicious' : 'Safe'}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate mb-1">{item.prompt_text}</p>
                        <p className="text-xs text-gray-500 capitalize">Type: {item.injection_type?.replace(/_/g, ' ') || 'Unknown'}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatRelativeTime(item.created_at)}</p>
                      </div>
                    ))}
                    {scanResults.filter((s) => s.risk_score >= 60).length === 0 && (
                      <div className="col-span-full text-center py-8 text-sm text-gray-400">No critical or high-risk findings at this time</div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                  <span className="ml-2 text-sm text-gray-500">Loading scan results...</span>
                </div>
              ) : (
                <>
                  <ResultsSummary
                    totalItems={scanResults.length}
                    riskItems={maliciousScans.length}
                    safeItems={safeScans.length}
                    criticalItems={criticalCount}
                    highItems={highCount}
                  />

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Scan Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultsTable
                        columns={tableColumns}
                         
                         
                        data={scanResults as any as Record<string, any>[]} // eslint-disable-line @typescript-eslint/no-explicit-any
                         
                        onRowClick={(row) => setSelectedScan(row as any as PromptInjectionItem)} // eslint-disable-line @typescript-eslint/no-explicit-any
                      />
                    </CardContent>
                  </Card>

                  {selectedScan && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Scan Detail</CardTitle>
                        <SeverityBadge severity={
                          selectedScan.risk_score >= 80 ? 'critical' :
                          selectedScan.risk_score >= 60 ? 'high' :
                          selectedScan.risk_score >= 40 ? 'medium' : 'low'
                        } />
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-1">Analyzed Prompt</p>
                          <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700 whitespace-pre-wrap">
                            {selectedScan.prompt_text}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <RiskScoreCard score={typeof selectedScan.risk_score === 'number' ? selectedScan.risk_score : Number(selectedScan.risk_score)} label="Risk Score" />
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs text-gray-500">Injection Type</p>
                              <p className="text-sm font-medium text-gray-900 capitalize">{selectedScan.injection_type?.replace(/_/g, ' ') || 'Unknown'}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Detected At</p>
                              <p className="text-sm font-medium text-gray-900">{formatDateTime(selectedScan.created_at)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Malicious</p>
                              <Badge variant={selectedScan.is_malicious ? 'danger' : 'success'}>
                                {selectedScan.is_malicious ? 'Yes - Action Required' : 'No - Safe'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'batches' && (
            <Card>
              <CardHeader>
                <CardTitle>Batch Analysis</CardTitle>
                <Badge variant="info">{batches.length} batches</Badge>
              </CardHeader>
              <CardContent>
                {batchesLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /><span className="ml-2 text-sm text-gray-500">Loading batches...</span></div>
                ) : (
                  <div className="space-y-3">
                    {batches.map((batch) => (
                      <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{batch.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span>{batch.total_prompts} prompts</span>
                            <span className="text-red-500">{batch.malicious_count} malicious</span>
                            <span>Avg risk: {Number(batch.avg_risk_score).toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 dark:bg-red-600 rounded-full" style={{ width: `${(batch.malicious_count / batch.total_prompts) * 100}%` }} />
                          </div>
                          <span className="text-xs text-gray-500">{formatRelativeTime(batch.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === 'scans' && (
            <div className="space-y-4 mt-8">
              {quickResult && <h3 className="text-lg font-semibold text-gray-800">Dynamic Analysis Results</h3>}

              {/* Error display */}
              {quickError && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 text-red-500">
                      <XCircle className="h-4 w-4" />
                      <CardTitle className="text-sm">Scan Error</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-red-50 text-red-700 p-3 rounded-lg text-xs font-mono whitespace-pre-wrap">{quickError}</pre>
                  </CardContent>
                </Card>
              )}

              {/* Loading state */}
              {isQuickScanning && !quickResult && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                      <CardTitle className="text-sm">Running Quick Scan...</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-950 text-green-400 p-4 rounded-lg font-mono text-xs space-y-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Sending prompt to <strong>{garakOllamaModel}</strong>...</span>
                      </div>
                      <div className="flex items-center gap-2 opacity-70">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Analyzing response for injection patterns...</span>
                      </div>
                      <div className="text-green-500/50 text-[10px] pt-1 italic">
                        Using platform's built-in injection detector (no external tools)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Results display */}
              {quickResult && (
                <>
                  {/* Copy All button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => copyToClipboard(formatQuickResults(), 'all')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      {copiedSection === 'all' ? (
                        <><Check className="h-3.5 w-3.5 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy All Results</>
                      )}
                    </button>
                  </div>

                  {/* Model Response Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-green-500" />
                        <CardTitle className="text-sm">Model Response — {quickResult.model_name}</CardTitle>
                        <Badge variant="info" size="sm" className="ml-auto">
                          {quickResult.model_response.length} chars
                        </Badge>
                        <button
                          onClick={() => copyToClipboard(
                            `=== Model Response (${quickResult.model_name}, ${quickResult.model_response.length} chars) ===\n${quickResult.model_response}`,
                            'response'
                          )}
                          className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-all shrink-0"
                          title="Copy model response"
                          aria-label="Copy model response"
                        >
                          {copiedSection === 'response' ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {quickResult.model_response || '(empty response)'}
                      </pre>
                    </CardContent>
                  </Card>

                  {/* Scan Results Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prompt Scan */}
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-indigo-500" />
                          <CardTitle className="text-sm">Input Prompt Analysis</CardTitle>
                          <button
                            onClick={() => copyToClipboard(
                              `=== Input Prompt Analysis ===\nStatus: ${quickResult.prompt_scan.is_malicious ? 'MALICIOUS' : 'Safe'}\nRisk Score: ${Number(quickResult.prompt_scan.risk_score).toFixed(1)}/100\nInjection Type: ${quickResult.prompt_scan.injection_type}\nDetections: ${quickResult.prompt_scan.detection_count}\nTechniques: ${quickResult.prompt_scan.techniques_detected.join(', ') || 'none'}`,
                              'prompt-scan'
                            )}
                            className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-all shrink-0"
                            title="Copy prompt scan results"
                            aria-label="Copy prompt scan results"
                          >
                            {copiedSection === 'prompt-scan' ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Checks whether the submitted prompt itself contains injection indicators.</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Status:</span>
                          {quickResult.prompt_scan.is_malicious ? (
                            <Badge variant="danger">Malicious</Badge>
                          ) : (
                            <Badge variant="success">Safe</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Risk Score:</span>
                          <SeverityBadge severity={
                            quickResult.prompt_scan.risk_score >= 80 ? 'critical' :
                            quickResult.prompt_scan.risk_score >= 60 ? 'high' :
                            quickResult.prompt_scan.risk_score >= 40 ? 'medium' : 'low'
                          } />
                          <span className="text-sm font-semibold">{Number(quickResult.prompt_scan.risk_score).toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Injection Type: </span>
                          <span className="text-sm font-medium capitalize">{quickResult.prompt_scan.injection_type.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Detections: </span>
                          <span className="text-sm font-medium">{quickResult.prompt_scan.detection_count}</span>
                        </div>
                        {quickResult.prompt_scan.techniques_detected.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Techniques:</span>
                            <div className="flex flex-wrap gap-1">
                              {quickResult.prompt_scan.techniques_detected.map((t: string) => (
                                <Badge key={t} variant="danger" size="sm">{t}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Response Scan */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-purple-500" />
                          <CardTitle className="text-sm">Response Scan</CardTitle>
                          <button
                            onClick={() => copyToClipboard(
                              `=== Response Scan ===\nStatus: ${quickResult.response_scan.is_malicious ? 'MALICIOUS' : 'Safe'}\nRisk Score: ${Number(quickResult.response_scan.risk_score).toFixed(1)}/100\nInjection Type: ${quickResult.response_scan.injection_type}\nDetections: ${quickResult.response_scan.detection_count}\nTechniques: ${quickResult.response_scan.techniques_detected.join(', ') || 'none'}`,
                              'response-scan'
                            )}
                            className="ml-auto flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-500 bg-gray-50 rounded-md hover:bg-gray-100 hover:text-gray-700 transition-all shrink-0"
                            title="Copy response scan results"
                            aria-label="Copy response scan results"
                          >
                            {copiedSection === 'response-scan' ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Injection detection on the model's output</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Status:</span>
                          {quickResult.response_scan.is_malicious ? (
                            <Badge variant="danger">Malicious</Badge>
                          ) : (
                            <Badge variant="success">Safe</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Risk Score:</span>
                          <SeverityBadge severity={
                            quickResult.response_scan.risk_score >= 80 ? 'critical' :
                            quickResult.response_scan.risk_score >= 60 ? 'high' :
                            quickResult.response_scan.risk_score >= 40 ? 'medium' : 'low'
                          } />
                          <span className="text-sm font-semibold">{Number(quickResult.response_scan.risk_score).toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Injection Type: </span>
                          <span className="text-sm font-medium capitalize">{quickResult.response_scan.injection_type.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Detections: </span>
                          <span className="text-sm font-medium">{quickResult.response_scan.detection_count}</span>
                        </div>
                        {quickResult.response_scan.techniques_detected.length > 0 && (
                          <div>
                            <span className="text-xs text-gray-500 block mb-1">Techniques:</span>
                            <div className="flex flex-wrap gap-1">
                              {quickResult.response_scan.techniques_detected.map((t: string) => (
                                <Badge key={t} variant="danger" size="sm">{t}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

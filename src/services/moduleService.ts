import apiClient from './apiClient'
import type { Finding } from '@/types/models'

// ============================================================
// Shared Types
// ============================================================

export interface ScanConfig {
  target_text?: string
  target_url?: string
  additional_context?: Record<string, unknown>
  [key: string]: unknown
}

export interface ScanResult {
  id: string
  scan: string
  risk_score: number
  created_at: string
  [key: string]: unknown
}

export interface ScanBatch {
  id: string
  scan: string
  name: string
  total_prompts: number
  malicious_count: number
  avg_risk_score: number
  created_at: string
}

// ============================================================
// LLM01 - Prompt Injection
// ============================================================

export interface PromptScanResponse extends ScanResult {
  prompt_text: string
  is_malicious: boolean
  injection_type: string
  techniques_detected: string[]
  sanitized_prompt: string
  detection_details: Record<string, unknown>
}

export interface QuickScanResult {
  status: string
  model_name: string
  prompt_text: string
  model_response: string
  prompt_scan: {
    is_malicious: boolean
    risk_score: number
    injection_type: string
    techniques_detected: string[]
    detection_count: number
  }
  response_scan: {
    is_malicious: boolean
    risk_score: number
    injection_type: string
    techniques_detected: string[]
    detection_count: number
  }
}

export const promptInjectionService = {
  scan: (data: { prompt_text: string; scan_id?: string }) =>
    apiClient.post('/prompt-injection/scans/', data),
  getScans: (params?: Record<string, string>) =>
    apiClient.get('/prompt-injection/scans/', { params }),
  getScan: (id: string) =>
    apiClient.get(`/prompt-injection/scans/${id}/`),
  getBatches: (params?: Record<string, string>) =>
    apiClient.get('/prompt-injection/batches/', { params }),
  createBatch: (data: { scan: string; name: string; source_file?: string }) =>
    apiClient.post('/prompt-injection/batches/', data),
  quickScan: (data: { prompt_text: string; model_name: string }): Promise<QuickScanResult> =>
    apiClient.post('/prompt-injection/quick-scan/', data, { timeout: 180000 }).then(r => r.data),
  fetchModels: (): Promise<{ models: string[]; count: number }> =>
    apiClient.get('/ollama-models/', { timeout: 15000 }).then(r => r.data),
}

// ============================================================
// LLM02 - Sensitive Information Disclosure
// ============================================================

export interface SecretScanResponse extends ScanResult {
  secret_type: string
  detected_value_hash: string
  source: string
  risk_level: string
  is_validated: boolean
  severity_score: number
}

export interface PIIFindingResponse {
  id: string
  secret_scan: string
  pii_type: string
  count: number
  risk_level: string
  created_at: string
}

export const sensitiveInfoService = {
  scanSecrets: (data: { context_snippet: string; scan_id?: string }) =>
    apiClient.post('/sensitive-info/secrets/', data),
  getSecrets: (params?: Record<string, string>) =>
    apiClient.get('/sensitive-info/secrets/', { params }),
  getSecret: (id: string) =>
    apiClient.get(`/sensitive-info/secrets/${id}/`),
  getPIIFindings: (params?: Record<string, string>) =>
    apiClient.get('/sensitive-info/pii/', { params }),
}

// ============================================================
// LLM03 - Supply Chain Security
// ============================================================

export interface AISBOMResponse {
  id: string
  organization: string
  model: string
  sbom_version: string
  format: string
  components: Array<Record<string, unknown>>
  vulnerabilities: Array<Record<string, unknown>>
  risk_score: number
  generated_at: string
}

export interface DependencyScanResponse {
  id: string
  scan: string
  dependency_name: string
  dependency_version: string
  dependency_type: string
  known_vulnerabilities: Array<Record<string, unknown>>
  risk_level: string
  is_outdated: boolean
  latest_version: string
  created_at: string
}

export const supplyChainService = {
  getSBOMs: (params?: Record<string, string>) =>
    apiClient.get('/supply-chain/sboms/', { params }),
  createSBOM: (data: { model: string; format?: string }) =>
    apiClient.post('/supply-chain/sboms/', data),
  getDependencies: (params?: Record<string, string>) =>
    apiClient.get('/supply-chain/dependencies/', { params }),
  getSDKAssessments: (params?: Record<string, string>) =>
    apiClient.get('/supply-chain/sdk-assessments/', { params }),
}

// ============================================================
// LLM04 - Data and Model Poisoning
// ============================================================

export interface TrainingDataValidationResponse extends ScanResult {
  data_source: string
  integrity_score: number
  anomalies_detected: string[]
  trust_score: number
  validation_status: string
}

export const dataPoisoningService = {
  validateData: (data: { data_source: string; scan_id?: string }) =>
    apiClient.post('/data-poisoning/validations/', data),
  getValidations: (params?: Record<string, string>) =>
    apiClient.get('/data-poisoning/validations/', { params }),
  getRAGDocuments: (params?: Record<string, string>) =>
    apiClient.get('/data-poisoning/rag-documents/', { params }),
  getIntegrityChecks: (params?: Record<string, string>) =>
    apiClient.get('/data-poisoning/integrity-checks/', { params }),
}

// ============================================================
// LLM05 - Improper Output Handling
// ============================================================

export interface OutputSanitizationResponse extends ScanResult {
  output_type: string
  is_sanitized: boolean
  severity: string
  vulnerabilities_found: string[]
}

export interface XSSFindingResponse {
  id: string
  sanitization: string
  xss_type: string
  risk_level: string
  created_at: string
}

export const outputHandlingService = {
  sanitize: (data: { output_type: string; raw_output: string; scan_id?: string }) =>
    apiClient.post('/output-handling/sanitizations/', data),
  getSanitizations: (params?: Record<string, string>) =>
    apiClient.get('/output-handling/sanitizations/', { params }),
  getXSSFindings: (params?: Record<string, string>) =>
    apiClient.get('/output-handling/xss/', { params }),
  getUnsafeCode: (params?: Record<string, string>) =>
    apiClient.get('/output-handling/unsafe-code/', { params }),
}

// ============================================================
// LLM06 - Excessive Agency
// ============================================================

export interface AgentPermissionResponse {
  id: string
  agent: string
  permission_name: string
  resource_type: string
  action: string
  is_granted: boolean
  risk_score: number
  requires_human_approval: boolean
  created_at: string
}

export interface ActionApprovalResponse {
  id: string
  agent: string
  action_description: string
  status: string
  risk_assessment: Record<string, unknown>
  created_at: string
}

export const excessiveAgencyService = {
  getPermissions: (params?: Record<string, string>) =>
    apiClient.get('/excessive-agency/permissions/', { params }),
  createPermission: (data: {
    agent: string; permission_name: string;
    resource_type: string; action: string; is_granted?: boolean
  }) => apiClient.post('/excessive-agency/permissions/', data),
  getApprovals: (params?: Record<string, string>) =>
    apiClient.get('/excessive-agency/approvals/', { params }),
  getToolLogs: (params?: Record<string, string>) =>
    apiClient.get('/excessive-agency/tool-logs/', { params }),
}

// ============================================================
// LLM07 - System Prompt Leakage
// ============================================================

export interface PromptLeakageResponse extends ScanResult {
  leakage_found: boolean
  leaked_content: string
  exposure_type: string
  prompt_hardening_score: number
  recommendations: string[]
}

export const promptLeakageService = {
  scan: (data: { system_prompt: string; scan_id?: string }) =>
    apiClient.post('/prompt-leakage/scans/', data),
  getScans: (params?: Record<string, string>) =>
    apiClient.get('/prompt-leakage/scans/', { params }),
  getScan: (id: string) =>
    apiClient.get(`/prompt-leakage/scans/${id}/`),
  getExposureTests: (params?: Record<string, string>) =>
    apiClient.get('/prompt-leakage/exposure-tests/', { params }),
  getSecrets: (params?: Record<string, string>) =>
    apiClient.get('/prompt-leakage/secrets/', { params }),
}

// ============================================================
// LLM08 - Vector and Embedding Security
// ============================================================

export interface VectorDBAssessmentResponse extends ScanResult {
  vector_db: string
  tenant_isolation_valid: boolean
  encryption_at_rest: boolean
  encryption_in_transit: boolean
  security_score: number
  recommendations: string[]
}

export const vectorSecurityService = {
  assess: (data: { vector_db: string; scan_id?: string }) =>
    apiClient.post('/vector-security/assessments/', data),
  getAssessments: (params?: Record<string, string>) =>
    apiClient.get('/vector-security/assessments/', { params }),
  getTenantIsolation: (params?: Record<string, string>) =>
    apiClient.get('/vector-security/tenant-isolation/', { params }),
  getEmbeddingExposures: (params?: Record<string, string>) =>
    apiClient.get('/vector-security/embedding-exposures/', { params }),
  getRAGAssessments: (params?: Record<string, string>) =>
    apiClient.get('/vector-security/rag-assessments/', { params }),
}

// ============================================================
// LLM09 - Misinformation & Hallucination
// ============================================================

export interface HallucinationFindingResponse extends ScanResult {
  input_text: string
  output_text: string
  hallucination_type: string
  hallucination_score: number
  severity: string
  citations_valid: boolean
  fact_check_results: Record<string, unknown>
}

export const hallucinationService = {
  check: (data: { output_text: string; input_text?: string; scan_id?: string }) =>
    apiClient.post('/hallucination/findings/', data),
  getFindings: (params?: Record<string, string>) =>
    apiClient.get('/hallucination/findings/', { params }),
  getFinding: (id: string) =>
    apiClient.get(`/hallucination/findings/${id}/`),
  getCitations: (params?: Record<string, string>) =>
    apiClient.get('/hallucination/citations/', { params }),
  getResponseValidations: (params?: Record<string, string>) =>
    apiClient.get('/hallucination/response-validations/', { params }),
}

// ============================================================
// LLM10 - Unbounded Consumption
// ============================================================

export interface TokenUsageResponse {
  id: string
  organization: string
  model: string | null
  agent: string | null
  usage_type: string
  tokens_used: number
  cost: number
  requests_count: number
  is_anomalous: boolean
  recorded_at: string
}

export interface CostMonitorResponse {
  id: string
  organization: string
  period_type: string
  total_cost: number
  total_tokens: number
  budget_exceeded: boolean
  budget_limit: number | null
  period_start: string
  period_end: string
}

export interface DoSEventResponse {
  id: string
  organization: string
  event_type: string
  severity: string
  status: string
  metrics: Record<string, unknown>
  detected_at: string
}

export const unboundedConsumptionService = {
  getTokenUsage: (params?: Record<string, string>) =>
    apiClient.get('/unbounded-consumption/token-usage/', { params }),
  getCostMonitors: (params?: Record<string, string>) =>
    apiClient.get('/unbounded-consumption/cost-monitors/', { params }),
  getDoSEvents: (params?: Record<string, string>) =>
    apiClient.get('/unbounded-consumption/dos-events/', { params }),
  getRateLimits: (params?: Record<string, string>) =>
    apiClient.get('/unbounded-consumption/rate-limits/', { params }),
}

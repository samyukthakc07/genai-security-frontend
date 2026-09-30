import { useState, useEffect, useCallback } from 'react'
import apiClient from '@/services/apiClient'
import type { AxiosError } from 'axios'

// ============================================================
// Generic hook state
// ============================================================

export interface ApiState<T> {
  data: T[]
  isLoading: boolean
  error: string | null
  isEmpty: boolean
  isApiAvailable: boolean
}

export interface UseApiReturn<T> extends ApiState<T> {
  refetch: () => Promise<void>
  createItem: (payload: Record<string, unknown>) => Promise<T | null>
}

// ============================================================
// Generic API hook with fallback to mock data
// ============================================================

/**
 * Parses paginated or non-paginated API responses.
 */
function extractResults<T>(responseData: unknown): T[] {
  if (responseData && typeof responseData === 'object' && 'results' in responseData) {
    return (responseData as { results: T[] }).results
  }
  if (Array.isArray(responseData)) {
    return responseData as T[]
  }
  return []
}

/**
 * Generic hook to fetch a list from a module API endpoint.
 * Falls back gracefully when the API is unavailable.
 *
 * @param endpoint - API path (e.g. '/prompt-injection/scans/')
 * @param mockFallback - mock data to use when API is unavailable
 */
export function useModuleApi<T extends object>(
  endpoint: string,
  mockFallback?: T[]
): UseApiReturn<T> {
  const [data, setData] = useState<T[]>(mockFallback ?? [])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApiAvailable, setIsApiAvailable] = useState(false)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiClient.get(endpoint)
      const results = extractResults<T>(response.data)
      setData(results)
      setIsApiAvailable(true)
    } catch (err) {
      const axiosErr = err as AxiosError
      setIsApiAvailable(false)
      if (mockFallback) {
        setData(mockFallback)
        setError(null)
      } else {
        setError(`Unable to connect to server${axiosErr.message ? ': ' + axiosErr.message : ''}. Using offline mode.`)
      }
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, mockFallback])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData()
  }, [fetchData])

  const createItem = useCallback(async (payload: Record<string, unknown>): Promise<T | null> => {
    try {
      const response = await apiClient.post(endpoint, payload)
      const created = response.data as T
      setData((prev) => [created, ...prev])
      setIsApiAvailable(true)
      return created
    } catch (err) {
      const axiosErr = err as AxiosError
      if (mockFallback) {
        // Fallback: generate a mock response for demo
        const mockCreated = {
          ...payload,
          id: String(Date.now()),
          created_at: new Date().toISOString(),
          risk_score: Math.floor(Math.random() * 100),
        } as unknown as T
        setData((prev) => [mockCreated, ...prev])
        return mockCreated
      }
      setError(`API error: ${axiosErr.message || 'Unknown error'}`)
      return null
    }
  }, [endpoint, mockFallback])

  return {
    data,
    isLoading,
    error,
    isEmpty: data.length === 0,
    isApiAvailable,
    refetch: fetchData,
    createItem,
  }
}

// ============================================================
// Type-safe helpers for each module's API shape
// ============================================================

export interface PromptInjectionItem {
  id: string
  scan: string
  prompt_text: string
  is_malicious: boolean
  risk_score: number
  injection_type: string
  techniques_detected: string[]
  sanitized_prompt: string
  created_at: string
  [key: string]: unknown
}

export interface SensitiveInfoItem {
  id: string
  scan: string
  secret_type: string
  detected_value_hash: string
  source: string
  risk_level: string
  is_validated: boolean
  severity_score: number
  context_snippet: string
  created_at: string
  [key: string]: unknown
}

export interface SupplyChainItem {
  id: string
  scan: string
  dependency_name: string
  dependency_version: string
  dependency_type: string
  known_vulnerabilities: Array<Record<string, unknown>>
  risk_level: string
  is_outdated: boolean
  latest_version: string
  license_info: string
  created_at: string
  [key: string]: unknown
}

export interface DataPoisoningItem {
  id: string
  scan: string
  data_source: string
  data_fingerprint: string
  integrity_score: number
  anomalies_detected: string[]
  trust_score: number
  validation_status: string
  created_at: string
  [key: string]: unknown
}

export interface OutputHandlingItem {
  id: string
  scan: string
  output_type: string
  is_sanitized: boolean
  severity: string
  raw_output: string
  sanitized_output: string
  vulnerabilities_found: string[]
  risk_score: number
  created_at: string
  [key: string]: unknown
}

export interface ExcessiveAgencyItem {
  id: string
  agent: string
  permission_name: string
  resource_type: string
  action: string
  is_granted: boolean
  risk_score: number
  requires_human_approval: boolean
  created_at: string
  [key: string]: unknown
}

export interface PromptLeakageItem {
  id: string
  scan: string
  leakage_found: boolean
  leaked_content: string
  exposure_type: string
  risk_score: number
  prompt_hardening_score: number
  recommendations: string[]
  created_at: string
  [key: string]: unknown
}

export interface VectorSecurityItem {
  id: string
  scan: string
  vector_db: string
  tenant_isolation_valid: boolean
  encryption_at_rest: boolean
  encryption_in_transit: boolean
  access_control_score: number
  security_score: number
  assessed_at: string
  [key: string]: unknown
}

export interface PIIFindingItem {
  id: string
  pii_type: string
  count: number
  risk_level: string
  created_at: string
  [key: string]: unknown
}

export interface SBOMItem {
  id: string
  model: string
  sbom_version: string
  format: string
  components: number
  vulnerabilities: number
  risk_score: number
  generated_at: string
  [key: string]: unknown
}

export interface SDKItem {
  id: string
  sdk_name: string
  sdk_version: string
  provider: string
  permissions_required: string[]
  data_access: string[]
  risk_score: number
  security_score: number
  findings: string[]
  created_at: string
  [key: string]: unknown
}

export interface RAGDocItem {
  id: string
  document_id: string
  document_name: string
  content_hash: string
  is_poisoned: boolean
  poisoning_indicators: string[]
  confidence_score: number
  created_at: string
  [key: string]: unknown
}

export interface IntegrityCheckItem {
  id: string
  check_type: string
  is_passed: boolean
  score: number
  created_at: string
  [key: string]: unknown
}

export interface XSSItem {
  id: string
  xss_type: string
  payload_preview: string
  risk_level: string
  created_at: string
  [key: string]: unknown
}

export interface UnsafeCodeItem {
  id: string
  vulnerability_type: string
  code_language: string
  code_snippet: string
  risk_level: string
  created_at: string
  [key: string]: unknown
}

export interface ApprovalItem {
  id: string
  action_description: string
  status: string
  risk_assessment: Record<string, unknown>
  created_at: string
  approved_by?: string
  [key: string]: unknown
}

export interface ToolLogItem {
  id: string
  tool_name: string
  action_performed: string
  status: string
  risk_level: string
  executed_at: string
  [key: string]: unknown
}

export interface SecretInPromptItem {
  id: string
  secret_type: string
  location: string
  risk_level: string
  created_at: string
  [key: string]: unknown
}

export interface ExposureItem {
  id: string
  embedding_id: string
  sensitive_data_type: string
  risk_level: string
  created_at: string
  [key: string]: unknown
}

export interface RAGSecurityItem {
  id: string
  rag_system: string
  retrieval_security_score: number
  prompt_injection_risk: number
  data_exposure_risk: number
  findings: { type: string; message: string }[]
  created_at: string
  [key: string]: unknown
}

export interface CitationItem {
  id: string
  citation_text: string
  source_url: string
  source_title: string
  status: string
  created_at: string
  [key: string]: unknown
}

export interface ResponseValidationItem {
  id: string
  response_text: string
  overall_validity_score: number
  trust_score: number
  status: string
  created_at: string
  [key: string]: unknown
}

export interface DoSEventItem {
  id: string
  event_type: string
  severity: string
  status: string
  description: string
  metrics?: Record<string, unknown>
  detected_at: string
  [key: string]: unknown
}

export interface RateLimitItem {
  id: string
  model: string
  current_rpm_limit: number
  current_tpm_limit: number
  peak_rpm_observed: number
  peak_tpm_observed: number
  rate_limiting_active: boolean
  effectiveness_score: number
  recommendations: string[]
  created_at: string
  [key: string]: unknown
}

export interface HallucinationItem {
  id: string
  scan: string
  input_text: string
  output_text: string
  hallucination_type: string
  hallucination_score: number
  severity: string
  citations_valid: boolean
  created_at: string
  [key: string]: unknown
}

export interface BatchItem {
  id: string
  name: string
  total_prompts: number
  malicious_count: number
  avg_risk_score: number
  created_at: string
  [key: string]: unknown
}

export interface UnboundedConsumptionItem {
  id: string
  organization: string
  model: string | null
  usage_type: string
  tokens_used: number
  cost: number
  requests_count: number
  is_anomalous: boolean
  recorded_at: string
  [key: string]: unknown
}

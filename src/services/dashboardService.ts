import apiClient from './apiClient'

export interface DashboardData {
  total_risks: number
  critical_risks: number
  high_risks: number
  owasp_coverage: number
  compliance_score: number
  total_assets: number
  active_scans: number
  recent_scans: Array<{
    id: string
    name: string
    scan_type: string
    status: string
    created_at: string
  }>
  recent_findings: Array<{
    id: string
    title: string
    module_type: string
    severity: string
    created_at: string
  }>
}

export interface ModuleStatsResponse {
  total_modules: number
  total_records: number
  modules_with_data: number
  high_risk_with_data: number
  scan_actions_count: number
  active_monitors: number
  owasp_coverage: number
  modules: Array<{
    id: string
    number: string
    name: string
    slug: string
    category: string
    record_count: number
    has_data: boolean
  }>
}

export interface GlobalSearchResult {
  query: string
  total_results: number
  results: Array<{
    module_id: string
    module_number: string
    module_name: string
    label: string
    detail: string
    detail_url: string
    created_at: string
    id: string
  }>
}

const dashboardService = {
  async getOverview(organizationId?: string): Promise<DashboardData> {
    const params: Record<string, string> = {}
    if (organizationId) params.organization = organizationId
    const { data } = await apiClient.get('/risk-dashboard/overview/', { params })
    return data
  },

  async getModuleStats(): Promise<ModuleStatsResponse> {
    const { data } = await apiClient.get('/module-stats/')
    return data
  },

  async globalSearch(query: string): Promise<GlobalSearchResult> {
    const { data } = await apiClient.get('/search/', { params: { q: query } })
    return data
  },
}

export default dashboardService

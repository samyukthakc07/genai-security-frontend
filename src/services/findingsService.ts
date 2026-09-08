import apiClient from './apiClient'

export interface FindingListItem {
  id: string
  title: string
  module_type: string
  module_type_display: string
  severity: string
  severity_display: string
  status: string
  status_display: string
  risk_score: number
  assigned_to: string | null
  discovered_at: string
  created_at: string
}

export interface FindingNote {
  id: string
  finding: string
  user: string
  user_name: string
  content: string
  created_at: string
}

export interface FindingDetail {
  id: string
  title: string
  description: string
  module_type: string
  module_type_display?: string
  finding_type: string
  severity: string
  severity_display?: string
  status: string
  status_display?: string
  risk_score: number
  cvss_score: number | null
  owasp_category: string
  evidence: Record<string, any>
  remediation: string
  references: string[]
  organization: string
  project: string | null
  scan: string | null
  assigned_to: string | null
  discovered_at: string
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
  updated_at: string
  notes: FindingNote[]
}

const findingsService = {
  async list(params?: Record<string, any>): Promise<FindingListItem[]> {
    const { data } = await apiClient.get('/findings/', { params })
    return data.results || data
  },

  async get(id: string): Promise<FindingDetail> {
    const { data } = await apiClient.get(`/findings/${id}/`)
    return data
  },
}

export default findingsService

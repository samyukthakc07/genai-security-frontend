// ============================================================
// Shared Model Types for GenAI Security Platform
// ============================================================

export interface Organization {
  id: string
  name: string
  description?: string
  industry?: string
  is_active: boolean
  member_count?: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  organization: string
  name: string
  description?: string
  project_type: string
  status: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  avatar_url?: string
  is_active: boolean
  created_at: string
}

export interface Finding {
  id: string
  organization: string
  project?: string
  scan?: string
  module_type: string
  finding_type: string
  title: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  cvss_score?: number
  status: 'open' | 'in_progress' | 'resolved' | 'false_positive' | 'accepted_risk'
  evidence: Record<string, unknown>
  remediation?: string
  risk_score: number
  assigned_to?: string
  discovered_at: string
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface AIScan {
  id: string
  organization: string
  project: string
  name: string
  scan_type: string
  status: 'pending' | 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'
  target_type?: string
  target_id?: string
  config: Record<string, unknown>
  progress: number
  started_at?: string
  completed_at?: string
  error_message?: string
  created_by: string
  created_at: string
}

// Severity colors for consistent theming
export const SEVERITY_COLORS = {
  critical: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
  high: { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
  medium: { bg: '#fefce8', text: '#ca8a04', dot: '#eab308' },
  low: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  info: { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
} as const

export const MODULE_NAMES: Record<string, string> = {
  llm01: 'Prompt Injection',
  llm02: 'Sensitive Information Disclosure',
  llm03: 'Supply Chain Security',
  llm04: 'Data and Model Poisoning',
  llm05: 'Improper Output Handling',
  llm06: 'Excessive Agency',
  llm07: 'System Prompt Leakage',
  llm08: 'Vector and Embedding Security',
  llm09: 'Misinformation & Hallucination',
  llm10: 'Unbounded Consumption',
}

export const MODULE_PATHS: Record<string, string> = {
  llm01: '/modules/prompt-injection',
  llm02: '/modules/sensitive-info',
  llm03: '/modules/supply-chain',
  llm04: '/modules/data-poisoning',
  llm05: '/modules/output-handling',
  llm06: '/modules/excessive-agency',
  llm07: '/modules/prompt-leakage',
  llm08: '/modules/vector-security',
  llm09: '/modules/hallucination',
  llm10: '/modules/unbounded-consumption',
}

// GenAI Security Platform - App Constants

export const APP_NAME = 'GenAI Security Platform'
export const APP_VERSION = '1.0.0'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Severity levels
export const SEVERITIES = [
  { value: 'critical', label: 'Critical', color: '#ef4444' },
  { value: 'high', label: 'High', color: '#f97316' },
  { value: 'medium', label: 'Medium', color: '#eab308' },
  { value: 'low', label: 'Low', color: '#22c55e' },
  { value: 'info', label: 'Info', color: '#3b82f6' },
] as const

// Scan statuses
export const SCAN_STATUSES = [
  { value: 'pending', label: 'Pending', color: '#94a3b8' },
  { value: 'running', label: 'Running', color: '#3b82f6' },
  { value: 'completed', label: 'Completed', color: '#22c55e' },
  { value: 'failed', label: 'Failed', color: '#ef4444' },
  { value: 'cancelled', label: 'Cancelled', color: '#f59e0b' },
] as const

// Risk score thresholds
export const RISK_THRESHOLDS = {
  critical: 80,
  high: 60,
  medium: 40,
  low: 20,
} as const

// OWASP LLM Module definitions
export const OWASP_MODULES = [
  {
    id: 'llm01',
    number: 'LLM01',
    name: 'Prompt Injection',
    description: 'Detection and prevention of prompt injection attacks on LLMs',
    icon: 'Shield',
    path: '/modules/prompt-injection',
    features: ['Prompt Scanner', 'Risk Score', 'Injection Detection', 'Prompt Sanitization'],
  },
  {
    id: 'llm02',
    number: 'LLM02',
    name: 'Sensitive Information Disclosure',
    description: 'Detection of sensitive data leakage through LLM interactions',
    icon: 'Eye',
    path: '/modules/sensitive-info',
    features: ['API Key Detection', 'Secret Detection', 'PII Detection', 'Data Leakage Analysis'],
  },
  {
    id: 'llm03',
    number: 'LLM03',
    name: 'Supply Chain Security',
    description: 'AI model supply chain vulnerability assessment',
    icon: 'Boxes',
    path: '/modules/supply-chain',
    features: ['Model Inventory', 'AI SBOM', 'Dependency Scanner', 'SDK Risk Assessment'],
  },
  {
    id: 'llm04',
    number: 'LLM04',
    name: 'Data and Model Poisoning',
    description: 'Detection of poisoned training data and model integrity verification',
    icon: 'Skull',
    path: '/modules/data-poisoning',
    features: ['Training Data Validation', 'RAG Validation', 'Integrity Check', 'Trust Scoring'],
  },
  {
    id: 'llm05',
    number: 'LLM05',
    name: 'Improper Output Handling',
    description: 'Validation and sanitization of LLM-generated outputs',
    icon: 'FileX',
    path: '/modules/output-handling',
    features: ['Output Sanitization', 'XSS Detection', 'Unsafe HTML Detection', 'Code Gen Validation'],
  },
  {
    id: 'llm06',
    number: 'LLM06',
    name: 'Excessive Agency',
    description: 'Management and monitoring of AI agent permissions',
    icon: 'Bot',
    path: '/modules/excessive-agency',
    features: ['Permission Management', 'Privilege Review', 'Action Approval', 'Tool Monitoring'],
  },
  {
    id: 'llm07',
    number: 'LLM07',
    name: 'System Prompt Leakage',
    description: 'Detection of system prompt extraction and leakage',
    icon: 'Key',
    path: '/modules/prompt-leakage',
    features: ['Leakage Detection', 'Exposure Testing', 'Secret Detection', 'Prompt Hardening'],
  },
  {
    id: 'llm08',
    number: 'LLM08',
    name: 'Vector and Embedding Security',
    description: 'Security assessment of vector databases and embeddings',
    icon: 'Database',
    path: '/modules/vector-security',
    features: ['Vector DB Security', 'Tenant Isolation', 'Embedding Exposure', 'RAG Security'],
  },
  {
    id: 'llm09',
    number: 'LLM09',
    name: 'Misinformation & Hallucination',
    description: 'Detection and prevention of AI hallucinations and misinformation',
    icon: 'AlertCircle',
    path: '/modules/hallucination',
    features: ['Hallucination Detection', 'Citation Validation', 'Confidence Scoring', 'Response Validation'],
  },
  {
    id: 'llm10',
    number: 'LLM10',
    name: 'Unbounded Consumption',
    description: 'Monitoring and prevention of resource abuse in AI systems',
    icon: 'Gauge',
    path: '/modules/unbounded-consumption',
    features: ['Token Monitoring', 'Cost Monitoring', 'DoS Detection', 'Rate Limit Assessment'],
  },
] as const

// Sidebar menu structure
export const SIDEBAR_MENU_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/dashboard',
    permission: 'view_dashboard',
  },
  {
    id: 'organizations',
    label: 'Organizations',
    icon: 'Building2',
    path: '/organizations',
    permission: 'view_organizations',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: 'FolderKanban',
    path: '/projects',
    permission: 'view_projects',
  },
  {
    id: 'ai-assets',
    label: 'AI Assets',
    icon: 'Brain',
    path: '/ai-assets/models',
    permission: 'view_ai_assets',
  },
  {
    id: 'scans',
    label: 'AI Security Scans',
    icon: 'Shield',
    path: '/scans',
    permission: 'view_scans',
  },
  {
    id: 'modules',
    label: 'OWASP Modules',
    icon: 'ShieldCheck',
    path: '/modules/prompt-injection',
    permission: 'view_modules',
  },
  {
    id: 'findings',
    label: 'AI Findings',
    icon: 'AlertCircle',
    path: '/findings',
    permission: 'view_findings',
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: 'ClipboardCheck',
    path: '/compliance',
    permission: 'view_compliance',
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'FileText',
    path: '/reports',
    permission: 'view_reports',
  },
  {
    id: 'agent-center',
    label: 'AI Agent Center',
    icon: 'Bot',
    path: '/agent-center',
    permission: 'view_agent_center',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    permission: 'view_settings',
  },
] as const

// Compliance frameworks
export const COMPLIANCE_FRAMEWORKS = [
  { id: 'owasp_genai', name: 'OWASP GenAI Security', short: 'OWASP GenAI' },
  { id: 'nist_ai_rmf', name: 'NIST AI RMF', short: 'NIST AI' },
  { id: 'iso_42001', name: 'ISO/IEC 42001', short: 'ISO 42001' },
  { id: 'iso_27001', name: 'ISO 27001', short: 'ISO 27001' },
  { id: 'mitre_atlas', name: 'MITRE ATLAS', short: 'MITRE ATLAS' },
] as const

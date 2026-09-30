export const getMockDataForUrl = (url: string): any => {
  const ts = new Date().toISOString();

  // Dashboard Overview
  if (url.includes('/risk-dashboard/overview')) {
    return {
      total_risks: 142,
      critical_risks: 12,
      high_risks: 45,
      owasp_coverage: 88,
      compliance_score: 92,
      total_assets: 46,
      active_scans: 3,
      recent_scans: [
        { id: 'scan-1', name: 'Demo Scan 1', scan_type: 'Full', status: 'completed', created_at: ts },
        { id: 'scan-2', name: 'Demo Scan 2', scan_type: 'Quick', status: 'in_progress', created_at: ts },
        { id: 'scan-3', name: 'Demo Scan 3', scan_type: 'Targeted', status: 'scheduled', created_at: ts }
      ],
      recent_findings: [
        { id: 'find-1', title: 'Demo Finding 1', module_type: 'llm01', severity: 'critical', created_at: ts },
        { id: 'find-2', title: 'Demo Finding 2', module_type: 'llm02', severity: 'high', created_at: ts }
      ]
    };
  }

  // Module Stats
  if (url.includes('/module-stats')) {
    return {
      total_modules: 10,
      total_records: 156,
      modules_with_data: 10,
      high_risk_with_data: 3,
      scan_actions_count: 42,
      active_monitors: 15,
      owasp_coverage: 100,
      modules: [
        { id: 'm1', number: 'LLM01', name: 'Prompt Injection', slug: 'prompt-injection', category: 'Security', record_count: 24, has_data: true }
      ]
    };
  }

  // Organizations
  if (url.includes('/organizations')) {
    return [
      { id: 'org-1', name: 'Acme Financial Services', industry: 'Financial Services', created_at: ts, member_count: 12, is_active: true, description: 'Leading financial services provider' },
      { id: 'org-2', name: 'Nova Healthcare', industry: 'Healthcare', created_at: ts, member_count: 8, is_active: true, description: 'Innovative healthcare solutions' },
      { id: 'org-3', name: 'Vertex Technologies', industry: 'Technology', created_at: ts, member_count: 15, is_active: true, description: 'Cutting-edge tech innovations' },
      { id: 'org-4', name: 'BlueWave Telecom', industry: 'Telecommunications', created_at: ts, member_count: 9, is_active: true, description: 'Global telecom services' },
      { id: 'org-5', name: 'Atlas Manufacturing', industry: 'Manufacturing', created_at: ts, member_count: 11, is_active: true, description: 'Industrial manufacturing leader' },
      { id: 'org-6', name: 'Nexa Energy', industry: 'Energy', created_at: ts, member_count: 7, is_active: true, description: 'Renewable energy pioneer' },
      { id: 'org-7', name: 'Orion Retail', industry: 'Retail', created_at: ts, member_count: 13, is_active: true, description: 'Retail chain across continents' },
      { id: 'org-8', name: 'Internal Security Lab', industry: 'Research', created_at: ts, member_count: 5, is_active: true, description: 'In-house security research lab' },
    ];
  }

  // Projects
  if (url.includes('/projects')) {
    return [
      { id: 'proj-1', name: 'Customer AI Security Assessment', organizationId: 'org-1', risk_score: 78, status: 'active', created_at: ts },
      { id: 'proj-2', name: 'Enterprise RAG Security', organizationId: 'org-3', risk_score: 65, status: 'active', created_at: ts },
      { id: 'proj-3', name: 'AI Agent Red Teaming', organizationId: 'org-2', risk_score: 72, status: 'active', created_at: ts },
      { id: 'proj-4', name: 'LLM Governance Review', organizationId: 'org-4', risk_score: 70, status: 'active', created_at: ts },
      { id: 'proj-5', name: 'GenAI Supply Chain Assessment', organizationId: 'org-5', risk_score: 68, status: 'active', created_at: ts },
    ];
  }

  // AI Assets
  if (url.includes('/ai-assets/models')) {
    return [
      { id: 'model-1', name: 'Llama 3', model_family: 'Llama', version: '3.1', is_active: true },
      { id: 'model-2', name: 'GPT-4', model_family: 'OpenAI', version: '4.0', is_active: true },
    ];
  }
  if (url.includes('/ai-assets/agents')) {
    return [
      { id: 'agent-1', name: 'Security Copilot', agent_type: 'assistant', status: 'active', risk_level: 'high' },
      { id: 'agent-2', name: 'Customer Support Agent', agent_type: 'assistant', status: 'active', risk_level: 'medium' },
    ];
  }
  if (url.includes('/ai-assets/rag-systems')) {
    return [
      { id: 'rag-1', name: 'Internal Knowledge Base', chunking_strategy: 'semantic', is_active: true },
    ];
  }
  if (url.includes('/ai-assets/vector-databases')) {
    return [
      { id: 'vdb-1', name: 'Pinecone Index', db_type: 'pinecone', is_active: true },
    ];
  }

  // Scans
  if (url === '/scans' || url.startsWith('/scans/') || url.startsWith('/scans?')) {
    return Array.from({ length: 30 }, (_, i) => ({
      id: `scan-${i + 1}`,
      name: `Demo Scan ${i + 1}`,
      scan_type: i % 2 === 0 ? 'Full Scan' : 'Quick Scan',
      status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'running' : 'scheduled',
      target_asset: i % 4 === 0 ? 'Llama 3' : i % 4 === 1 ? 'GPT-4' : 'Security Copilot',
      progress: i % 3 === 0 ? 100 : Math.min(100, (i * 7) % 100),
      findings_count: (i % 5) + 1,
      created_at: ts,
    }));
  }

  // Findings
  if (url === '/findings' || url.startsWith('/findings/') || url.startsWith('/findings?')) {
    const severities = ['critical', 'high', 'medium', 'low', 'informational'];
    const modules = ['llm01', 'llm02', 'llm03', 'llm04', 'llm05', 'llm06', 'llm07', 'llm08', 'llm09', 'llm10'];
    return Array.from({ length: 45 }, (_, i) => ({
      id: `find-${i + 1}`,
      title: `Demo Finding ${i + 1}`,
      severity: severities[i % severities.length],
      status: i % 4 === 0 ? 'open' : i % 4 === 1 ? 'in_review' : i % 4 === 2 ? 'remediation' : 'resolved',
      module_type: modules[i % modules.length],
      risk_score: 95 - i,
      discovered_at: ts,
      created_at: ts,
    }));
  }

  // ==========================================
  // OWASP MODULES
  // ==========================================

  // LLM02 Sensitive Info
  if (url.includes('/sensitive-info/secrets')) {
    return [
      { id: 'sec-1', secret_type: 'API_KEY', risk_level: 'critical', severity_score: 95, is_validated: true, detected_value_hash: 'sk-123***456', source: 'prompt', created_at: ts },
      { id: 'sec-2', secret_type: 'AWS_ACCESS_KEY', risk_level: 'high', severity_score: 85, is_validated: false, detected_value_hash: 'AKIA***', source: 'model_output', created_at: ts },
    ];
  }
  if (url.includes('/sensitive-info/pii')) {
    return [
      { id: 'pii-1', secret_type: 'EMAIL_ADDRESS', risk_level: 'medium', severity_score: 55, is_validated: true, detected_value_hash: 'user@***.com', source: 'prompt', created_at: ts },
    ];
  }

  // LLM03 Supply Chain
  if (url.includes('/supply-chain/sboms')) {
    return [
      { id: 'sbom-1', model: 'Llama 3', sbom_version: '1.0', format: 'CycloneDX', components: 45, vulnerabilities: 2, risk_score: 45, generated_at: ts },
    ];
  }
  if (url.includes('/supply-chain/dependencies')) {
    return [
      { id: 'dep-1', dependency_name: 'transformers', dependency_version: '4.20.0', dependency_type: 'pip', risk_level: 'high', is_outdated: true, latest_version: '4.38.0', created_at: ts },
    ];
  }
  if (url.includes('/supply-chain/sdk-assessments')) {
    return [
      { id: 'sdk-1', sdk_name: 'LangChain', sdk_version: '0.1.0', provider: 'Open Source', risk_score: 30, security_score: 85, created_at: ts },
    ];
  }

  // LLM04 Data Poisoning
  if (url.includes('/data-poisoning/validations')) {
    return [
      { id: 'val-1', data_source: 'user_upload', data_fingerprint: 'sha256:abc...', integrity_score: 98, trust_score: 95, validation_status: 'passed', created_at: ts },
    ];
  }
  if (url.includes('/data-poisoning/rag-documents')) {
    return [
      { id: 'rag-1', document_name: 'HR_Policy_2026.pdf', is_poisoned: false, confidence_score: 99, created_at: ts },
    ];
  }
  if (url.includes('/data-poisoning/integrity-checks')) {
    return [
      { id: 'chk-1', check_type: 'checksum_verify', is_passed: true, score: 100, created_at: ts },
    ];
  }

  // LLM05 Output Handling
  if (url.includes('/output-handling/sanitizations')) {
    return [
      { id: 'san-1', output_type: 'html', is_sanitized: true, severity: 'low', risk_score: 15, created_at: ts },
    ];
  }
  if (url.includes('/output-handling/xss')) {
    return [
      { id: 'xss-1', xss_type: 'reflected', payload_preview: '<script>alert(1)</script>', risk_level: 'high', created_at: ts },
    ];
  }
  if (url.includes('/output-handling/unsafe-code')) {
    return [
      { id: 'unc-1', vulnerability_type: 'command_injection', code_language: 'bash', code_snippet: 'os.system(user_input)', risk_level: 'critical', created_at: ts },
    ];
  }

  // LLM06 Excessive Agency
  if (url.includes('/excessive-agency/permissions')) {
    return [
      { id: 'perm-1', permission_name: 'read_files', resource_type: 'local_storage', action: 'read', is_granted: true, risk_score: 45, requires_human_approval: false },
      { id: 'perm-2', permission_name: 'execute_code', resource_type: 'system_shell', action: 'execute', is_granted: false, risk_score: 95, requires_human_approval: true },
    ];
  }
  if (url.includes('/excessive-agency/approvals')) {
    return [
      { id: 'appr-1', action_description: 'Execute database drop command', status: 'pending', risk_level: 'critical', created_at: ts },
    ];
  }
  if (url.includes('/excessive-agency/tool-logs')) {
    return [
      { id: 'log-1', tool_name: 'python_interpreter', action_performed: 'Executed script', status: 'allowed', risk_level: 'low', executed_at: ts },
    ];
  }

  // LLM07 Prompt Leakage
  if (url.includes('/prompt-leakage/scans')) {
    return [
      { id: 'leak-1', leakage_found: true, exposure_type: 'system_prompt', risk_score: 85, prompt_hardening_score: 40, recommendations: ['Add delimiter', 'Use explicit system instructions'], created_at: ts },
      { id: 'leak-2', leakage_found: false, exposure_type: 'none', risk_score: 10, prompt_hardening_score: 95, recommendations: [], created_at: ts },
    ];
  }
  if (url.includes('/prompt-leakage/secrets')) {
    return [
      { id: 'plsec-1', secret_type: 'api_key', location: 'System Prompt Line 42', risk_level: 'critical', created_at: ts },
    ];
  }

  // LLM08 Vector Security
  if (url.includes('/vector-security/assessments')) {
    return [
      { id: 'vsec-1', vector_db: 'Pinecone Prod', tenant_isolation_valid: true, encryption_at_rest: true, encryption_in_transit: true, access_control_score: 90, security_score: 95, assessed_at: ts },
      { id: 'vsec-2', vector_db: 'Weaviate Dev', tenant_isolation_valid: false, encryption_at_rest: false, encryption_in_transit: true, access_control_score: 40, security_score: 35, assessed_at: ts },
    ];
  }
  if (url.includes('/vector-security/embedding-exposures')) {
    return [
      { id: 'expo-1', embedding_id: 'vec-8891', sensitive_data_type: 'PII', risk_level: 'high', created_at: ts },
    ];
  }
  if (url.includes('/vector-security/rag-assessments')) {
    return [
      { id: 'ragsec-1', rag_system: 'Customer KB', retrieval_security_score: 88, prompt_injection_risk: 15, data_exposure_risk: 10, findings: [], created_at: ts },
    ];
  }

  // LLM09 Hallucination
  if (url.includes('/hallucination/findings')) {
    return [
      { id: 'hal-1', input_text: 'Who is the CEO of Acme?', output_text: 'John Doe is the CEO.', hallucination_type: 'factual_inaccuracy', hallucination_score: 85, severity: 'high', citations_valid: false, created_at: ts },
    ];
  }
  if (url.includes('/hallucination/citations')) {
    return [
      { id: 'cit-1', citation_text: 'Source document 12', source_url: 'https://internal/doc', source_title: 'Doc 12', status: 'valid', created_at: ts },
    ];
  }
  if (url.includes('/hallucination/response-validations')) {
    return [
      { id: 'rval-1', response_text: 'Valid response', overall_validity_score: 95, trust_score: 90, status: 'valid', created_at: ts },
    ];
  }

  // LLM10 Unbounded Consumption
  if (url.includes('/unbounded-consumption/token-usage')) {
    return [
      { id: 'tok-1', model: 'GPT-4', usage_type: 'prompt', tokens_used: 150000, cost: 4.5, requests_count: 1200, is_anomalous: true, recorded_at: ts },
    ];
  }
  if (url.includes('/unbounded-consumption/dos-events')) {
    return [
      { id: 'dos-1', event_type: 'rapid_requests', severity: 'high', status: 'blocked', description: 'Blocked 10k requests from single IP', detected_at: ts },
    ];
  }
  if (url.includes('/unbounded-consumption/rate-limits')) {
    return [
      { id: 'rat-1', model: 'GPT-4', current_rpm_limit: 500, current_tpm_limit: 100000, peak_rpm_observed: 480, peak_tpm_observed: 95000, rate_limiting_active: true, effectiveness_score: 98, created_at: ts },
    ];
  }

  // Compliance
  if (url.includes('/compliance')) {
    return [
      { id: 'comp-1', framework: 'OWASP LLM Top 10', coverage: 78 },
      { id: 'comp-2', framework: 'NIST AI RMF', coverage: 71 },
      { id: 'comp-3', framework: 'ISO/IEC 42001', coverage: 66 },
      { id: 'comp-4', framework: 'Internal AI Security Controls', coverage: 84 },
    ];
  }

  // Reports
  if (url.includes('/reports')) {
    return Array.from({ length: 12 }, (_, i) => ({
      id: `report-${i + 1}`,
      name: `Demo Report ${i + 1}`,
      type: i % 2 === 0 ? 'Executive' : 'Technical',
      organizationId: `org-${(i % 8) + 1}`,
      created_at: ts,
      status: 'completed',
    }));
  }

  // Agent Center (AI agents list)
  if (url.includes('/agent-center')) {
    return [
      { id: 'agent-1', name: 'Security Copilot', type: 'assistant', status: 'active' },
      { id: 'agent-2', name: 'Customer Support Agent', type: 'assistant', status: 'active' },
      { id: 'agent-3', name: 'Developer Assistant', type: 'assistant', status: 'inactive' },
      { id: 'agent-4', name: 'Compliance Copilot', type: 'assistant', status: 'active' },
    ];
  }

  // Fallback for everything else
  return [];
};

export const getMockDataForUrl = (url: string): any[] => {
  const ts = new Date().toISOString()
  
  if (url.includes('/scans')) {
    return [
      { id: 'scan-1', title: 'Weekly Security Scan', status: 'completed', target_asset: 'Security Copilot', progress: 100, findings_count: 12, created_at: ts },
      { id: 'scan-2', title: 'Ad-hoc Prompt Injection Test', status: 'completed', target_asset: 'Llama 3 8B', progress: 100, findings_count: 3, created_at: ts },
      { id: 'scan-3', title: 'Vector DB Assessment', status: 'in_progress', target_asset: 'Main Chroma Cluster', progress: 45, findings_count: 0, created_at: ts },
    ]
  }
  
  if (url.includes('/findings')) {
    return [
      { id: 'find-1', title: 'Prompt Override Vulnerability', severity: 'critical', status: 'open', asset_name: 'Security Copilot', category: 'Prompt Injection', created_at: ts },
      { id: 'find-2', title: 'PII Exposure in Logs', severity: 'high', status: 'in_progress', asset_name: 'RAG Pipeline', category: 'Sensitive Info', created_at: ts },
      { id: 'find-3', title: 'Outdated LangChain SDK', severity: 'medium', status: 'open', asset_name: 'Internal Knowledge Base', category: 'Supply Chain', created_at: ts },
      { id: 'find-4', title: 'Excessive File Read Permission', severity: 'high', status: 'resolved', asset_name: 'Code Assistant', category: 'Excessive Agency', created_at: ts },
    ]
  }

  if (url.includes('/data-poisoning/validations')) {
    return [
      { id: '1', scan: 'scan1', data_source: 'training', data_fingerprint: 'sha256-abc123...', integrity_score: 95, anomalies_detected: [], trust_score: 98, validation_status: 'passed', created_at: ts },
      { id: '2', scan: 'scan2', data_source: 'fine_tuning', data_fingerprint: 'sha256-def456...', integrity_score: 65, anomalies_detected: ['Statistical drift', 'Unknown tokens'], trust_score: 55, validation_status: 'danger', created_at: ts }
    ]
  }
  if (url.includes('/data-poisoning/rag-documents')) {
    return [
      { id: '1', document_id: 'doc-auth-12', document_name: 'auth_spec.pdf', content_hash: 'md5-111...', is_poisoned: false, poisoning_indicators: [], confidence_score: 99.5, created_at: ts },
      { id: '2', document_id: 'doc-user-88', document_name: 'user_uploaded_resume.pdf', content_hash: 'md5-222...', is_poisoned: true, poisoning_indicators: ['Invisible text', 'Contradictory system instructions'], confidence_score: 82.1, created_at: ts }
    ]
  }
  if (url.includes('/data-poisoning/integrity-checks')) {
    return [
      { id: '1', check_type: 'Hash Verification', is_passed: true, score: 100, created_at: ts },
      { id: '2', check_type: 'Anomaly Detection', is_passed: false, score: 45, created_at: ts }
    ]
  }

  if (url.includes('/excessive-agency/tool-logs')) {
    return [
      { id: '1', tool_name: 'TerminalExecutor', action_performed: 'rm -rf /tmp/cache', status: 'blocked', risk_level: 'critical', executed_at: ts },
      { id: '2', tool_name: 'SQLQueryEngine', action_performed: 'SELECT * FROM users', status: 'success', risk_level: 'high', executed_at: ts }
    ]
  }
  if (url.includes('/excessive-agency/approvals')) {
    return [
      { id: '1', action_description: 'Write to protected S3 bucket', status: 'pending', risk_assessment: { score: 85 }, created_at: ts },
      { id: '2', action_description: 'Read user configuration', status: 'approved', risk_assessment: { score: 20 }, created_at: ts }
    ]
  }
  if (url.includes('/excessive-agency/permissions')) {
    return [
      { id: '1', agent: 'SupportBot', permission_name: 'WriteDatabase', resource_type: 'DB', action: 'write', is_granted: true, risk_score: 90, requires_human_approval: true, created_at: ts },
      { id: '2', agent: 'SupportBot', permission_name: 'ReadDocs', resource_type: 'File', action: 'read', is_granted: true, risk_score: 10, requires_human_approval: false, created_at: ts }
    ]
  }

  if (url.includes('/output-handling/sanitizations')) {
    return [
      { id: '1', scan: 'scan1', output_type: 'html', is_sanitized: true, severity: 'high', raw_output: '<script>alert(1)</script>', sanitized_output: '&lt;script&gt;alert(1)&lt;/script&gt;', vulnerabilities_found: ['XSS'], risk_score: 88, created_at: ts }
    ]
  }
  if (url.includes('/output-handling/xss')) {
    return [
      { id: '1', xss_type: 'Stored', payload_preview: 'javascript:eval(...)', risk_level: 'critical', created_at: ts }
    ]
  }
  if (url.includes('/output-handling/unsafe-code')) {
    return [
      { id: '1', vulnerability_type: 'Command Injection', code_language: 'python', code_snippet: 'os.system(user_input)', risk_level: 'critical', created_at: ts }
    ]
  }

  if (url.includes('/prompt-leakage/scans')) {
    return [
      { id: '1', scan: 'scan1', leakage_found: true, leaked_content: 'System Prompt: You are a helpful assistant...', exposure_type: 'Direct Extraction', risk_score: 95, prompt_hardening_score: 30, recommendations: ['Use constitutional AI', 'Filter system instructions from output'], created_at: ts }
    ]
  }
  if (url.includes('/prompt-leakage/secrets')) {
    return [
      { id: '1', secret_type: 'API Key', location: 'System Prompt Line 4', risk_level: 'critical', created_at: ts }
    ]
  }

  if (url.includes('/sensitive-info/pii')) {
    return [
      { id: '1', pii_type: 'Email Address', count: 45, risk_level: 'high', created_at: ts },
      { id: '2', pii_type: 'Credit Card', count: 2, risk_level: 'critical', created_at: ts }
    ]
  }
  if (url.includes('/sensitive-info/scans')) {
    return [
      { id: '1', scan: 'scan1', secret_type: 'AWS Access Key', detected_value_hash: 'hash...', source: 'Training Data', risk_level: 'critical', is_validated: true, severity_score: 98, context_snippet: '...access_key=AKIAIOSFODNN7EXAMPLE...', created_at: ts }
    ]
  }

  if (url.includes('/supply-chain/sboms')) {
    return [
      { id: '1', model: 'Llama 3', sbom_version: '1.0', format: 'CycloneDX', components: 145, vulnerabilities: 3, risk_score: 45, generated_at: ts }
    ]
  }
  if (url.includes('/supply-chain/sdks')) {
    return [
      { id: '1', sdk_name: 'LangChain', sdk_version: '0.0.300', provider: 'LangChain', permissions_required: ['file_read'], data_access: ['prompts'], risk_score: 60, security_score: 80, findings: ['Outdated version'], created_at: ts }
    ]
  }
  if (url.includes('/supply-chain/dependencies')) {
    return [
      { id: '1', scan: 'scan1', dependency_name: 'requests', dependency_version: '2.28.0', dependency_type: 'pip', known_vulnerabilities: [{ id: 'CVE-2023-XXXX' }], risk_level: 'high', is_outdated: true, latest_version: '2.31.0', license_info: 'Apache 2.0', created_at: ts }
    ]
  }

  if (url.includes('/unbounded-consumption/usage')) {
    return [
      { id: '1', organization: 'Org1', model: 'GPT-4', usage_type: 'inference', tokens_used: 1500000, cost: 45.00, requests_count: 5000, is_anomalous: true, recorded_at: ts }
    ]
  }
  if (url.includes('/unbounded-consumption/dos')) {
    return [
      { id: '1', event_type: 'Token Exhaustion', severity: 'critical', status: 'mitigated', description: 'User sent 100k tokens in 1 minute', detected_at: ts }
    ]
  }
  if (url.includes('/unbounded-consumption/rate-limits')) {
    return [
      { id: '1', model: 'GPT-4', current_rpm_limit: 100, current_tpm_limit: 40000, peak_rpm_observed: 150, peak_tpm_observed: 60000, rate_limiting_active: true, effectiveness_score: 85, recommendations: ['Implement user-level quotas'], created_at: ts }
    ]
  }

  if (url.includes('/vector-security/assessments')) {
    return [
      { id: '1', scan: 'scan1', vector_db: 'Pinecone', tenant_isolation_valid: true, encryption_at_rest: true, encryption_in_transit: true, access_control_score: 90, security_score: 95, assessed_at: ts }
    ]
  }
  if (url.includes('/vector-security/exposures')) {
    return [
      { id: '1', embedding_id: 'emb-123', sensitive_data_type: 'PHI', risk_level: 'critical', created_at: ts }
    ]
  }
  if (url.includes('/vector-security/rag')) {
    return [
      { id: '1', rag_system: 'Internal KB', retrieval_security_score: 80, prompt_injection_risk: 40, data_exposure_risk: 20, findings: [{ type: 'Injection', message: 'Vulnerable to indirect prompt injection' }], created_at: ts }
    ]
  }

  if (url.includes('/hallucination/scans')) {
    return [
      { id: '1', scan: 'scan1', input_text: 'What is the capital of France?', output_text: 'The capital of France is London.', hallucination_type: 'Factual Inconsistency', hallucination_score: 99, severity: 'high', citations_valid: false, created_at: ts }
    ]
  }
  if (url.includes('/hallucination/citations')) {
    return [
      { id: '1', citation_text: 'According to a recent study...', source_url: 'http://fake-url.com', source_title: 'Fake Study', status: 'invalid', created_at: ts }
    ]
  }
  if (url.includes('/hallucination/responses')) {
    return [
      { id: '1', response_text: 'The system has been updated.', overall_validity_score: 45, trust_score: 30, status: 'warning', created_at: ts }
    ]
  }
  
  if (url.includes('/organizations')) {
    return [
      { id: 'org-1', name: 'Acme Corp Security', industry: 'Technology', created_at: ts }
    ]
  }
  
  if (url.includes('/projects')) {
    return [
      { id: 'proj-1', name: 'Customer Support Bot Audit', status: 'active', risk_score: 75, created_at: ts }
    ]
  }

  // Fallback for everything else
  return []
}

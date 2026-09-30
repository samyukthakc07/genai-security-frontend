export const dashboardMockData = {
  overview: {
    organizations: 8,
    active_projects: 14,
    ai_assets: 32,
    security_scans: 186,
    open_findings: 47,
    critical_findings: 6,
    high_findings: 12,
    medium_findings: 17,
    low_findings: 12,
    average_risk_score: 63,
    compliance_coverage: 78,
    models_assessed: 21
  },
  executive_risk: {
    posture: "Elevated Risk",
    remediated_findings: 29,
    assets_requiring_attention: 11
  },
  owasp_modules: [
    { id: "llm01", number: "LLM01", name: "Prompt Injection", risk: "Critical", findings: 9, score: 88, path: "/modules/prompt-injection" },
    { id: "llm02", number: "LLM02", name: "Sensitive Information Disclosure", risk: "High", findings: 7, score: 79, path: "/modules/sensitive-info" },
    { id: "llm03", number: "LLM03", name: "Supply Chain", risk: "High", findings: 6, score: 74, path: "/modules/supply-chain" },
    { id: "llm04", number: "LLM04", name: "Data and Model Poisoning", risk: "Medium", findings: 4, score: 61, path: "/modules/data-poisoning" },
    { id: "llm05", number: "LLM05", name: "Improper Output Handling", risk: "High", findings: 5, score: 72, path: "/modules/output-handling" },
    { id: "llm06", number: "LLM06", name: "Excessive Agency", risk: "Medium", findings: 4, score: 58, path: "/modules/excessive-agency" },
    { id: "llm07", number: "LLM07", name: "System Prompt Leakage", risk: "High", findings: 5, score: 76, path: "/modules/prompt-leakage" },
    { id: "llm08", number: "LLM08", name: "Vector and Embedding Weaknesses", risk: "Medium", findings: 3, score: 55, path: "/modules/vector-security" },
    { id: "llm09", number: "LLM09", name: "Misinformation", risk: "Medium", findings: 2, score: 48, path: "/modules/hallucination" },
    { id: "llm10", number: "LLM10", name: "Unbounded Consumption", risk: "Low", findings: 2, score: 34, path: "/modules/unbounded-consumption" }
  ],
  ai_assets: [
    { id: "asset-1", name: "Customer Support Assistant", type: "LLM Application", model: "Llama 3.2 3B", environment: "Production", risk: "High", open_findings: 7 },
    { id: "asset-2", name: "Internal Knowledge Assistant", type: "RAG Application", model: "Llama 3", environment: "Production", risk: "Medium", open_findings: 4 },
    { id: "asset-3", name: "Security Copilot", type: "AI Agent", model: "Custom LLM", environment: "Staging", risk: "Critical", open_findings: 6 },
    { id: "asset-4", name: "Document Intelligence", type: "RAG Application", model: "Phi-3", environment: "Production", risk: "Medium", open_findings: 3 },
    { id: "asset-5", name: "Developer Assistant", type: "Coding Assistant", model: "Code LLM", environment: "Development", risk: "High", open_findings: 5 }
  ],
  recent_scans: [
    { id: "SCAN-2026-0186", type: "Prompt Injection Assessment", asset: "Customer Support Assistant", status: "Completed", findings_count: 9, risk: "Critical", date: "2026-09-29T10:00:00Z" },
    { id: "SCAN-2026-0185", type: "Supply Chain Assessment", asset: "Developer Assistant", status: "Completed", findings_count: 6, risk: "High", date: "2026-09-28T14:30:00Z" },
    { id: "SCAN-2026-0184", type: "Sensitive Information Assessment", asset: "Internal Knowledge Assistant", status: "Completed", findings_count: 4, risk: "High", date: "2026-09-27T09:15:00Z" },
    { id: "SCAN-2026-0183", type: "System Prompt Leakage Assessment", asset: "Security Copilot", status: "Completed", findings_count: 5, risk: "High", date: "2026-09-26T16:45:00Z" },
    { id: "SCAN-2026-0182", type: "Vector Security Assessment", asset: "Document Intelligence", status: "Completed", findings_count: 3, risk: "Medium", date: "2026-09-25T11:20:00Z" }
  ],
  critical_findings: [
    { id: "FND-2026-047", title: "Prompt Injection — Instruction Override", asset: "Customer Support Assistant", severity: "Critical", score: 94, status: "Open" },
    { id: "FND-2026-046", title: "System Prompt Exposure", asset: "Security Copilot", severity: "Critical", score: 92, status: "In Review" },
    { id: "FND-2026-045", title: "Vulnerable Third-Party AI Dependency", asset: "Developer Assistant", severity: "High", score: 86, status: "Open" },
    { id: "FND-2026-044", title: "Sensitive Data Exposure in Model Output", asset: "Internal Knowledge Assistant", severity: "High", score: 83, status: "Remediation" },
    { id: "FND-2026-043", title: "Unrestricted Agent Tool Permission", asset: "Security Copilot", severity: "Critical", score: 91, status: "Open" }
  ],
  risk_trend: [
    { month: "Apr", score: 74 },
    { month: "May", score: 72 },
    { month: "Jun", score: 70 },
    { month: "Jul", score: 68 },
    { month: "Aug", score: 65 },
    { month: "Sep", score: 63 }
  ],
  recent_activity: [
    { id: "act-1", text: "Prompt Injection assessment completed for Customer Support Assistant", date: "2026-09-29T10:05:00Z" },
    { id: "act-2", text: "Critical finding FND-2026-047 assigned for remediation", date: "2026-09-29T09:30:00Z" },
    { id: "act-3", text: "Security Copilot risk score increased from 82 to 91", date: "2026-09-28T16:15:00Z" },
    { id: "act-4", text: "Supply Chain assessment completed for Developer Assistant", date: "2026-09-28T14:35:00Z" },
    { id: "act-5", text: "System Prompt Leakage finding moved to In Review", date: "2026-09-27T11:20:00Z" },
    { id: "act-6", text: "Document Intelligence remediation verified", date: "2026-09-26T14:10:00Z" }
  ],
  compliance: [
    { framework: "OWASP LLM Top 10", coverage: 78 },
    { framework: "NIST AI RMF", coverage: 71 },
    { framework: "ISO/IEC 42001", coverage: 66 },
    { framework: "Internal AI Security Controls", coverage: 84 }
  ]
};

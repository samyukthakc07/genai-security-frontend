export const aiAssetsMockData = {
  agents: [
    {
      id: "0e70640f-471b-44d8-abd5-ee1e2a550d6e",
      name: "Security Copilot",
      type: "AI Agent",
      model: "Llama 3.2 3B",
      provider: "Local / Self-hosted",
      environment: "Production",
      status: "Active",
      riskLevel: "Critical",
      riskScore: 91,
      owner: "Security Operations",
      description: "AI-assisted security operations agent used for investigation support, alert enrichment, and incident triage.",
      businessFunction: "SOC investigation and incident triage",
      createdDate: "2026-01-15",
      lastUpdated: "2026-09-28",
      lastAssessment: "2026-09-29",
      capabilities: ["Alert enrichment", "Incident summarization", "Threat intelligence lookup", "Investigation assistance", "Case recommendation"],
      integrations: ["SIEM", "Threat Intelligence", "Knowledge Base", "Case Management"],
      permissions: [
        { name: "Read security alerts", risk: "Low" },
        { name: "Read threat intelligence", risk: "Low" },
        { name: "Create investigation notes", risk: "Medium" },
        { name: "Recommend remediation", risk: "High" }
      ],
      securityControls: [
        { name: "Input Validation", status: "Enabled" },
        { name: "Prompt Injection Protection", status: "Needs Improvement" },
        { name: "Output Filtering", status: "Enabled" },
        { name: "Tool Authorization", status: "Partial" },
        { name: "Human Approval", status: "Enabled for high-impact actions" },
        { name: "Rate Limiting", status: "Enabled" },
        { name: "Sensitive Data Filtering", status: "Enabled" },
        { name: "System Prompt Protection", status: "Needs Improvement" }
      ],
      findings: [
        { id: "FND-2026-047", title: "Instruction Override Vulnerability", category: "LLM01 Prompt Injection", severity: "Critical", score: 94, status: "Open", description: "The simulated assessment identified insufficient resistance to instruction-override patterns.", recommendation: "Enforce instruction hierarchy and validate untrusted contextual input before it reaches privileged agent workflows." },
        { id: "FND-2026-046", title: "System Prompt Exposure Risk", category: "LLM07 System Prompt Leakage", severity: "High", score: 84, status: "In Review", description: "Agent system prompt can be leaked via specific adversarial prompts.", recommendation: "Implement prompt hardening and output filtering." },
        { id: "FND-2026-043", title: "Unrestricted Agent Tool Permission", category: "LLM06 Excessive Agency", severity: "Critical", score: 91, status: "Open", description: "Agent has permissions that exceed its required scope.", recommendation: "Implement least privilege principles for agent tool access." }
      ],
      owaspExposure: [
        { id: "llm01", number: "LLM01", name: "Prompt Injection", risk: "Critical", findings: 2, score: 94 },
        { id: "llm06", number: "LLM06", name: "Excessive Agency", risk: "Critical", findings: 1, score: 91 },
        { id: "llm07", number: "LLM07", name: "System Prompt Leakage", risk: "High", findings: 1, score: 84 },
        { id: "llm03", number: "LLM03", name: "Supply Chain", risk: "Medium", findings: 1, score: 58 }
      ],
      assessments: [
        { id: "ASM-2026-091", type: "Prompt Injection Assessment", date: "Sep 29, 2026", risk: "Critical", tests: 9, findings: 3, status: "Completed" },
        { id: "ASM-2026-087", type: "Excessive Agency Assessment", date: "Sep 24, 2026", risk: "High", tests: 12, findings: 2, status: "Completed" },
        { id: "ASM-2026-081", type: "Sensitive Information Assessment", date: "Sep 18, 2026", risk: "Medium", tests: 10, findings: 1, status: "Completed" }
      ],
      activity: [
        { id: "act-1", text: "Prompt Injection assessment completed.", date: "2026-09-29T10:05:00Z" },
        { id: "act-2", text: "Critical finding assigned for remediation.", date: "2026-09-28T09:30:00Z" },
        { id: "act-3", text: "Tool authorization policy updated.", date: "2026-09-26T16:15:00Z" },
        { id: "act-4", text: "Excessive Agency assessment completed.", date: "2026-09-24T14:35:00Z" },
        { id: "act-5", text: "New knowledge-base integration added.", date: "2026-09-20T11:20:00Z" }
      ]
    },
    {
      id: "agent-customer-support-001",
      name: "Customer Support Assistant",
      type: "AI Agent",
      model: "Llama 3.2 3B",
      provider: "Cloud Provider",
      environment: "Production",
      status: "Active",
      riskLevel: "High",
      riskScore: 82,
      owner: "Customer Success",
      description: "Customer-facing assistant that handles tier-1 support queries.",
      businessFunction: "Customer Support",
      createdDate: "2025-11-20",
      lastUpdated: "2026-09-15",
      lastAssessment: "2026-09-28",
      capabilities: ["Ticket triaging", "FAQ answering", "Order status lookup"],
      integrations: ["Zendesk", "Shopify"],
      permissions: [
        { name: "Read order details", risk: "Medium" },
        { name: "Create support tickets", risk: "Low" }
      ],
      securityControls: [
        { name: "Input Validation", status: "Enabled" },
        { name: "Sensitive Data Filtering", status: "Needs Improvement" }
      ],
      findings: [
        { id: "FND-2026-044", title: "Sensitive Data Exposure in Model Output", category: "LLM02 Sensitive Information", severity: "High", score: 83, status: "Open", description: "PII leakage in specific edge cases.", recommendation: "Enhance PII redaction pipeline." }
      ],
      owaspExposure: [
        { id: "llm02", number: "LLM02", name: "Sensitive Information Disclosure", risk: "High", findings: 1, score: 83 }
      ],
      assessments: [
        { id: "ASM-2026-081", type: "Sensitive Information Assessment", date: "Sep 28, 2026", risk: "High", tests: 10, findings: 1, status: "Completed" }
      ],
      activity: [
        { id: "act-1", text: "Sensitive Information assessment completed.", date: "2026-09-28T14:35:00Z" }
      ]
    },
    {
      id: "agent-dev-assistant-001",
      name: "Developer Assistant",
      type: "AI Agent",
      model: "Code LLM",
      provider: "Internal",
      environment: "Development",
      status: "Active",
      riskLevel: "Medium",
      riskScore: 65,
      owner: "Engineering",
      description: "Internal coding assistant for code generation and review.",
      businessFunction: "Software Engineering",
      createdDate: "2026-03-10",
      lastUpdated: "2026-09-10",
      lastAssessment: "2026-09-15",
      capabilities: ["Code completion", "Code review", "PR summarization"],
      integrations: ["GitHub", "Jira"],
      permissions: [
        { name: "Read repositories", risk: "High" },
        { name: "Create PRs", risk: "Medium" }
      ],
      securityControls: [
        { name: "Tool Authorization", status: "Enabled" }
      ],
      findings: [],
      owaspExposure: [],
      assessments: [],
      activity: []
    }
  ],
  models: [
    {
      id: "model-llama-3-001",
      name: "Llama 3 8B",
      type: "Model",
      model: "Meta Llama",
      provider: "Local / Self-hosted",
      environment: "Production",
      status: "Active",
      riskLevel: "Medium",
      riskScore: 45,
      owner: "Platform Team",
      description: "Base model used for various internal text processing tasks.",
      businessFunction: "Core AI Platform",
      createdDate: "2026-04-01",
      lastUpdated: "2026-09-01",
      lastAssessment: "2026-09-05",
      capabilities: ["Text generation", "Summarization"],
      integrations: ["Internal API"],
      permissions: [],
      securityControls: [],
      findings: [],
      owaspExposure: [],
      assessments: [],
      activity: []
    }
  ],
  'rag-systems': [
    {
      id: "rag-internal-kb-001",
      name: "Internal Knowledge Base RAG",
      type: "RAG System",
      model: "Llama 3 8B",
      provider: "Local / Self-hosted",
      environment: "Production",
      status: "Active",
      riskLevel: "Medium",
      riskScore: 55,
      owner: "HR",
      description: "RAG pipeline answering questions about employee policies.",
      businessFunction: "Human Resources",
      createdDate: "2026-05-20",
      lastUpdated: "2026-09-20",
      lastAssessment: "2026-09-25",
      capabilities: ["Document retrieval", "Question answering"],
      integrations: ["Confluence", "ChromaDB"],
      permissions: [
        { name: "Read Confluence", risk: "Medium" }
      ],
      securityControls: [],
      findings: [],
      owaspExposure: [],
      assessments: [],
      activity: []
    }
  ],
  'vector-dbs': [
    {
      id: "vdb-chroma-001",
      name: "Main Chroma Cluster",
      type: "Vector DB",
      model: "N/A",
      provider: "Self-hosted",
      environment: "Production",
      status: "Active",
      riskLevel: "Low",
      riskScore: 25,
      owner: "Data Engineering",
      description: "Vector database for storing text embeddings.",
      businessFunction: "Core Data Infrastructure",
      createdDate: "2026-02-15",
      lastUpdated: "2026-09-01",
      lastAssessment: "2026-09-10",
      capabilities: ["Vector search"],
      integrations: [],
      permissions: [],
      securityControls: [],
      findings: [],
      owaspExposure: [],
      assessments: [],
      activity: []
    }
  ]
};

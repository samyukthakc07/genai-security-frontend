import apiClient from './apiClient'

export interface AIModelData {
  id: string
  name: string
  model_type: string
  model_type_display?: string
  model_family: string
  version: string
  endpoint_url: string
  context_window: number
  capabilities: string[]
  risk_score: number
  discovery_method: string
  metadata: Record<string, unknown>
  is_active: boolean
  last_scanned_at: string | null
  created_at: string
  updated_at: string
}

export interface AIAgentData {
  id: string
  name: string
  agent_type: string
  agent_type_display?: string
  description: string
  permissions: Record<string, unknown>
  tools: string[]
  allowed_actions: string[]
  disallowed_actions: string[]
  human_approval_required: boolean
  risk_level: string
  risk_level_display?: string
  status: string
  status_display?: string
  metadata: Record<string, unknown>
  model?: string | { id: string; name: string }
  created_at: string
  updated_at: string
}

export interface RAGSystemData {
  id: string
  name: string
  chunking_strategy: string
  chunk_size: number
  chunk_overlap: number
  retrieval_config: Record<string, unknown>
  security_config: Record<string, unknown>
  risk_score: number
  is_active: boolean
  vector_db?: string | { id: string; name: string }
  embedding_model?: string | { id: string; name: string }
  created_at: string
  updated_at: string
}

export interface VectorDatabaseData {
  id: string
  name: string
  db_type: string
  db_type_display?: string
  endpoint_url: string
  tenant_id: string
  dimension: number
  indexing_method: string
  security_config: Record<string, unknown>
  risk_score: number
  is_active: boolean
  last_assessed_at: string | null
  created_at: string
  updated_at: string
}

const assetService = {
  // ── Models ──
  async listModels(): Promise<AIModelData[]> {
    const { data } = await apiClient.get('/ai-assets/models/')
    return data.results || data
  },
  async getModel(id: string): Promise<AIModelData> {
    const { data } = await apiClient.get(`/ai-assets/models/${id}/`)
    return data
  },

  // ── Agents ──
  async listAgents(): Promise<AIAgentData[]> {
    const { data } = await apiClient.get('/ai-assets/agents/')
    return data.results || data
  },
  async getAgent(id: string): Promise<AIAgentData> {
    const { data } = await apiClient.get(`/ai-assets/agents/${id}/`)
    return data
  },

  // ── RAG Systems ──
  async listRAGSystems(): Promise<RAGSystemData[]> {
    const { data } = await apiClient.get('/ai-assets/rag-systems/')
    return data.results || data
  },
  async getRAGSystem(id: string): Promise<RAGSystemData> {
    const { data } = await apiClient.get(`/ai-assets/rag-systems/${id}/`)
    return data
  },

  // ── Vector Databases ──
  async listVectorDatabases(): Promise<VectorDatabaseData[]> {
    const { data } = await apiClient.get('/ai-assets/vector-databases/')
    return data.results || data
  },
  async getVectorDatabase(id: string): Promise<VectorDatabaseData> {
    const { data } = await apiClient.get(`/ai-assets/vector-databases/${id}/`)
    return data
  },
}

export default assetService

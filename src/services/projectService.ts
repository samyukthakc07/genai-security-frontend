import apiClient from './apiClient'

export interface Project {
  id: string
  organization: string
  name: string
  description: string
  project_type: string
  status: string
  ai_context: Record<string, unknown>
  metadata: Record<string, unknown>
  created_by: string
  created_by_name: string
  scan_count: number
  finding_count: number
  created_at: string
  updated_at: string
}

const projectService = {
  async list(organizationId?: string, status?: string): Promise<Project[]> {
    const params: Record<string, string> = {}
    if (organizationId) params.organization = organizationId
    if (status) params.status = status
    const { data } = await apiClient.get('/projects/', { params })
    return data.results || data
  },

  async get(id: string): Promise<Project> {
    const { data } = await apiClient.get(`/projects/${id}/`)
    return data
  },

  async create(projectData: Partial<Project>): Promise<Project> {
    const { data } = await apiClient.post('/projects/', projectData)
    return data
  },

  async update(id: string, projectData: Partial<Project>): Promise<Project> {
    const { data } = await apiClient.put(`/projects/${id}/`, projectData)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}/`)
  },
}

export default projectService

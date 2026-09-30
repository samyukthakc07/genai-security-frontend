import apiClient from './apiClient'

export interface AIScan {
  id: string
  name: string
  scan_type: string
  scan_type_display?: string
  status: string
  status_display?: string
  target_type: string
  target_type_display?: string
  progress: number
  started_at: string | null
  completed_at: string | null
  created_by: string
  created_at: string
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>
  organization: string
  project: string
}

 
const scanService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async list(params?: Record<string, any>): Promise<AIScan[]> {
    const { data } = await apiClient.get('/scans/', { params })
    return data.results || data
  },

  async get(id: string): Promise<AIScan> {
    const { data } = await apiClient.get(`/scans/${id}/`)
    return data
  },

  async create(scanData: Partial<AIScan>): Promise<AIScan> {
    const { data } = await apiClient.post('/scans/', scanData)
    return data
  },

  async start(id: string): Promise<AIScan> {
    const { data } = await apiClient.post(`/scans/${id}/start/`)
    return data
  },

  async cancel(id: string): Promise<AIScan> {
    const { data } = await apiClient.post(`/scans/${id}/cancel/`)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/scans/${id}/`)
  },
}

export default scanService

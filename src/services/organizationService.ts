import apiClient from './apiClient'

export interface Organization {
  id: string
  name: string
  slug: string
  description: string
  logo_url: string
  industry: string
  website: string
  is_active: boolean
  subscription_tier: string
  settings: Record<string, unknown>
  member_count: number
  role: string
  created_at: string
  updated_at: string
}

export interface Membership {
  id: string
  organization: string
  user: {
    id: string
    email: string
    username: string
    first_name: string
    last_name: string
    avatar_url: string
  }
  role: string
  joined_at: string
}

const organizationService = {
  async list(): Promise<Organization[]> {
    const { data } = await apiClient.get('/organizations/')
    return data.results || data
  },

  async get(id: string): Promise<Organization> {
    const { data } = await apiClient.get(`/organizations/${id}/`)
    return data
  },

  async create(orgData: Partial<Organization>): Promise<Organization> {
    const { data } = await apiClient.post('/organizations/', orgData)
    return data
  },

  async update(id: string, orgData: Partial<Organization>): Promise<Organization> {
    const { data } = await apiClient.put(`/organizations/${id}/`, orgData)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/organizations/${id}/`)
  },

  async getMembers(id: string): Promise<Membership[]> {
    const { data } = await apiClient.get(`/organizations/${id}/members/`)
    return data
  },

  async inviteMember(orgId: string, email: string, role: string): Promise<void> {
    await apiClient.post(`/organizations/${orgId}/members/invite/`, { email, role })
  },

  async removeMember(orgId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/organizations/${orgId}/members/${memberId}/remove/`)
  },

  async updateMemberRole(orgId: string, memberId: string, role: string): Promise<void> {
    await apiClient.patch(`/organizations/${orgId}/members/${memberId}/role/`, { role })
  },
}

export default organizationService

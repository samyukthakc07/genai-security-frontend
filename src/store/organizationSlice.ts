import { create } from 'zustand'
import organizationService from '@/services/organizationService'
import type { Organization, Membership } from '@/services/organizationService'

interface OrganizationState {
  organizations: Organization[]
  currentOrganization: Organization | null
  members: Membership[]
  isLoading: boolean
  error: string | null

  fetchOrganizations: () => Promise<void>
  setCurrentOrganization: (org: Organization | null) => void
  fetchOrganization: (id: string) => Promise<void>
  createOrganization: (data: Partial<Organization>) => Promise<Organization>
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<void>
  deleteOrganization: (id: string) => Promise<void>
  fetchMembers: (id: string) => Promise<void>
  inviteMember: (orgId: string, email: string, role: string) => Promise<void>
  removeMember: (orgId: string, memberId: string) => Promise<void>
}

export const useOrganizationStore = create<OrganizationState>((set, get) => ({
  organizations: [],
  currentOrganization: null,
  members: [],
  isLoading: false,
  error: null,

  fetchOrganizations: async () => {
    set({ isLoading: true, error: null })
    try {
      const organizations = await organizationService.list()
      set({ organizations, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch organizations', isLoading: false })
    }
  },

  setCurrentOrganization: (org) => set({ currentOrganization: org }),

  fetchOrganization: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const org = await organizationService.get(id)
      set({ currentOrganization: org, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch organization', isLoading: false })
    }
  },

  createOrganization: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const org = await organizationService.create(data)
      set((state) => ({
        organizations: [...state.organizations, org],
        isLoading: false,
      }))
      return org
    } catch {
      set({ error: 'Failed to create organization', isLoading: false })
      throw new Error('Failed to create organization')
    }
  },

  updateOrganization: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const org = await organizationService.update(id, data)
      set((state) => ({
        organizations: state.organizations.map((o) => (o.id === id ? org : o)),
        currentOrganization: state.currentOrganization?.id === id ? org : state.currentOrganization,
        isLoading: false,
      }))
    } catch {
      set({ error: 'Failed to update organization', isLoading: false })
    }
  },

  deleteOrganization: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await organizationService.delete(id)
      set((state) => ({
        organizations: state.organizations.filter((o) => o.id !== id),
        currentOrganization: state.currentOrganization?.id === id ? null : state.currentOrganization,
        isLoading: false,
      }))
    } catch {
      set({ error: 'Failed to delete organization', isLoading: false })
    }
  },

  fetchMembers: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const members = await organizationService.getMembers(id)
      set({ members, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch members', isLoading: false })
    }
  },

  inviteMember: async (orgId, email, role) => {
    set({ isLoading: true, error: null })
    try {
      await organizationService.inviteMember(orgId, email, role)
      await get().fetchMembers(orgId)
    } catch {
      set({ error: 'Failed to invite member', isLoading: false })
    }
  },

  removeMember: async (orgId, memberId) => {
    set({ isLoading: true, error: null })
    try {
      await organizationService.removeMember(orgId, memberId)
      await get().fetchMembers(orgId)
    } catch {
      set({ error: 'Failed to remove member', isLoading: false })
    }
  },
}))

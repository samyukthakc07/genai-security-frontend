import { create } from 'zustand'
import projectService from '@/services/projectService'
import type { Project } from '@/services/projectService'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null

  fetchProjects: (organizationId?: string) => Promise<void>
  fetchProject: (id: string) => Promise<void>
  createProject: (data: Partial<Project>) => Promise<void>
  updateProject: (id: string, data: Partial<Project>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (organizationId) => {
    set({ isLoading: true, error: null })
    try {
      const projects = await projectService.list(organizationId)
      set({ projects, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch projects', isLoading: false })
    }
  },

  fetchProject: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const project = await projectService.get(id)
      set({ currentProject: project, isLoading: false })
    } catch {
      set({ error: 'Failed to fetch project', isLoading: false })
    }
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const project = await projectService.create(data)
      set((state) => ({
        projects: [...state.projects, project],
        isLoading: false,
      }))
    } catch {
      set({ error: 'Failed to create project', isLoading: false })
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null })
    try {
      const project = await projectService.update(id, data)
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? project : p)),
        currentProject: state.currentProject?.id === id ? project : state.currentProject,
        isLoading: false,
      }))
    } catch {
      set({ error: 'Failed to update project', isLoading: false })
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await projectService.delete(id)
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        currentProject: state.currentProject?.id === id ? null : state.currentProject,
        isLoading: false,
      }))
    } catch {
      set({ error: 'Failed to delete project', isLoading: false })
    }
  },
}))

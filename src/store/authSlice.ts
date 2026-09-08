import { create } from 'zustand'
import authService from '@/services/authService'
import type { User, LoginCredentials, RegisterData } from '@/services/authService'

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  error: string | null

  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  fetchProfile: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: authService.isAuthenticated(),
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.login(credentials)
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } }
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Login failed',
      })
      throw err
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await authService.register(data)
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: unknown) {
      const error = err as { response?: { data?: Record<string, string[]> } }
      const messages = Object.values(error.response?.data || {}).flat().join(', ')
      set({
        isLoading: false,
        error: messages || 'Registration failed',
      })
      throw err
    }
  },

  logout: () => {
    authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  fetchProfile: async () => {
    if (!authService.isAuthenticated()) return
    set({ isLoading: true })
    try {
      const user = await authService.getProfile()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))

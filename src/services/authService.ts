import apiClient from './apiClient'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  password_confirm: string
  first_name?: string
  last_name?: string
}

export interface User {
  id: string
  email: string
  username: string
  first_name: string
  last_name: string
  avatar_url: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/login/', credentials)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async register(registerData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post('/auth/register/', registerData)
    localStorage.setItem('access_token', data.access)
    localStorage.setItem('refresh_token', data.refresh)
    return data
  },

  async getProfile(): Promise<User> {
    const { data } = await apiClient.get('/auth/me/')
    return data
  },

  async updateProfile(profileData: Partial<User>): Promise<User> {
    const { data } = await apiClient.put('/auth/me/', profileData)
    return data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/me/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirm: newPassword,
    })
  },

  logout(): void {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      apiClient.post('/auth/logout/', { refresh: refreshToken }).catch(() => {})
    }
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    window.location.href = '/login'
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },
}

export default authService

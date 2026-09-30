import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import { getMockDataForUrl } from '@/data/demoMockData'

const DEFAULT_TIMEOUT_MS = 15000 // 15s default for all normal requests

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // No default timeout here — we apply it per-request in the interceptor
  // so callers can override it with { timeout: N } without being clobbered.
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach JWT token and apply default timeout
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // @ts-expect-error ignoring this for now ignore this for now
    config.metadata = { startTime: new Date() }
    const token = localStorage.getItem('access_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Apply a 15s default only when the caller did NOT supply a specific timeout
    if (!config.timeout) {
      config.timeout = DEFAULT_TIMEOUT_MS
    }
    return config
  },
  (error) => Promise.reject(error)
)


// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    // @ts-expect-error ignoring this for now ignore this for now
    const duration = new Date() - response.config.metadata.startTime
    console.log(`[API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`)
    
    // DEMO OVERRIDE: If the API returns an empty array, inject our rich demo mock data globally
    const data = response.data?.results || response.data
    if (Array.isArray(data) && data.length === 0 && response.config.url) {
      const mock = getMockDataForUrl(response.config.url)
      if (mock && mock.length > 0) {
        if (response.data?.results) {
          response.data.results = mock
        } else {
          response.data = mock
        }
      }
    }
    
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })
        const { access } = response.data
        localStorage.setItem('access_token', access)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }
        return apiClient(originalRequest)
      } catch {
        // Refresh failed, redirect to login
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

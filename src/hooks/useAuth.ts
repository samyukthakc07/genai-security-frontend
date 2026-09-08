import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authSlice'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    if (store.isAuthenticated && !store.user) {
      store.fetchProfile()
    }
  }, [store.isAuthenticated, store.user])

  return store
}

export function useRequireAuth() {
  const navigate = useNavigate()
  const { isAuthenticated, isLoading, fetchProfile, user } = useAuthStore()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true })
    } else if (isAuthenticated && !user) {
      fetchProfile()
    }
  }, [isAuthenticated, isLoading, navigate, fetchProfile, user])

  return { isAuthenticated, isLoading, user }
}

export function useRedirectIfAuth() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])
}

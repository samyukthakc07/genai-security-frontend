import { useState, useEffect, useCallback } from 'react'
import dashboardService from '@/services/dashboardService'
import type { ModuleStatsResponse } from '@/services/dashboardService'

interface UseModuleStatsResult {
  stats: ModuleStatsResponse | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useModuleStats(): UseModuleStatsResult {
  const [stats, setStats] = useState<ModuleStatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await dashboardService.getModuleStats()
      setStats(data)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load module statistics'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { stats, loading, error, refetch: fetch }
}

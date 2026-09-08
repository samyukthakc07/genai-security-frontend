import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Loader2, ArrowUpRight, AlertCircle, Clock, Shield, Eye, Boxes, Skull, FileX, Bot, Key, Database, Brain, Gauge, X } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { formatRelativeTime } from '@/utils/formatters'
import dashboardService from '@/services/dashboardService'
import type { GlobalSearchResult } from '@/services/dashboardService'

// Module icon + color mapping for search results — uses Tailwind classes so dark mode CSS vars apply automatically
const MODULE_VISUALS: Record<string, { icon: React.ReactNode; bgClass: string; textClass: string; border: string }> = {
  llm01: { icon: <Shield className="h-4 w-4" />, bgClass: 'bg-red-50', textClass: 'text-red-600', border: 'border-red-200' },
  llm02: { icon: <Eye className="h-4 w-4" />, bgClass: 'bg-orange-50', textClass: 'text-orange-600', border: 'border-orange-200' },
  llm03: { icon: <Boxes className="h-4 w-4" />, bgClass: 'bg-amber-50', textClass: 'text-amber-600', border: 'border-amber-200' },
  llm04: { icon: <Skull className="h-4 w-4" />, bgClass: 'bg-purple-50', textClass: 'text-purple-600', border: 'border-purple-200' },
  llm05: { icon: <FileX className="h-4 w-4" />, bgClass: 'bg-rose-50', textClass: 'text-rose-600', border: 'border-rose-200' },
  llm06: { icon: <Bot className="h-4 w-4" />, bgClass: 'bg-cyan-50', textClass: 'text-cyan-600', border: 'border-cyan-200' },
  llm07: { icon: <Key className="h-4 w-4" />, bgClass: 'bg-pink-50', textClass: 'text-pink-600', border: 'border-pink-200' },
  llm08: { icon: <Database className="h-4 w-4" />, bgClass: 'bg-teal-50', textClass: 'text-teal-600', border: 'border-teal-200' },
  llm09: { icon: <Brain className="h-4 w-4" />, bgClass: 'bg-yellow-50', textClass: 'text-yellow-600', border: 'border-yellow-200' },
  llm10: { icon: <Gauge className="h-4 w-4" />, bgClass: 'bg-lime-50', textClass: 'text-lime-600', border: 'border-lime-200' },
}

export function GlobalSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<GlobalSearchResult['results']>([])
  const [totalResults, setTotalResults] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const performSearch = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([])
      setTotalResults(0)
      setSearched(false)
      return
    }

    setLoading(true)
    setSearched(true)
    try {
      const data = await dashboardService.globalSearch(q)
      setResults(data.results)
      setTotalResults(data.total_results)
    } catch {
      setResults([])
      setTotalResults(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // Run search on mount if query param exists
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
    // Focus the input
    inputRef.current?.focus()
  }, [])

  const handleSearch = (q: string) => {
    setQuery(q)
    setSearchParams(q ? { q } : {}, { replace: true })
    performSearch(q)
  }

  // Group results by module
  const groupedResults = results.reduce<Record<string, typeof results>>((acc, r) => {
    if (!acc[r.module_id]) acc[r.module_id] = []
    acc[r.module_id].push(r)
    return acc
  }, {})

  // Module display order
  const moduleOrder = ['llm01','llm02','llm03','llm04','llm05','llm06','llm07','llm08','llm09','llm10']

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <Search className="h-4 w-4 text-indigo-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Global Search</h1>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search across all OWASP modules... (e.g. api_key, critical, jailbreak)"
          className="w-full pl-12 pr-10 py-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder:text-gray-400 transition-all shadow-sm"
          autoFocus
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setTotalResults(0); setSearched(false); setSearchParams({}, { replace: true }); inputRef.current?.focus() }
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          <span className="ml-3 text-sm text-gray-500">Searching across all modules...</span>
        </div>
      )}

      {/* Results */}
      {!loading && searched && query.length >= 2 && (
        <>
          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {totalResults > 0 ? (
                <>Found <span className="font-semibold text-gray-900">{totalResults}</span> result{totalResults !== 1 ? 's' : ''} for "<span className="font-medium text-gray-700">{query}</span>"</>
              ) : (
                <>No results found for "<span className="font-medium text-gray-700">{query}</span>"</>
              )}
            </p>
          </div>

          {/* Grouped results */}
          {totalResults === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No matching records found</h3>
              <p className="text-sm text-gray-500">Try different keywords like "critical", "api_key", "jailbreak", or "GPT-4"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moduleOrder.map((modId) => {
                const modResults = groupedResults[modId]
                if (!modResults) return null
                const visual = MODULE_VISUALS[modId]
                const modInfo = modResults[0]
                return (
                  <Card key={modId} className="overflow-hidden">
                    <CardHeader className={cn('border-b bg-gray-50/50', visual?.border || 'border-gray-200')}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn('h-7 w-7 rounded-lg flex items-center justify-center', visual?.bgClass || 'bg-gray-100')}
                        >
                          <span className={visual?.textClass || 'text-gray-500'}>{visual?.icon}</span>
                        </div>
                        <div>
                          <CardTitle className="text-sm">{modInfo.module_number} — {modInfo.module_name}</CardTitle>
                        </div>
                        <Badge variant="default" size="sm" className="ml-auto">{modResults.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 divide-y divide-gray-50">
                      {modResults.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => navigate(r.detail_url)}
                          className="flex items-center justify-between p-3.5 hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <div className="flex-1 min-w-0 mr-3">
                            <p className="text-sm font-medium text-gray-900 truncate">{r.label}</p>
                            {r.detail && <p className="text-xs text-gray-500 mt-0.5">{r.detail}</p>}
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            {r.created_at && (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatRelativeTime(r.created_at)}
                              </span>
                            )}
                            <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Initial state - no search performed yet */}
      {!loading && !searched && !query && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="h-12 w-12 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Search across all OWASP modules</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Type a keyword to search across all 10 security modules simultaneously.
            Try searching for things like <strong className="text-gray-700">api_key</strong>,{' '}
            <strong className="text-gray-700">critical</strong>,{' '}
            <strong className="text-gray-700">jailbreak</strong>,{' '}
            <strong className="text-gray-700">GPT-4</strong>, or{' '}
            <strong className="text-gray-700">blocked</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['api_key','critical','jailbreak','GPT-4','blocked','injection','poisoning','token','permission','hallucination'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleSearch(suggestion)}
                className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Too short query hint */}
      {!loading && searched && query.length === 1 && (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-400">
          <AlertCircle className="h-4 w-4" />
          <span>Type at least 2 characters to search</span>
        </div>
      )}
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { useState, useMemo } from 'react'
import {
  Shield, Eye, Boxes, Skull, FileX, Bot, Key, Database, Brain, Gauge,
  ShieldCheck, ChevronRight, Zap, ArrowUpRight, AlertCircle, CheckCircle2, Award,
  Search, Filter, X, RefreshCw,
} from 'lucide-react'
import { Card, CardContent, Badge } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { OWASP_MODULES } from '@/utils/constants'
import { useModuleStats } from '@/hooks/useModuleStats'

// ============================================================
// Module icon + color theme mapping
// ============================================================

const MODULE_THEMES: Record<string, {
  icon: React.ReactNode
  bg: string
  text: string
  lightBg: string
  border: string
  gradient: string
}> = {
  llm01: {
    icon: <Shield className="h-6 w-6" />,
    bg: 'bg-red-600', text: 'text-red-600', lightBg: 'bg-red-50',
    border: 'border-red-200', gradient: 'from-red-500 to-rose-600',
  },
  llm02: {
    icon: <Eye className="h-6 w-6" />,
    bg: 'bg-orange-600', text: 'text-orange-600', lightBg: 'bg-orange-50',
    border: 'border-orange-200', gradient: 'from-orange-500 to-amber-600',
  },
  llm03: {
    icon: <Boxes className="h-6 w-6" />,
    bg: 'bg-amber-600', text: 'text-amber-600', lightBg: 'bg-amber-50',
    border: 'border-amber-200', gradient: 'from-amber-500 to-yellow-600',
  },
  llm04: {
    icon: <Skull className="h-6 w-6" />,
    bg: 'bg-purple-600', text: 'text-purple-600', lightBg: 'bg-purple-50',
    border: 'border-purple-200', gradient: 'from-purple-500 to-violet-600',
  },
  llm05: {
    icon: <FileX className="h-6 w-6" />,
    bg: 'bg-rose-600', text: 'text-rose-600', lightBg: 'bg-rose-50',
    border: 'border-rose-200', gradient: 'from-rose-500 to-pink-600',
  },
  llm06: {
    icon: <Bot className="h-6 w-6" />,
    bg: 'bg-cyan-600', text: 'text-cyan-600', lightBg: 'bg-cyan-50',
    border: 'border-cyan-200', gradient: 'from-cyan-500 to-teal-600',
  },
  llm07: {
    icon: <Key className="h-6 w-6" />,
    bg: 'bg-pink-600', text: 'text-pink-600', lightBg: 'bg-pink-50',
    border: 'border-pink-200', gradient: 'from-pink-500 to-rose-600',
  },
  llm08: {
    icon: <Database className="h-6 w-6" />,
    bg: 'bg-teal-600', text: 'text-teal-600', lightBg: 'bg-teal-50',
    border: 'border-teal-200', gradient: 'from-teal-500 to-emerald-600',
  },
  llm09: {
    icon: <Brain className="h-6 w-6" />,
    bg: 'bg-yellow-600', text: 'text-yellow-600', lightBg: 'bg-yellow-50',
    border: 'border-yellow-200', gradient: 'from-yellow-500 to-amber-600',
  },
  llm10: {
    icon: <Gauge className="h-6 w-6" />,
    bg: 'bg-lime-600', text: 'text-lime-600', lightBg: 'bg-lime-50',
    border: 'border-lime-200', gradient: 'from-lime-500 to-green-600',
  },
}

// Risk level labels for display
const RISK_LABELS = {
  llm01: { label: 'High Risk', variant: 'danger' as const },
  llm02: { label: 'High Risk', variant: 'danger' as const },
  llm03: { label: 'Medium', variant: 'warning' as const },
  llm04: { label: 'Medium', variant: 'warning' as const },
  llm05: { label: 'High Risk', variant: 'danger' as const },
  llm06: { label: 'High Risk', variant: 'danger' as const },
  llm07: { label: 'Medium', variant: 'warning' as const },
  llm08: { label: 'Medium', variant: 'warning' as const },
  llm09: { label: 'Medium', variant: 'warning' as const },
  llm10: { label: 'Low Risk', variant: 'success' as const },
}

export function ModulesOverviewPage() {
  const navigate = useNavigate()
  const { stats, loading: statsLoading, error: statsError, refetch } = useModuleStats()

  // --- Filter state ---
  const [searchQuery, setSearchQuery] = useState('')
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('all')
  const [activeFeatureFilter, setActiveFeatureFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Derive risk map for each module
  const moduleRiskMap = useMemo(() => {
    const map: Record<string, { label: string; variant: 'danger' | 'warning' | 'success' }> = {}
    for (const [id, r] of Object.entries(RISK_LABELS)) {
      map[id] = r
    }
    return map
  }, [])

  // Derive all unique features across modules for the feature filter
  const allFeatures = useMemo(() => {
    const set = new Set<string>()
    OWASP_MODULES.forEach((m) => m.features.forEach((f) => set.add(f)))
    return Array.from(set).sort()
  }, [])

  // Filtered modules
  const filteredModules = useMemo(() => {
    return OWASP_MODULES.filter((mod) => {
      // — Search by name or description —
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = mod.name.toLowerCase().includes(q)
        const matchesDesc = mod.description.toLowerCase().includes(q)
        const matchesFeature = mod.features.some((f) => f.toLowerCase().includes(q))
        if (!matchesName && !matchesDesc && !matchesFeature) return false
      }

      // — Risk level filter —
      if (activeRiskFilter !== 'all') {
        const risk = moduleRiskMap[mod.id]
        if (!risk || risk.label.toLowerCase() !== activeRiskFilter) return false
      }

      // — Feature tag filter —
      if (activeFeatureFilter !== 'all') {
        if (!(mod.features as readonly string[]).includes(activeFeatureFilter)) return false
      }

      return true
    })
  }, [searchQuery, activeRiskFilter, activeFeatureFilter, moduleRiskMap])

  const hasActiveFilters = searchQuery || activeRiskFilter !== 'all' || activeFeatureFilter !== 'all'

  const clearAllFilters = () => {
    setSearchQuery('')
    setActiveRiskFilter('all')
    setActiveFeatureFilter('all')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OWASP LLM Security Modules</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1 ml-10">
            Comprehensive security coverage across all 10 OWASP Top 10 for LLM Applications categories
          </p>
        </div>
      </div>

      {/* Live Stats bar */}
      {statsLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gray-200" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-5 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : statsError ? (
        <div className="bg-white rounded-xl border border-red-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Could not load live stats — showing default values. {statsError}</span>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      ) : null}

      {/* Stats bar — live or fallback */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <OverviewStat
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Total Records"
          value={stats ? String(stats.total_records) : '10'}
          color="indigo"
          subtitle={stats ? `${stats.modules_with_data}/${stats.total_modules} modules with data` : undefined}
        />
        <OverviewStat
          icon={<AlertCircle className="h-4 w-4" />}
          label="High Risk"
          value={stats ? String(stats.high_risk_with_data) : '5'}
          color="red"
        />
        <OverviewStat
          icon={<Zap className="h-4 w-4" />}
          label="Scan Actions"
          value={stats ? String(stats.scan_actions_count) : '7'}
          color="orange"
        />
        <OverviewStat
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Active Monitors"
          value={stats ? String(stats.active_monitors) : '3'}
          color="green"
        />
        <OverviewStat
          icon={<Award className="h-4 w-4" />}
          label="OWASP Coverage"
          value={stats ? `${stats.owasp_coverage}%` : '100%'}
          color="purple"
        />
      </div>

      {/* ===== Search & Filter Bar ===== */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Top row: search + toggle filter button */}
        <div className="flex items-center gap-3 p-4">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search modules by name, description, or feature..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                'w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-gray-300',
                'focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500',
                'placeholder:text-gray-400 transition-all'
              )}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Toggle filter panel */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all',
              showFilters || activeRiskFilter !== 'all' || activeFeatureFilter !== 'all'
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            )}
          >
            <Filter className="h-4 w-4" />
            Filters
            {(activeRiskFilter !== 'all' || activeFeatureFilter !== 'all') && (
              <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1 text-[11px] font-bold rounded-full bg-indigo-200 text-indigo-800">
                {[activeRiskFilter !== 'all' ? 1 : 0, activeFeatureFilter !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Expandable filter panel */}
        {showFilters && (
          <div className="border-t border-gray-100 px-4 py-3 space-y-3">
            {/* Risk level filter */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Risk Level</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All', color: 'gray' },
                  { value: 'high risk', label: 'High Risk', color: 'red' },
                  { value: 'medium', label: 'Medium', color: 'amber' },
                  { value: 'low risk', label: 'Low Risk', color: 'green' },
                ].map((opt) => {
                  const isActive = activeRiskFilter === opt.value
                  const colorMap: Record<string, string> = {
                    gray: isActive ? 'bg-gray-100 text-gray-800 border-gray-400' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50',
                    red: isActive ? 'bg-red-50 text-red-700 border-red-400 ring-1 ring-red-200' : 'bg-white text-red-600 border-red-200 hover:bg-red-50',
                    amber: isActive ? 'bg-amber-50 text-amber-700 border-amber-400 ring-1 ring-amber-200' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50',
                    green: isActive ? 'bg-green-50 text-green-700 border-green-400 ring-1 ring-green-200' : 'bg-white text-green-600 border-green-200 hover:bg-green-50',
                  }
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setActiveRiskFilter(isActive && opt.value !== 'all' ? 'all' : opt.value)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-full border transition-all',
                        colorMap[opt.color]
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Feature tag filter */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Feature Tag
              </p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setActiveFeatureFilter('all')}
                  className={cn(
                    'px-2.5 py-1 text-xs font-medium rounded-full border transition-all',
                    activeFeatureFilter === 'all'
                      ? 'bg-gray-100 text-gray-800 border-gray-400'
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  )}
                >
                  All
                </button>
                {allFeatures.map((feature) => {
                  const isActive = activeFeatureFilter === feature
                  return (
                    <button
                      key={feature}
                      onClick={() => setActiveFeatureFilter(isActive ? 'all' : feature)}
                      className={cn(
                        'px-2.5 py-1 text-xs font-medium rounded-full border transition-all',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-gray-700'
                      )}
                    >
                      {feature}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count + clear */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold text-gray-900">{filteredModules.length}</span>
          {' '}of{' '}
          <span className="font-semibold text-gray-900">{OWASP_MODULES.length}</span> modules
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all filters
          </button>
        )}
      </div>

      {/* Empty state when no modules match */}
      {filteredModules.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No modules match your filters</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your search query or selecting different filters.</p>
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white dark:text-[#ffffff] bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear all filters
          </button>
        </div>
      ) : (
        /* Module cards grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const theme = MODULE_THEMES[mod.id]
            const risk = RISK_LABELS[mod.id as keyof typeof RISK_LABELS]

            return (
              <Card
                key={mod.id}
                hover
                onClick={() => navigate(mod.path)}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {/* Top accent bar */}
                <div className={cn('h-1 w-full bg-gradient-to-r', theme.gradient)} />

                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center shrink-0',
                      theme.lightBg, theme.text
                    )}>
                      {theme.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="default" size="sm" className="font-mono font-bold">
                          {mod.number}
                        </Badge>
                        {risk && (
                          <Badge variant={risk.variant} size="sm">
                            {risk.label}
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 truncate">
                        {mod.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ArrowUpRight className={cn(
                      'h-4 w-4 text-gray-300 transition-all duration-300',
                      'group-hover:text-gray-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    )} />
                  </div>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {mod.features.map((feature) => {
                      const isHighlighted = activeFeatureFilter === feature
                      return (
                        <span
                          key={feature}
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium transition-all',
                            isHighlighted
                              ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300'
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          {feature}
                        </span>
                      )
                    })}
                  </div>

                  {/* Bottom indicator */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-[11px] text-indigo-600 font-medium">
                      Open module
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ============================================================
// Sub-component: Overview Stat
// ============================================================

function OverviewStat({
  icon,
  label,
  value,
  color,
  subtitle,
}: {
  icon: React.ReactNode
  label: string
  value: string
  color: string
  subtitle?: string
}) {
  const colorMap: Record<string, { classes: string; textClasses: string }> = {
    indigo: { classes: 'bg-indigo-50', textClasses: 'text-indigo-600' },
    red: { classes: 'bg-red-50', textClasses: 'text-red-600' },
    orange: { classes: 'bg-orange-50', textClasses: 'text-orange-600' },
    green: { classes: 'bg-green-50', textClasses: 'text-green-600' },
    purple: { classes: 'bg-purple-50', textClasses: 'text-purple-600' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
      <div
        className={cn('h-9 w-9 rounded-lg flex items-center justify-center shrink-0', c.classes)}
      >
        <span className={c.textClasses}>{icon}</span>
      </div>
      <div>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
        {subtitle && (
          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

import { Shield, ShieldAlert, ShieldCheck, AlertCircle, CheckCircle2, XCircle, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, SeverityBadge } from '@/components/ui'
import { cn } from '@/utils/helpers'
import { formatDateTime, formatRelativeTime, formatNumber, capitalize } from '@/utils/formatters'
import { SEVERITY_COLORS } from '@/types/models'
import { useState } from 'react'

// ============================================================
// Risk Score Card
// ============================================================

interface RiskScoreCardProps {
  score: number
  label: string
  maxScore?: number
  className?: string
}

export function RiskScoreCard({ score, label, maxScore = 100, className }: RiskScoreCardProps) {
  const percentage = Math.min((score / maxScore) * 100, 100)
  const getColor = () => {
    if (percentage >= 80) return { bg: '#fef2f2', bar: '#ef4444', text: '#dc2626' }
    if (percentage >= 60) return { bg: '#fff7ed', bar: '#f97316', text: '#ea580c' }
    if (percentage >= 40) return { bg: '#fefce8', bar: '#eab308', text: '#ca8a04' }
    return { bg: '#f0fdf4', bar: '#22c55e', text: '#16a34a' }
  }
  const colors = getColor()

  return (
    <div className={cn('bg-white rounded-xl border border-gray-200 p-5', className)}>
      <p className="text-sm text-gray-500 mb-2">{label}</p>
      <div className="flex items-end gap-3">
        <span className="text-3xl font-bold" style={{ color: colors.text }}>{score.toFixed(0)}</span>
        <span className="text-sm text-gray-400 mb-1">/ {maxScore}</span>
      </div>
      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%`, backgroundColor: colors.bar }}
        />
      </div>
    </div>
  )
}

// ============================================================
// Finding Card
// ============================================================

interface FindingCardProps {
  title: string
  severity: string
  type: string
  description?: string
  timestamp: string
  onClick?: () => void
}

export function FindingCard({ title, severity, type, description, timestamp, onClick }: FindingCardProps) {
  const colors = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || SEVERITY_COLORS.info

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white cursor-pointer',
        'hover:border-gray-200 hover:shadow-sm transition-all'
      )}
    >
      <div
        className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
        style={{ backgroundColor: colors.bg }}
      >
        <AlertCircle className="h-4 w-4" style={{ color: colors.text }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <SeverityBadge severity={severity} />
          <span className="text-xs font-medium text-gray-500">{capitalize(type)}</span>
        </div>
        <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
        {description && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1.5">{formatRelativeTime(timestamp)}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-gray-300 shrink-0 mt-1" />
    </div>
  )
}

// ============================================================
// Results Summary Bar
// ============================================================

interface ResultsSummaryProps {
  totalItems: number
  riskItems: number
  safeItems: number
  criticalItems?: number
  highItems?: number
  className?: string
}

export function ResultsSummary({
  totalItems,
  riskItems,
  safeItems,
  criticalItems = 0,
  highItems = 0,
  className,
}: ResultsSummaryProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <SummaryBadge icon={<Shield className="h-3.5 w-3.5" />} label="Total" value={totalItems} color="gray" />
      <SummaryBadge icon={<XCircle className="h-3.5 w-3.5" />} label="At Risk" value={riskItems} color="red" />
      <SummaryBadge icon={<CheckCircle2 className="h-3.5 w-3.5" />} label="Safe" value={safeItems} color="green" />
      {criticalItems > 0 && (
        <SummaryBadge icon={<AlertCircle className="h-3.5 w-3.5" />} label="Critical" value={criticalItems} color="red" />
      )}
      {highItems > 0 && (
        <SummaryBadge icon={<AlertCircle className="h-3.5 w-3.5" />} label="High" value={highItems} color="orange" />
      )}
    </div>
  )
}

function SummaryBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: 'gray' | 'red' | 'green' | 'orange'
}) {
  const colors = {
    gray: { bg: '#f9fafb', text: '#374151', dot: '#9ca3af' },
    red: { bg: '#fef2f2', text: '#dc2626', dot: '#ef4444' },
    green: { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
    orange: { bg: '#fff7ed', text: '#ea580c', dot: '#f97316' },
  }
  const c = colors[color]

  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {icon}
      <span>{value}</span>
      <span className="opacity-60">{label}</span>
    </div>
  )
}

// ============================================================
// Results Table
// ============================================================

interface Column {
  key: string
  label: string
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode
  sortable?: boolean
}

interface ResultsTableProps {
  columns: Column[]
  data: Record<string, unknown>[]
  onRowClick?: (row: Record<string, unknown>) => void
  emptyMessage?: string
  className?: string
}

export function ResultsTable({ columns, data, onRowClick, emptyMessage = 'No results found', className }: ResultsTableProps) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    }
    const aStr = String(aVal || '')
    const bStr = String(bVal || '')
    return sortDir === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
  })

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">{emptyMessage}</div>
    )
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={cn(
                  'px-3 py-2.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  col.sortable && 'cursor-pointer hover:text-gray-700'
                )}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sortedData.map((row, idx) => (
            <tr
              key={row.id as string || idx}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'hover:bg-gray-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-2.5 text-gray-700">
                  {col.render ? col.render(row[col.key], row) : String(row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================
// Module Stat Card
// ============================================================

interface ModuleStatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  trend?: { value: number; isUp: boolean }
  color?: string
}

export function ModuleStatCard({ icon, label, value, trend, color = 'indigo' }: ModuleStatCardProps) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    indigo: { bg: '#eef2ff', text: '#4f46e5' },
    red: { bg: '#fef2f2', text: '#dc2626' },
    green: { bg: '#f0fdf4', text: '#16a34a' },
    orange: { bg: '#fff7ed', text: '#ea580c' },
    blue: { bg: '#eff6ff', text: '#2563eb' },
    purple: { bg: '#faf5ff', text: '#9333ea' },
    cyan: { bg: '#ecfeff', text: '#0891b2' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.bg }}>
          <span style={{ color: c.text }}>{icon}</span>
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${trend.isUp ? 'text-red-500' : 'text-green-500'}`}>
            <ArrowUpRight className={`h-3 w-3 ${!trend.isUp && 'rotate-90'}`} />
            {trend.value}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      </div>
    </Card>
  )
}

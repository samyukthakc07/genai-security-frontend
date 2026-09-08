import { cn } from '@/utils/helpers'

interface RiskScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

function getRiskColor(score: number): string {
  if (score >= 80) return 'text-red-600 bg-red-50 border-red-200'
  if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200'
  if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
  if (score >= 20) return 'text-green-600 bg-green-50 border-green-200'
  return 'text-blue-600 bg-blue-50 border-blue-200'
}

function getRiskLabel(score: number): string {
  if (score >= 80) return 'Critical'
  if (score >= 60) return 'High'
  if (score >= 40) return 'Medium'
  if (score >= 20) return 'Low'
  return 'Info'
}

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
}

export function RiskScoreBadge({ score, size = 'md', showLabel = true, className }: RiskScoreBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full border',
        getRiskColor(score),
        sizes[size],
        className
      )}
    >
      <span className="font-mono">{score}</span>
      {showLabel && <span className="opacity-75">/ 100</span>}
    </span>
  )
}

export function RiskLevelIndicator({ score }: { score: number }) {
  const label = getRiskLabel(score)
  const color = getRiskColor(score)

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm font-medium', color.split(' ')[0])}>
      <span
        className={cn(
          'h-2 w-2 rounded-full',
          score >= 80 && 'bg-red-500',
          score >= 60 && score < 80 && 'bg-orange-500',
          score >= 40 && score < 60 && 'bg-yellow-500',
          score >= 20 && score < 40 && 'bg-green-500',
          score < 20 && 'bg-blue-500'
        )}
      />
      {label}
    </span>
  )
}

import { cn } from '@/utils/helpers'
import { capitalize } from '@/utils/formatters'

interface StatusIndicatorProps {
  status: string
  className?: string
  size?: 'sm' | 'md'
}

const statusColors: Record<string, string> = {
  active: 'bg-green-500',
  completed: 'bg-green-500',
  resolved: 'bg-green-500',
  running: 'bg-blue-500',
  pending: 'bg-gray-400',
  failed: 'bg-red-500',
  cancelled: 'bg-yellow-500',
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500',
  info: 'bg-blue-500',
  open: 'bg-red-500',
  in_progress: 'bg-blue-500',
  archived: 'bg-gray-400',
}

const sizes = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
}

export function StatusIndicator({ status, className, size = 'md' }: StatusIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          'rounded-full',
          sizes[size],
          statusColors[status] || 'bg-gray-400',
          className
        )}
      />
      <span className="text-sm text-gray-600">{capitalize(status)}</span>
    </span>
  )
}

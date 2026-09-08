import { cn } from '@/utils/helpers'
import type { ReactNode } from 'react'

interface BadgeProps {
  children?: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'critical'
  size?: 'sm' | 'md'
  className?: string
  dot?: boolean
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  critical: 'bg-red-100 text-red-800',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  critical: 'bg-red-600',
}

function getVariantFromSeverity(severity: string): BadgeProps['variant'] {
  const map: Record<string, BadgeProps['variant']> = {
    critical: 'critical',
    high: 'danger',
    medium: 'warning',
    low: 'success',
    info: 'info',
    completed: 'success',
    running: 'info',
    pending: 'default',
    failed: 'danger',
    cancelled: 'warning',
    active: 'success',
    archived: 'default',
  }
  return map[severity] || 'default'
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className,
  dot,
}: BadgeProps) {
  const effectiveVariant = variant || getVariantFromSeverity(String(children).toLowerCase())

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        variantStyles[effectiveVariant],
        sizeStyles[size],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[effectiveVariant])} />}
      {children}
    </span>
  )
}

export function SeverityBadge({ severity, ...props }: { severity: string } & Omit<BadgeProps, 'variant' | 'children'>) {
  return (
    <Badge variant={getVariantFromSeverity(severity)} {...props}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  )
}

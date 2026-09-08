import { cn } from '@/utils/helpers'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
  onClick?: () => void
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}

export function Card({ children, className, padding = 'md', hover, onClick }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[var(--color-surface)] border border-gray-200 dark:border-[var(--color-border)] rounded-xl shadow-sm',
        paddingMap[padding],
        hover && 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}

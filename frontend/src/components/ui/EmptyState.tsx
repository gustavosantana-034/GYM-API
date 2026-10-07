import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { DistanceRings } from './DistanceRings'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-12 text-center',
        className,
      )}
    >
      <div className="relative flex size-20 items-center justify-center">
        <div className="absolute inset-0">
          <DistanceRings tone="muted" className="size-full" />
        </div>
        {icon && <span className="relative text-muted">{icon}</span>}
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-h3 font-semibold text-text">{title}</h3>
        {description && <p className="text-label text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface Segment<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  segments: Segment<T>[]
  onChange: (value: T) => void
  className?: string
}

/** Small set of mutually exclusive views (e.g. Lista / Mapa). */
export function SegmentedControl<T extends string>({
  label,
  value,
  segments,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('inline-flex rounded-md border border-border bg-surface-1 p-1', className)}
    >
      {segments.map((segment) => {
        const isSelected = segment.value === value

        return (
          <button
            key={segment.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange(segment.value)}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-label font-semibold transition-colors',
              isSelected ? 'bg-surface-3 text-text' : 'text-muted hover:text-text',
            )}
          >
            {segment.icon}
            {segment.label}
          </button>
        )
      })}
    </div>
  )
}

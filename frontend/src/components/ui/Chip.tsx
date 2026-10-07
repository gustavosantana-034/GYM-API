import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ChipProps extends Omit<ComponentProps<'button'>, 'children'> {
  selected: boolean
  icon?: ReactNode
  children: ReactNode
}

/** Toggleable filter pill. Exposes its state with aria-pressed. */
export function Chip({ selected, icon, children, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-label font-medium transition-colors',
        selected
          ? 'border-primary bg-primary text-on-primary'
          : 'border-border bg-surface-1 text-muted hover:border-border-strong hover:text-text',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

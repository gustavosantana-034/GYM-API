import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'

/** Base surface: 1px border instead of shadows, square-ish corners. */
export function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('rounded-lg border border-border bg-surface-1', className)}
      {...props}
    />
  )
}

import { cn } from '@/utils/cn'

/** Placeholder block with a moving sheen. Hidden from assistive tech. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block animate-shimmer rounded-sm bg-[linear-gradient(90deg,var(--surface-2)_0%,var(--surface-3)_50%,var(--surface-2)_100%)] bg-[length:200%_100%]',
        className,
      )}
    />
  )
}

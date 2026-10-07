import { cn } from '@/utils/cn'

/** Pulso wordmark: a point with a ring (you, and what is around you). */
export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-text', className)}>
      <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none">
        <circle cx="12" cy="12" r="10" stroke="var(--primary-ink)" strokeOpacity=".4" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.5" fill="var(--primary-ink)" />
      </svg>
      <span className="text-h3 font-extrabold tracking-tight font-expanded">pulso</span>
    </span>
  )
}

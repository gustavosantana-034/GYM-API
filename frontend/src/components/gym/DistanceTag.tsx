import { Navigation } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatDistance } from '@/utils/format'

export function DistanceTag({ distanceInKm, className }: { distanceInKm: number; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-label font-semibold text-geo tabular', className)}>
      <Navigation aria-hidden className="size-3.5 rotate-45 fill-current" />
      {formatDistance(distanceInKm)}
      <span className="sr-only">de você</span>
    </span>
  )
}

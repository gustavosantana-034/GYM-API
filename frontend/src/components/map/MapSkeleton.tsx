import { DistanceRings } from '@/components/ui/DistanceRings'
import { cn } from '@/utils/cn'

export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Carregando mapa"
      className={cn('flex size-full items-center justify-center bg-surface-2', className)}
    >
      <DistanceRings pulsing tone="muted" className="w-32" />
    </div>
  )
}

import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import type { GymWithDistance } from '@/hooks/use-gyms-with-distance'
import { cn } from '@/utils/cn'
import { splitDistance } from '@/utils/format'
import { ModalityList } from './ModalityBadge'

interface GymCardProps {
  gym: GymWithDistance
  /** Highlighted when its marker is selected on the map. */
  isActive?: boolean
  onFocusGym?: (gymId: string) => void
}

/**
 * The distance is the first thing the card says, in large type: it answers
 * "how far is it?" before "what is it?".
 */
export function GymCard({ gym, isActive = false, onFocusGym }: GymCardProps) {
  const distance = gym.distanceInKm !== null ? splitDistance(gym.distanceInKm) : null

  return (
    <Link
      to={`/gyms/${gym.id}`}
      onMouseEnter={() => onFocusGym?.(gym.id)}
      onFocus={() => onFocusGym?.(gym.id)}
      className={cn(
        'group relative flex items-stretch gap-4 rounded-lg border bg-surface-1 p-4 transition-colors hover:border-border-strong hover:bg-surface-2',
        isActive ? 'border-primary' : 'border-border',
      )}
    >
      <div className="flex w-16 shrink-0 flex-col items-start justify-center border-r border-border pr-4">
        {distance ? (
          <>
            <span className="text-h2 leading-none font-extrabold text-text tabular font-expanded">
              {distance.value}
            </span>
            <span className="mt-1 text-caption font-semibold text-geo uppercase">{distance.unit}</span>
            <span className="sr-only">de distância</span>
          </>
        ) : (
          <MapPin aria-hidden className="size-6 text-subtle" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-h3 font-bold text-text">{gym.title}</h3>
          <ArrowUpRight
            aria-hidden
            className="size-5 shrink-0 text-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-ink"
          />
        </div>
        {gym.address && <p className="truncate text-label text-muted">{gym.address}</p>}
        <ModalityList modalities={gym.modalities} />
      </div>
    </Link>
  )
}

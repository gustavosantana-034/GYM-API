import { cn } from '@/utils/cn'

interface DistanceRingsProps {
  className?: string
  /** Animates outward pulses, used while locating. */
  pulsing?: boolean
  tone?: 'geo' | 'primary' | 'muted'
}

const toneColor = {
  geo: 'text-geo',
  primary: 'text-primary-ink',
  muted: 'text-border-strong',
}

/**
 * Pulso's visual motif: concentric rings radiating from a point, the shape of
 * "how far is it from me". Purely decorative.
 */
export function DistanceRings({ className, pulsing = false, tone = 'geo' }: DistanceRingsProps) {
  return (
    <div aria-hidden className={cn('relative aspect-square', toneColor[tone], className)}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 size-full" fill="none">
        {[96, 72, 48].map((radius, index) => (
          <circle
            key={radius}
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeOpacity={0.18 + index * 0.12}
            strokeWidth="1"
            strokeDasharray={index === 0 ? '2 6' : undefined}
          />
        ))}
        <circle cx="100" cy="100" r="7" fill="currentColor" />
      </svg>
      {pulsing && (
        <>
          <span className="absolute inset-[26%] animate-ring rounded-full border border-current" />
          <span className="absolute inset-[26%] animate-ring rounded-full border border-current [animation-delay:1.2s]" />
        </>
      )}
    </div>
  )
}

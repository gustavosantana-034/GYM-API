import { motion } from 'motion/react'
import { MAX_CHECK_IN_DISTANCE_IN_KM } from '@/utils/distance'
import { cn } from '@/utils/cn'

interface CheckInRadarProps {
  /** Null while the position is unknown. */
  distanceInKm: number | null
  className?: string
}

const CENTER = 100
const RANGE_RADIUS = 46 // the 100 m check-in range
const MAX_DOT_RADIUS = 88 // far users sit on the outer ring

/**
 * The gym is the center, the inner circle is the 100 m check-in range and the
 * cyan dot is the user, placed at their real distance (capped at the edge).
 */
export function CheckInRadar({ distanceInKm, className }: CheckInRadarProps) {
  const isInRange = distanceInKm !== null && distanceInKm <= MAX_CHECK_IN_DISTANCE_IN_KM
  const ratio = distanceInKm === null ? null : distanceInKm / MAX_CHECK_IN_DISTANCE_IN_KM
  const dotRadius = ratio === null ? null : Math.min(ratio * RANGE_RADIUS, MAX_DOT_RADIUS)

  // Fixed bearing (up-right): only the distance carries meaning here
  const angle = -Math.PI / 4
  const dot =
    dotRadius === null
      ? null
      : { x: CENTER + Math.cos(angle) * dotRadius, y: CENTER + Math.sin(angle) * dotRadius }

  return (
    <svg aria-hidden viewBox="0 0 200 200" className={cn('w-full', className)}>
      <circle cx={CENTER} cy={CENTER} r={MAX_DOT_RADIUS + 6} fill="none" stroke="var(--border)" strokeDasharray="2 6" />
      <circle cx={CENTER} cy={CENTER} r={70} fill="none" stroke="var(--border)" />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RANGE_RADIUS}
        fill={isInRange ? 'var(--primary-soft)' : 'transparent'}
        stroke={isInRange ? 'var(--primary-ink)' : 'var(--border-strong)'}
        strokeWidth="1.5"
        className="transition-[fill,stroke] duration-300"
      />
      <text
        x={CENTER}
        y={CENTER - RANGE_RADIUS - 6}
        textAnchor="middle"
        className="fill-subtle text-[9px] font-semibold"
      >
        100 m
      </text>

      {/* the gym */}
      <rect x={CENTER - 7} y={CENTER - 7} width="14" height="14" rx="3" fill="var(--primary-ink)" />

      {dot && (
        <motion.g
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.circle
            initial={{ cx: CENTER + 60, cy: CENTER - 60 }}
            animate={{ cx: dot.x, cy: dot.y }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            r="7"
            fill="var(--geo)"
            stroke="var(--surface-1)"
            strokeWidth="3"
          />
        </motion.g>
      )}
    </svg>
  )
}

import { motion } from 'motion/react'
import type { GymWithDistance } from '@/hooks/use-gyms-with-distance'
import { GymCard } from './GymCard'

interface GymListProps {
  gyms: GymWithDistance[]
  activeGymId?: string | null
  onFocusGym?: (gymId: string) => void
}

export function GymList({ gyms, activeGymId, onFocusGym }: GymListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {gyms.map((gym, index) => (
        <motion.li
          key={gym.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index, 8) * 0.03, duration: 0.2 }}
        >
          <GymCard gym={gym} isActive={gym.id === activeGymId} onFocusGym={onFocusGym} />
        </motion.li>
      ))}
    </ul>
  )
}

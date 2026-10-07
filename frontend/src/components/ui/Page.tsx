import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { cn } from '@/utils/cn'

/** Page container with a short entrance, so navigation feels continuous. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex flex-col gap-8', className)}
    >
      {children}
    </motion.div>
  )
}

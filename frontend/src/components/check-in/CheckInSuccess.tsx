import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { ButtonLink } from '@/components/ui/ButtonLink'

export function CheckInSuccess({ firstName }: { firstName: string }) {
  return (
    <div role="status" className="flex flex-col items-center gap-5 py-4 text-center">
      <div className="relative flex size-24 items-center justify-center">
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-primary"
          initial={{ scale: 0.6, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        />
        <motion.span
          className="flex size-20 items-center justify-center rounded-full bg-primary text-on-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Check aria-hidden className="size-10" strokeWidth={3} />
          </motion.span>
        </motion.span>
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-h2 font-extrabold font-expanded">Check-in realizado!</p>
        <p className="text-body text-muted">
          Bom treino, {firstName} <span aria-hidden>💪</span>
        </p>
      </div>

      <p className="max-w-xs text-caption text-subtle">
        A academia confirma sua presença em até 20 minutos. Acompanhe em “Meus check-ins”.
      </p>

      <ButtonLink to="/check-ins" variant="secondary" size="sm">
        Ver meus check-ins
      </ButtonLink>
    </div>
  )
}

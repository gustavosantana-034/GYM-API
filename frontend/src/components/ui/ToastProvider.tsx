import { CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useState, type ReactNode } from 'react'
import { cn } from '@/utils/cn'
import { ToastContext, type ToastInput, type ToastTone } from './toast-context'

interface Toast extends ToastInput {
  id: number
}

const TOAST_DURATION_IN_MS = 4500

const toneStyles: Record<ToastTone, { icon: typeof Info; className: string }> = {
  success: { icon: CircleCheck, className: 'text-success' },
  error: { icon: TriangleAlert, className: 'text-danger' },
  info: { icon: Info, className: 'text-geo' },
}

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    (toast: ToastInput) => {
      const id = nextId++
      setToasts((current) => [...current.slice(-2), { ...toast, id }])
      setTimeout(() => dismiss(id), TOAST_DURATION_IN_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[1200] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:items-end lg:px-6"
      >
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const { icon: Icon, className } = toneStyles[toast.tone ?? 'info']

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
                className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface-1 p-4 shadow-[0_16px_40px_rgb(0_0_0/0.35)]"
              >
                <Icon aria-hidden className={cn('mt-0.5 size-5 shrink-0', className)} />
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-label font-semibold text-text">{toast.title}</p>
                  {toast.description && <p className="text-caption text-muted">{toast.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Fechar aviso"
                  className="-m-1 rounded-sm p-1 text-muted hover:text-text"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

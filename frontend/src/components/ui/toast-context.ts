import { createContext, useContext } from 'react'

export type ToastTone = 'success' | 'error' | 'info'

export interface ToastInput {
  title: string
  description?: string
  tone?: ToastTone
}

export const ToastContext = createContext<((toast: ToastInput) => void) | null>(null)

export function useToast() {
  const showToast = useContext(ToastContext)

  if (!showToast) {
    throw new Error('useToast must be used inside <ToastProvider>')
  }

  return showToast
}

import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap rounded-md select-none transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-on-primary hover:bg-primary-hover',
  secondary:
    'border border-border-strong bg-surface-1 text-text hover:bg-surface-2 hover:border-muted',
  ghost: 'text-text hover:bg-surface-2',
  danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-bg',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-label',
  md: 'h-11 px-4 text-body',
  lg: 'h-14 px-6 text-body font-expanded tracking-wide',
}

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  className?: string
}) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)
}

import { RefreshCw, TriangleAlert } from 'lucide-react'
import { cn } from '@/utils/cn'
import { Button } from './Button'

interface ErrorStateProps {
  title: string
  description?: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function ErrorState({ title, description, onRetry, isRetrying, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-4 rounded-lg border border-danger/30 bg-danger-soft px-6 py-10 text-center',
        className,
      )}
    >
      <TriangleAlert aria-hidden className="size-7 text-danger" />
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="text-h3 font-semibold text-text">{title}</h3>
        {description && <p className="text-label text-muted">{description}</p>}
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} isLoading={isRetrying}>
          {!isRetrying && <RefreshCw aria-hidden className="size-4" />}
          Tentar novamente
        </Button>
      )}
    </div>
  )
}

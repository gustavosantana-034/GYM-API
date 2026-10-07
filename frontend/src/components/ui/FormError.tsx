import { TriangleAlert } from 'lucide-react'

/** Error that concerns the whole form (wrong credentials, network...). */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div role="alert" className="flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft p-3.5">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0 text-danger" />
      <p className="text-label text-text">{message}</p>
    </div>
  )
}

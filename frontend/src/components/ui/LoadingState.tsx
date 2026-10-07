import { DistanceRings } from './DistanceRings'

/** Full-area loading, used while the session is being restored. */
export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="flex min-h-[60dvh] flex-col items-center justify-center gap-6">
      <DistanceRings pulsing tone="primary" className="w-24" />
      <p className="text-label text-muted">{label}</p>
    </div>
  )
}

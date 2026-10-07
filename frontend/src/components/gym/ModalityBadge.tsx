import type { Modality } from '@/types/api'
import { cn } from '@/utils/cn'
import { MODALITY_INFO } from '@/utils/modalities'

export function ModalityBadge({ modality, className }: { modality: Modality; className?: string }) {
  const { label, icon: Icon } = MODALITY_INFO[modality]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-sm border border-border px-2 py-1 text-caption font-medium text-muted',
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {label}
    </span>
  )
}

/** Shows the first modalities and a "+N" counter for the rest. */
export function ModalityList({ modalities, max = 3 }: { modalities: Modality[]; max?: number }) {
  if (modalities.length === 0) return null

  const visible = modalities.slice(0, max)
  const hidden = modalities.length - visible.length

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Modalidades">
      {visible.map((modality) => (
        <li key={modality}>
          <ModalityBadge modality={modality} />
        </li>
      ))}
      {hidden > 0 && (
        <li className="inline-flex items-center px-1 text-caption font-medium text-subtle">+{hidden}</li>
      )}
    </ul>
  )
}

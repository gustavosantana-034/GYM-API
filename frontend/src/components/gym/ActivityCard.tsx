import { Link } from 'react-router'
import type { Modality } from '@/types/api'
import { MODALITY_INFO } from '@/utils/modalities'

/** Shortcut to explore gyms that offer a modality. */
export function ActivityCard({ modality }: { modality: Modality }) {
  const { label, icon: Icon } = MODALITY_INFO[modality]

  return (
    <Link
      to={`/explore?modality=${modality}`}
      className="group flex min-h-24 flex-col justify-between gap-3 rounded-lg border border-border bg-surface-1 p-4 transition-colors hover:border-primary hover:bg-primary-soft"
    >
      <Icon aria-hidden className="size-6 text-muted transition-colors group-hover:text-primary-ink" />
      <span className="text-label font-semibold text-text">{label}</span>
    </Link>
  )
}

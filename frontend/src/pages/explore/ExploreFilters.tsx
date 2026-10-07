import { Chip } from '@/components/ui/Chip'
import { MODALITIES, type Modality } from '@/types/api'
import { MODALITY_INFO } from '@/utils/modalities'
import { RADIUS_OPTIONS, type Radius } from './use-explore-filters'

interface ExploreFiltersProps {
  modality: Modality | null
  onModalityChange: (modality: Modality | null) => void
  radius: Radius
  onRadiusChange: (radius: Radius) => void
  /** Distance only applies when browsing by location. */
  showRadius: boolean
}

export function ExploreFilters({
  modality,
  onModalityChange,
  radius,
  onRadiusChange,
  showRadius,
}: ExploreFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      {showRadius && (
        <fieldset className="flex min-w-0 flex-col gap-2">
          <legend className="mb-2 text-caption font-semibold tracking-[0.08em] text-subtle uppercase">Distância</legend>
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {RADIUS_OPTIONS.map((option) => (
              <Chip key={option} selected={radius === option} onClick={() => onRadiusChange(option)}>
                Até {option} km
              </Chip>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset className="flex min-w-0 flex-col gap-2">
        <legend className="mb-2 text-caption font-semibold tracking-[0.08em] text-subtle uppercase">Modalidades</legend>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {MODALITIES.map((option) => {
            const { label, icon: Icon } = MODALITY_INFO[option]
            const selected = modality === option

            return (
              <Chip
                key={option}
                selected={selected}
                onClick={() => onModalityChange(selected ? null : option)}
                icon={<Icon aria-hidden className="size-4" />}
              >
                {label}
              </Chip>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

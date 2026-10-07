import { useSearchParams } from 'react-router'
import type { Modality } from '@/types/api'
import { isModality, matchModality } from '@/utils/modalities'

export const RADIUS_OPTIONS = [1, 3, 5, 10, 20] as const
export type Radius = (typeof RADIUS_OPTIONS)[number]

const DEFAULT_RADIUS: Radius = 10

export type ExploreView = 'list' | 'map'

/**
 * Filters live in the URL so a search can be shared, bookmarked and kept
 * when the user navigates back from a gym page.
 */
export function useExploreFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const modalityParam = searchParams.get('modality')
  const radiusParam = Number(searchParams.get('radius'))
  const viewParam = searchParams.get('view')

  // "yoga" typed in the search bar becomes the YOGA filter
  const typedModality = matchModality(query)
  const modality: Modality | null = isModality(modalityParam) ? modalityParam : typedModality
  const textQuery = typedModality ? '' : query

  const radius = RADIUS_OPTIONS.find((option) => option === radiusParam) ?? DEFAULT_RADIUS
  const view: ExploreView = viewParam === 'map' ? 'map' : 'list'

  function update(changes: Record<string, string | null>) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)

        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value)
          else next.delete(key)
        }

        return next
      },
      { replace: true },
    )
  }

  return {
    query,
    textQuery,
    modality,
    radius,
    view,
    hasFilters: Boolean(query || modalityParam || searchParams.has('radius')),
    setQuery: (value: string) => update({ q: value || null, modality: null }),
    setModality: (value: Modality | null) =>
      update({ modality: value, q: typedModality ? null : query || null }),
    setRadius: (value: Radius) => update({ radius: value === DEFAULT_RADIUS ? null : String(value) }),
    setView: (value: ExploreView) => update({ view: value === 'map' ? 'map' : null }),
    clearFilters: () => update({ q: null, modality: null, radius: null }),
  }
}

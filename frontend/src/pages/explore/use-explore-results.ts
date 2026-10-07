import { useMemo } from 'react'
import { useLocation } from '@/features/location/location-context'
import { useGymSearch, useNearbyGyms } from '@/hooks/use-gyms'
import { useGymsWithDistance } from '@/hooks/use-gyms-with-distance'
import type { Modality } from '@/types/api'
import type { Radius } from './use-explore-filters'

interface ExploreResultsParams {
  textQuery: string
  modality: Modality | null
  radius: Radius
}

/**
 * Two ways of exploring, picked automatically:
 * - "nearby": user location known and no text typed → gyms in the radius;
 * - "search": text typed or no location → name/address search (all gyms).
 */
export function useExploreResults({ textQuery, modality, radius }: ExploreResultsParams) {
  const { position } = useLocation()
  const mode = position && !textQuery ? 'nearby' : 'search'

  const nearby = useNearbyGyms(mode === 'nearby' ? { ...position!, radius } : null)
  const search = useGymSearch(
    { query: textQuery || undefined, modality: modality ?? undefined },
    mode === 'search',
  )

  const rawGyms = useMemo(() => {
    if (mode === 'search') return search.data?.pages.flat()

    // The nearby endpoint has no modality filter; at most 100 results come
    // back, so filtering them here is cheap.
    return modality ? nearby.data?.filter((gym) => gym.modalities.includes(modality)) : nearby.data
  }, [mode, search.data, nearby.data, modality])

  const gyms = useGymsWithDistance(rawGyms, position)
  const active = mode === 'search' ? search : nearby

  return {
    mode,
    position,
    gyms,
    isPending: active.isPending,
    isError: active.isError,
    isRefetching: active.isRefetching,
    refetch: () => active.refetch(),
    hasNextPage: mode === 'search' && search.hasNextPage,
    isFetchingNextPage: search.isFetchingNextPage,
    fetchNextPage: () => search.fetchNextPage(),
  }
}

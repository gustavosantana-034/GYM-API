import { useMemo } from 'react'
import type { Gym } from '@/types/api'
import type { Coordinates } from '@/types/geo'
import { getDistanceInKm } from '@/utils/distance'

export type GymWithDistance = Gym & { distanceInKm: number | null }

/** Adds the distance from the user to each gym and sorts closest first. */
export function useGymsWithDistance(gyms: Gym[] | undefined, position: Coordinates | null) {
  return useMemo<GymWithDistance[]>(() => {
    if (!gyms) return []

    const enriched = gyms.map((gym) => ({
      ...gym,
      distanceInKm: position ? getDistanceInKm(position, gym) : null,
    }))

    return position
      ? enriched.sort((a, b) => (a.distanceInKm ?? 0) - (b.distanceInKm ?? 0))
      : enriched
  }, [gyms, position])
}

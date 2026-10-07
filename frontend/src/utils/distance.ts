import type { Coordinates } from '@/types/geo'

/** Same rule the API enforces; used only to give feedback before trying. */
export const MAX_CHECK_IN_DISTANCE_IN_KM = 0.1

const EARTH_RADIUS_IN_KM = 6371

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

/** Haversine distance in kilometers. */
export function getDistanceInKm(from: Coordinates, to: Coordinates) {
  const deltaLatitude = toRadians(to.latitude - from.latitude)
  const deltaLongitude = toRadians(to.longitude - from.longitude)

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2

  return 2 * EARTH_RADIUS_IN_KM * Math.asin(Math.sqrt(a))
}

export function isWithinCheckInRange(distanceInKm: number) {
  return distanceInKm <= MAX_CHECK_IN_DISTANCE_IN_KM
}

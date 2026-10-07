import { Gym } from '@prisma/client'

/** Prisma returns coordinates as Decimal, which serialize to strings. */
export function presentGym(gym: Gym) {
  return {
    id: gym.id,
    title: gym.title,
    description: gym.description,
    phone: gym.phone,
    address: gym.address,
    modalities: gym.modalities,
    latitude: gym.latitude.toNumber(),
    longitude: gym.longitude.toNumber(),
    /** Where the data came from: "osm" gyms must credit OpenStreetMap */
    source: gym.osm_id ? ('osm' as const) : ('manual' as const),
    osm_id: gym.osm_id,
    created_at: gym.created_at,
  }
}

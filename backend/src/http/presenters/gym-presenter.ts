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
    created_at: gym.created_at,
  }
}

import { Gym, Modality, Prisma } from '@prisma/client'

/** Enough for every gym within 10 km of a dense city center (~250 in SP). */
export const MAX_NEARBY_RESULTS = 500

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
  radiusInKm: number
}

export interface SearchManyParams {
  query?: string
  modality?: Modality
  page: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyByOsmIds(osmIds: string[]): Promise<Gym[]>
  /** Gyms inside the radius, closest first. */
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  /** Case-insensitive match on title or address, optionally by modality. */
  searchMany(params: SearchManyParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  save(gym: Gym): Promise<Gym>
}

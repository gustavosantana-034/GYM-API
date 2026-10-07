import { Gym, Modality, Prisma } from '@prisma/client'

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
  /** Gyms inside the radius, closest first. */
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  /** Case-insensitive match on title or address, optionally by modality. */
  searchMany(params: SearchManyParams): Promise<Gym[]>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  save(gym: Gym): Promise<Gym>
}

import { Modality } from '@prisma/client'

/** A gym found in an external places database. */
export interface ExternalGym {
  /** Stable id in the source, used to avoid duplicates on re-imports. */
  externalId: string
  title: string
  description: string | null
  phone: string | null
  address: string | null
  modalities: Modality[]
  latitude: number
  longitude: number
}

export interface FindGymsAroundParams {
  latitude: number
  longitude: number
  radiusInKm: number
}

/** Source of real gyms (OpenStreetMap today, any other provider later). */
export interface PlacesProvider {
  findGymsAround(params: FindGymsAroundParams): Promise<ExternalGym[]>
}

import { PlacesProvider } from '@/providers/places-provider'
import { Prisma } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

export const MAX_IMPORT_RADIUS_IN_KM = 20

interface ImportNearbyGymsUseCaseRequest {
  latitude: number
  longitude: number
  radiusInKm: number
}

interface ImportNearbyGymsUseCaseResponse {
  found: number
  created: number
  updated: number
}

/**
 * Brings real gyms around a point into the platform. Re-running it is safe:
 * gyms already imported (same OSM id) are updated instead of duplicated.
 */
export class ImportNearbyGymsUseCase {
  constructor(
    private gymsRepository: GymsRepository,
    private placesProvider: PlacesProvider,
  ) {}

  async execute({
    latitude,
    longitude,
    radiusInKm,
  }: ImportNearbyGymsUseCaseRequest): Promise<ImportNearbyGymsUseCaseResponse> {
    const places = await this.placesProvider.findGymsAround({
      latitude,
      longitude,
      radiusInKm: Math.min(radiusInKm, MAX_IMPORT_RADIUS_IN_KM),
    })

    const existingGyms = await this.gymsRepository.findManyByOsmIds(
      places.map((place) => place.externalId),
    )
    const existingByOsmId = new Map(
      existingGyms.map((gym) => [gym.osm_id, gym]),
    )

    let created = 0
    let updated = 0

    for (const { externalId, latitude, longitude, ...data } of places) {
      const existing = existingByOsmId.get(externalId)

      if (existing) {
        await this.gymsRepository.save({
          ...existing,
          ...data,
          latitude: new Prisma.Decimal(latitude),
          longitude: new Prisma.Decimal(longitude),
        })
        updated++
      } else {
        await this.gymsRepository.create({
          ...data,
          latitude,
          longitude,
          osm_id: externalId,
        })
        created++
      }
    }

    return { found: places.length, created, updated }
  }
}

import { Gym } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

export const DEFAULT_NEARBY_RADIUS_IN_KM = 10
export const MAX_NEARBY_RADIUS_IN_KM = 50

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
  radiusInKm?: number
}

interface FetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
    radiusInKm = DEFAULT_NEARBY_RADIUS_IN_KM,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      radiusInKm: Math.min(radiusInKm, MAX_NEARBY_RADIUS_IN_KM),
    })

    return {
      gyms,
    }
  }
}

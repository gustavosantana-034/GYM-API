import { Gym, Modality, Prisma } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface UpdateGymUseCaseRequest {
  gymId: string
  title: string
  description: string | null
  phone: string | null
  address: string | null
  modalities: Modality[]
  latitude: number
  longitude: number
}

interface UpdateGymUseCaseResponse {
  gym: Gym
}

export class UpdateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    gymId,
    latitude,
    longitude,
    ...data
  }: UpdateGymUseCaseRequest): Promise<UpdateGymUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const updatedGym = await this.gymsRepository.save({
      ...gym,
      ...data,
      latitude: new Prisma.Decimal(latitude),
      longitude: new Prisma.Decimal(longitude),
    })

    return {
      gym: updatedGym,
    }
  }
}

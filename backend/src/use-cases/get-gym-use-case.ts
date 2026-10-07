import { Gym } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetGymUseCaseRequest {
  gymId: string
}

interface GetGymUseCaseResponse {
  gym: Gym
}

export class GetGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    gymId,
  }: GetGymUseCaseRequest): Promise<GetGymUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    return {
      gym,
    }
  }
}

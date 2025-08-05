import { Gym } from '../../generated/prisma/index'
import { GymsRepository } from '../repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  descrption: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    descrption,
    phone,
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      descrption,
      phone,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}

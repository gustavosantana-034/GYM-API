import { Gym, Modality } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  address?: string | null
  modalities?: Modality[]
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
    description,
    phone,
    address = null,
    modalities = [],
    latitude,
    longitude,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      phone,
      address,
      modalities,
      latitude,
      longitude,
    })

    return {
      gym,
    }
  }
}

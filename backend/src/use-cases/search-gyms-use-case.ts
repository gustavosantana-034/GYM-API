import { Gym, Modality } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

interface SearchGymsUseCaseRequest {
  query?: string
  modality?: Modality
  page: number
}

interface SearchGymsUseCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    query,
    modality,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.searchMany({
      query: query?.trim() || undefined,
      modality,
      page,
    })

    return {
      gyms,
    }
  }
}

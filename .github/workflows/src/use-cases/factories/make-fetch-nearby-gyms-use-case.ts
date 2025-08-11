import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  // sourcery skip: inline-immediately-returned-variable
  const useCase = new FetchNearbyGymsUseCase(gymsRepository)

  return useCase
}

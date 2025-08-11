import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms-use-case'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  // sourcery skip: inline-immediately-returned-variable
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}

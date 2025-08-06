import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym-use-case'

export function makeCreateymUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  // sourcery skip: inline-immediately-returned-variable
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}

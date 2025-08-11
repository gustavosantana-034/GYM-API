import { PrimsaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in-use-case'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrimsaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  // sourcery skip: inline-immediately-returned-variable
  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}

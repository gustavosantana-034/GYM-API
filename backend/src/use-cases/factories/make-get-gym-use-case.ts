import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { GetGymUseCase } from '../get-gym-use-case'

export function makeGetGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  return new GetGymUseCase(gymsRepository)
}

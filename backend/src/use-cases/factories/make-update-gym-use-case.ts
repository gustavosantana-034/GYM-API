import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { UpdateGymUseCase } from '../update-gym-use-case'

export function makeUpdateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  return new UpdateGymUseCase(gymsRepository)
}

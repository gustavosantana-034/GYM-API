import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchCheckInsUseCase } from '../fetch-check-ins-use-case'

export function makeFetchCheckInsUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()

  return new FetchCheckInsUseCase(checkInsRepository)
}

import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()

  // sourcery skip: inline-immediately-returned-variable
  const useCase = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

  return useCase
}

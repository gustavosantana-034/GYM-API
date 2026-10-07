import { PrimsaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { GetUserMetricsUseCase } from '../get-user-metrics-use-case'

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrimsaCheckInsRepository()
  // sourcery skip: inline-immediately-returned-variable
  const useCase = new GetUserMetricsUseCase(checkInsRepository)

  return useCase
}

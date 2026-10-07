import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in-use-case'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()

  // sourcery skip: inline-immediately-returned-variable
  const useCase = new ValidateCheckInUseCase(checkInsRepository)

  return useCase
}

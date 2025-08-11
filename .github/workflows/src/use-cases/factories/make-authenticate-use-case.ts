import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate-use-case'

export function makeAuthenticateUseCase() {
  const userRepository = new PrismaUsersRepository()
  return new AuthenticateUseCase(userRepository)
}

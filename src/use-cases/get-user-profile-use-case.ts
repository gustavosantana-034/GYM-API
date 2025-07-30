import { UserRepository } from '@/repositories/users-repository'
import { User } from 'generated/prisma'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User // instance of User Prisma, go to the definition to see
}

export class GetUserProfileUseCase {
  // constructor() {} → Receives the database instance via Prisma Client
  constructor(private usersRepository: UserRepository) {}

  // Our method of instance class
  /*
    const usersRepository: {
        findByEmail: (email: string) => Promise<{ ... 5 more } | null>;
        create: (data: UserCreateInput) => Promise<{ ... 5 more }>;
    } 
  */
  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.finbById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}

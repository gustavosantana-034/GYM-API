import { UserRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { compare } from 'bcryptjs'
import { User } from 'generated/prisma'
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User // instance of User Prisma, go to the definition to see
}

export class AuthenticateUseCase {
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
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatches = await compare(password, user.password_hash)

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError()
    }

    return {
      user,
    }
  }
}

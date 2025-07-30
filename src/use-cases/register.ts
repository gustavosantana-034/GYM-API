import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { User } from 'generated/prisma'
import { EmailAlreadyExists } from './errors/email-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

// SOLID

// D - Dependecy Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    // Search for user with the same email
    const userWithTheSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithTheSameEmail) {
      throw new EmailAlreadyExists()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
  }
}

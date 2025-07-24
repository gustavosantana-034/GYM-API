import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID

// D - Dependecy Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    // Search for user with the same email
    const userWithTheSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithTheSameEmail) {
      throw new Error('Email Already Exists.')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}

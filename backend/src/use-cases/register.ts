import { UserRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { hash } from 'bcryptjs'
import { EmailAlreadyExists } from './errors/email-already-exists-error'

export const PASSWORD_HASH_ROUNDS = 10

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const normalizedEmail = email.trim().toLowerCase()

    // Checked before hashing so a duplicate does not pay the bcrypt cost
    const userWithTheSameEmail =
      await this.usersRepository.findByEmail(normalizedEmail)

    if (userWithTheSameEmail) {
      throw new EmailAlreadyExists()
    }

    const password_hash = await hash(password, PASSWORD_HASH_ROUNDS)

    const user = await this.usersRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash,
    })

    return {
      user,
    }
  }
}

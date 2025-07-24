import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

// SOLID

// D - Dependecy Inversion Principle

export class RegisterUseCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    // Search for user with the same email
    const userWithTheSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithTheSameEmail) {
      throw new Error('Email Already Exists.')
    }

    // const prismaUsersRepostiory = new PrismaUsersRepository()

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}

import { prisma } from '@/lib/prisma'
import { Prisma } from 'generated/prisma'
import { UserRepository } from '../users-repository'

export class PrismaUsersRepository implements UserRepository {
  async findById(id: string) {
    // sourcery skip: inline-immediately-returned-variable
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    return user
  }

  async findByEmail(email: string) {
    // sourcery skip: inline-immediately-returned-variable
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    // sourcery skip: inline-immediately-returned-variable
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}

import { Prisma, User } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { UserRepository } from '../users-repository'

export class InMemoryUsersRepository implements UserRepository {
  public userItems: User[] = []

  async findById(id: string) {
    const user = this.userItems.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.userItems.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user: User = {
      id: data.id ?? randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      role: data.role ?? 'MEMBER',
      created_at: new Date(),
    }

    this.userItems.push(user)

    return user
  }
}

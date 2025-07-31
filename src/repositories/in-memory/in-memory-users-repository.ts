import { Prisma, User } from 'generated/prisma'
import { randomUUID } from 'node:crypto'
import { UserRepository } from '../users-repository'

export class InMemoryUsersRepository implements UserRepository {
  public userItems: User[] = []

  async finbById(id: string) {
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
    const user = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.userItems.push(user)

    return user
  }
}

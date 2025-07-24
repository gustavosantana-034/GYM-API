import { Prisma } from 'generated/prisma'

export class InMemoryUsersRepostitory {
  public users: any[] = []

  async create(data: Prisma.UserCreateInput) {
    this.users.push(data)
  }
}

import { Prisma, User } from 'generated/prisma'

export interface UserRepository {
  finbById(id: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}

import { Prisma, User } from 'generated/prisma'

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}

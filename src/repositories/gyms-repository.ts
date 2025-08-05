import { Gym, Prisma } from 'generated/prisma'

export interface GymsRepository {
  finbById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
}

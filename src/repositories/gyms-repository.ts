import { Gym } from 'generated/prisma'

export interface GymsRepository {
  finbById(id: string): Promise<Gym | null>
}

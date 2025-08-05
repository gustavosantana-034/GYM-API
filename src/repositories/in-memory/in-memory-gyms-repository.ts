import { randomUUID } from 'crypto'
import { Gym, Prisma } from '../../../generated/prisma/index'
import { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public userItems: Gym[] = []

  async finbById(id: string) {
    const gym = this.userItems.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      descrption: data.descrption ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.userItems.push(gym)

    return gym
  }
}

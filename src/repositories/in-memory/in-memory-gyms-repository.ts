import { Gym } from '../../../generated/prisma/index'
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
}

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

const user = { userLatitude: -23.2805045, userLongitude: -45.8944638 }

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    await gymsRepository.create({
      title: 'Far GYM', // ~60 km away
      latitude: -23.0642476,
      longitude: -46.4182858,
    })

    await gymsRepository.create({
      title: 'Medium GYM', // ~4.3 km away
      latitude: -23.2422,
      longitude: -45.8992,
    })

    await gymsRepository.create({
      title: 'Near GYM', // ~830 m away
      latitude: -23.28795,
      longitude: -45.89437,
    })
  })

  it('should fetch gyms within 10 km by default, closest first', async () => {
    const { gyms } = await sut.execute(user)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near GYM' }),
      expect.objectContaining({ title: 'Medium GYM' }),
    ])
  })

  it('should respect a custom search radius', async () => {
    const { gyms } = await sut.execute({ ...user, radiusInKm: 1 })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near GYM' })])
  })

  it('should cap the search radius at 50 km', async () => {
    const { gyms } = await sut.execute({ ...user, radiusInKm: 500 })

    expect(gyms).toHaveLength(2)
  })
})

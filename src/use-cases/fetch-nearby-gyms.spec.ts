import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near GYM',
      phone: null,
      descrption: null,
      latitude: -23.28795,
      longitude: -45.89437,
    })

    await gymsRepository.create({
      title: 'Far GYM',
      phone: null,
      descrption: null,
      latitude: -23.0642476,
      longitude: -46.4182858,
    })

    const { gyms } = await sut.execute({
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    })

    expect(gyms).toHaveLength(1) // this gym is expected to return because it is close to the user

    expect(gyms).toEqual([expect.objectContaining({ title: 'Near GYM' })])
  })
})

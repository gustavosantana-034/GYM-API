import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetGymUseCase } from './get-gym-use-case'

let gymsRepository: InMemoryGymsRepository
let sut: GetGymUseCase

describe('Get Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new GetGymUseCase(gymsRepository)
  })

  it('should be able to get a gym by id', async () => {
    const createdGym = await gymsRepository.create({
      title: 'Iron House',
      latitude: -23.2805045,
      longitude: -45.8944638,
    })

    const { gym } = await sut.execute({ gymId: createdGym.id })

    expect(gym.title).toEqual('Iron House')
  })

  it('should not be able to get an inexistent gym', async () => {
    await expect(() =>
      sut.execute({ gymId: 'inexistent-gym' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

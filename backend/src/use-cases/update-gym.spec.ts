import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UpdateGymUseCase } from './update-gym-use-case'

let gymsRepository: InMemoryGymsRepository
let sut: UpdateGymUseCase

const gymData = {
  title: 'Iron House 2',
  description: 'Renovated',
  phone: '11999999999',
  address: 'Rua Nova, 200',
  modalities: ['CROSSFIT' as const],
  latitude: -23.5,
  longitude: -46.6,
}

describe('Update Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new UpdateGymUseCase(gymsRepository)
  })

  it('should be able to update a gym', async () => {
    const createdGym = await gymsRepository.create({
      title: 'Iron House',
      latitude: -23.2805045,
      longitude: -45.8944638,
    })

    const { gym } = await sut.execute({ gymId: createdGym.id, ...gymData })

    expect(gym).toEqual(
      expect.objectContaining({
        id: createdGym.id,
        title: 'Iron House 2',
        address: 'Rua Nova, 200',
        modalities: ['CROSSFIT'],
      }),
    )
    expect(gym.latitude.toNumber()).toEqual(-23.5)
    expect(gymsRepository.items[0].title).toEqual('Iron House 2')
  })

  it('should not be able to update an inexistent gym', async () => {
    await expect(() =>
      sut.execute({ gymId: 'inexistent-gym', ...gymData }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

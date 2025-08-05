import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym-use-case'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase
describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'Iron Gym',
      phone: null,
      descrption: null,
      latitude: -23.2134513,
      longitude: -45.6733998,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

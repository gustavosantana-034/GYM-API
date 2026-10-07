import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('Fetch User Check-In History Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository(gymsRepository)
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should fetch the history most recent first, with the gym of each check-in', async () => {
    await gymsRepository.create({
      id: 'gym-01',
      title: 'Iron House',
      address: 'Rua A, 100',
      latitude: 0,
      longitude: 0,
    })

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
      created_at: new Date('2025-10-01T10:00:00Z'),
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
      created_at: new Date('2025-10-02T10:00:00Z'),
    })

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'another-user',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-02' }),
      expect.objectContaining({
        gym_id: 'gym-01',
        gym: { id: 'gym-01', title: 'Iron House', address: 'Rua A, 100' },
      }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
        created_at: new Date(2025, 0, i),
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-01',
      page: 2,
    })

    // Page 2 holds the two oldest check-ins
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-2' }),
      expect.objectContaining({ gym_id: 'gym-1' }),
    ])
  })
})

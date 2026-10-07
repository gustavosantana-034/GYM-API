import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics-use-case'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toBe(2)
  })

  it('should return the streak and period stats of the user only', async () => {
    // Wednesday, 2025-10-08 at noon in São Paulo
    vi.setSystemTime(new Date('2025-10-08T15:00:00Z'))

    for (const date of ['2025-10-06', '2025-10-07', '2025-10-08']) {
      await checkInsRepository.create({
        gym_id: 'gym-01',
        user_id: 'user-01',
        created_at: new Date(`${date}T12:00:00Z`),
      })
    }

    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'another-user',
      created_at: new Date('2025-10-08T12:00:00Z'),
    })

    const metrics = await sut.execute({ userId: 'user-01' })

    expect(metrics).toEqual({
      checkInsCount: 3,
      checkInsThisWeek: 3,
      checkInsThisMonth: 3,
      currentStreak: 3,
      bestStreak: 3,
    })
  })
})

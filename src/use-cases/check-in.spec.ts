import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in-use-case'

let checkInsRepository: CheckInsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  // RED: Error on test
  // GREEN: Make the test to passed
  // REFACTOR: Improve the code

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 6, 31, 8, 0, 0)) // Mock

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should  be able to check in twice bur in diferents days', async () => {
    vi.setSystemTime(new Date(2025, 7, 18, 8, 0, 0)) // Mock

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    vi.setSystemTime(new Date(2025, 7, 19, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})

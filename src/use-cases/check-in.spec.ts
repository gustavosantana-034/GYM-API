import { Decimal } from 'generated/prisma/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { CheckInsRepository } from '../repositories/check-ins-repository'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in-use-case'

let checkInsRepository: CheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.userItems.push({
      id: 'gym-01',
      title: 'Gym Russel',
      descrption: '',
      phone: '',
      latitude: new Decimal(-23.2805045),
      longitude: new Decimal(-45.8944638),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2025, 6, 31, 8, 0, 0)) // Mock

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    })

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -23.2805045,
        userLongitude: -45.8944638,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
  it('should  be able to check in twice bur in diferents days', async () => {
    vi.setSystemTime(new Date(2025, 7, 18, 8, 0, 0)) // Mock

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    })

    vi.setSystemTime(new Date(2025, 7, 19, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})

it('should not be able to check in on distant gym', async () => {
  gymsRepository.userItems.push({
    id: 'gym-02',
    title: 'Gym Jeje',
    descrption: '',
    phone: '',
    latitude: new Decimal(-23.2134513),
    longitude: new Decimal(-45.6733998),
  })

  await expect(() =>
    sut.execute({
      userId: 'user-01',
      gymId: 'gym-02',
      userLatitude: -23.2805045,
      userLongitude: -45.8944638,
    }),
  ).rejects.toBeInstanceOf(Error)
})

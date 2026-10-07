import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in-use-case'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const gymCoordinates = { latitude: -23.2805045, longitude: -45.8944638 }

describe('Check-In Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository(gymsRepository)
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Gym Russel',
      description: '',
      phone: '',
      ...gymCoordinates,
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
      userLatitude: gymCoordinates.latitude,
      userLongitude: gymCoordinates.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date('2025-07-31T11:00:00Z')) // 08:00 in São Paulo

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: gymCoordinates.latitude,
      userLongitude: gymCoordinates.longitude,
    })

    vi.setSystemTime(new Date('2025-08-01T01:30:00Z')) // 22:30 in São Paulo

    await expect(
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: gymCoordinates.latitude,
        userLongitude: gymCoordinates.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice on different days', async () => {
    vi.setSystemTime(new Date('2025-08-18T11:00:00Z'))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: gymCoordinates.latitude,
      userLongitude: gymCoordinates.longitude,
    })

    vi.setSystemTime(new Date('2025-08-19T11:00:00Z'))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: gymCoordinates.latitude,
      userLongitude: gymCoordinates.longitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on a distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'Gym Jeje',
      description: '',
      phone: '',
      latitude: -23.2134513,
      longitude: -45.6733998,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: gymCoordinates.latitude,
        userLongitude: gymCoordinates.longitude,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })

  it('should be able to check in up to 100 meters away from the gym', async () => {
    // ~90 m north of the gym
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: gymCoordinates.latitude + 0.0008,
      userLongitude: gymCoordinates.longitude,
    })

    expect(checkIn.gym_id).toEqual('gym-01')
  })

  it('should not be able to check in on an inexistent gym', async () => {
    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'inexistent-gym',
        userLatitude: gymCoordinates.latitude,
        userLongitude: gymCoordinates.longitude,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})

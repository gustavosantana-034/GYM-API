import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchCheckInsUseCase } from './fetch-check-ins-use-case'

let usersRepository: InMemoryUsersRepository
let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchCheckInsUseCase

describe('Fetch Check-Ins Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository(
      gymsRepository,
      usersRepository,
    )
    sut = new FetchCheckInsUseCase(checkInsRepository)

    await usersRepository.create({
      id: 'user-01',
      name: 'John Doe',
      email: 'john@example.com',
      password_hash: 'hash',
    })

    await gymsRepository.create({
      id: 'gym-01',
      title: 'Iron House',
      latitude: 0,
      longitude: 0,
    })

    await checkInsRepository.create({
      id: 'pending-check-in',
      user_id: 'user-01',
      gym_id: 'gym-01',
      created_at: new Date('2025-10-02T10:00:00Z'),
    })

    await checkInsRepository.create({
      id: 'validated-check-in',
      user_id: 'user-01',
      gym_id: 'gym-01',
      created_at: new Date('2025-10-01T10:00:00Z'),
      validated_at: new Date('2025-10-01T10:05:00Z'),
    })
  })

  it('should list every check-in with its user and gym, most recent first', async () => {
    const { checkIns } = await sut.execute({ page: 1 })

    expect(checkIns).toEqual([
      expect.objectContaining({
        id: 'pending-check-in',
        user: { id: 'user-01', name: 'John Doe', email: 'john@example.com' },
        gym: expect.objectContaining({ title: 'Iron House' }),
      }),
      expect.objectContaining({ id: 'validated-check-in' }),
    ])
  })

  it('should be able to list only pending check-ins', async () => {
    const { checkIns } = await sut.execute({ status: 'pending', page: 1 })

    expect(checkIns).toEqual([
      expect.objectContaining({ id: 'pending-check-in' }),
    ])
  })

  it('should be able to list only validated check-ins', async () => {
    const { checkIns } = await sut.execute({ status: 'validated', page: 1 })

    expect(checkIns).toEqual([
      expect.objectContaining({ id: 'validated-check-in' }),
    ])
  })
})

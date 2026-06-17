import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms-use-case'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Js-GYM',
      phone: null,
      description: null,
      latitude: -23.2134513,
      longitude: -45.6733998,
    })

    await gymsRepository.create({
      title: 'Ts-GYM',
      phone: null,
      description: null,
      latitude: -23.2134513,
      longitude: -45.6733998,
    })

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 1,
    })

    expect(gyms).toHaveLength(1)

    expect(gyms).toEqual([expect.objectContaining({ title: 'Js-GYM' })])
  })

  it('should be able to fetch pagintaded gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Js-GYM ${i}`,
        phone: null,
        description: null,
        latitude: -23.2134513,
        longitude: -45.6733998,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 2,
    })

    expect(gyms).toHaveLength(2)

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Js-GYM 21' }),
      expect.objectContaining({ title: 'Js-GYM 22' }),
    ])
  })
})

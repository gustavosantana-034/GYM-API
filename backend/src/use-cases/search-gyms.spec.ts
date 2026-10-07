import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms-use-case'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

const coordinates = { latitude: -23.2134513, longitude: -45.6733998 }

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms by title', async () => {
    await gymsRepository.create({ title: 'Js-GYM', ...coordinates })
    await gymsRepository.create({ title: 'Ts-GYM', ...coordinates })

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 1,
    })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Js-GYM' })])
  })

  it('should ignore letter case', async () => {
    await gymsRepository.create({ title: 'Iron House', ...coordinates })

    const { gyms } = await sut.execute({ query: 'iron', page: 1 })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Iron House' })])
  })

  it('should be able to search for gyms by address', async () => {
    await gymsRepository.create({
      title: 'Iron House',
      address: 'Av. Paulista, 1000 - Bela Vista',
      ...coordinates,
    })
    await gymsRepository.create({
      title: 'Power Gym',
      address: 'Rua Augusta, 200',
      ...coordinates,
    })

    const { gyms } = await sut.execute({ query: 'paulista', page: 1 })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Iron House' })])
  })

  it('should be able to filter gyms by modality', async () => {
    await gymsRepository.create({
      title: 'Zen Studio',
      modalities: ['YOGA', 'PILATES'],
      ...coordinates,
    })
    await gymsRepository.create({
      title: 'Box 360',
      modalities: ['CROSSFIT'],
      ...coordinates,
    })

    const { gyms } = await sut.execute({ modality: 'YOGA', page: 1 })

    expect(gyms).toEqual([expect.objectContaining({ title: 'Zen Studio' })])
  })

  it('should list every gym when no filter is given', async () => {
    await gymsRepository.create({ title: 'B Gym', ...coordinates })
    await gymsRepository.create({ title: 'A Gym', ...coordinates })

    const { gyms } = await sut.execute({ query: '  ', page: 1 })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'A Gym' }),
      expect.objectContaining({ title: 'B Gym' }),
    ])
  })

  it('should be able to fetch paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Js-GYM ${String(i).padStart(2, '0')}`,
        ...coordinates,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Js',
      page: 2,
    })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Js-GYM 21' }),
      expect.objectContaining({ title: 'Js-GYM 22' }),
    ])
  })
})

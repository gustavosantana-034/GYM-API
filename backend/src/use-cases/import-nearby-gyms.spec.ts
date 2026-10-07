import { ExternalGym, PlacesProvider } from '@/providers/places-provider'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ImportNearbyGymsUseCase } from './import-nearby-gyms-use-case'

class FakePlacesProvider implements PlacesProvider {
  public gyms: ExternalGym[] = []
  public lastRadius: number | null = null

  async findGymsAround({ radiusInKm }: { radiusInKm: number }) {
    this.lastRadius = radiusInKm
    return this.gyms
  }
}

const smartFit: ExternalGym = {
  externalId: 'node/1',
  title: 'Smart Fit',
  description: null,
  phone: null,
  address: 'Avenida Paulista, 664',
  modalities: ['WEIGHT_TRAINING'],
  latitude: -23.567,
  longitude: -46.649,
}

let gymsRepository: InMemoryGymsRepository
let placesProvider: FakePlacesProvider
let sut: ImportNearbyGymsUseCase

describe('Import Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    placesProvider = new FakePlacesProvider()
    sut = new ImportNearbyGymsUseCase(gymsRepository, placesProvider)
  })

  it('should create the gyms found around the user', async () => {
    placesProvider.gyms = [
      smartFit,
      {
        ...smartFit,
        externalId: 'way/2',
        title: 'Aura Pilates',
        modalities: ['PILATES'],
      },
    ]

    const result = await sut.execute({
      latitude: -23.56,
      longitude: -46.65,
      radiusInKm: 10,
    })

    expect(result).toEqual({ found: 2, created: 2, updated: 0 })
    expect(gymsRepository.items).toEqual([
      expect.objectContaining({
        title: 'Smart Fit',
        osm_id: 'node/1',
        address: 'Avenida Paulista, 664',
      }),
      expect.objectContaining({
        title: 'Aura Pilates',
        osm_id: 'way/2',
        modalities: ['PILATES'],
      }),
    ])
  })

  it('should update instead of duplicating gyms imported before', async () => {
    placesProvider.gyms = [smartFit]
    await sut.execute({ latitude: -23.56, longitude: -46.65, radiusInKm: 10 })

    placesProvider.gyms = [
      { ...smartFit, title: 'Smart Fit Paulista', phone: '(11) 3000-0000' },
    ]
    const result = await sut.execute({
      latitude: -23.56,
      longitude: -46.65,
      radiusInKm: 10,
    })

    expect(result).toEqual({ found: 1, created: 0, updated: 1 })
    expect(gymsRepository.items).toHaveLength(1)
    expect(gymsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'Smart Fit Paulista',
        phone: '(11) 3000-0000',
        osm_id: 'node/1',
      }),
    )
  })

  it('should cap the search radius', async () => {
    await sut.execute({ latitude: -23.56, longitude: -46.65, radiusInKm: 500 })

    expect(placesProvider.lastRadius).toBe(20)
  })
})

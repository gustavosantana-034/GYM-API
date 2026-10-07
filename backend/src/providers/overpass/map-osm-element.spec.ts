import { describe, expect, it } from 'vitest'
import { inferModalities, mapOsmElement } from './map-osm-element'

describe('mapOsmElement', () => {
  it('maps a gym node with address and phone', () => {
    const gym = mapOsmElement({
      type: 'node',
      id: 4964023957,
      lat: -23.567,
      lon: -46.649,
      tags: {
        leisure: 'fitness_centre',
        name: 'Smart Fit',
        sport: 'fitness',
        'addr:street': 'Avenida Paulista',
        'addr:housenumber': '664',
        'addr:suburb': 'Bela Vista',
        phone: '+55 11 3000-0000;+55 11 3000-0001',
      },
    })

    expect(gym).toEqual({
      externalId: 'node/4964023957',
      title: 'Smart Fit',
      description: null,
      phone: '+55 11 3000-0000',
      address: 'Avenida Paulista, 664 - Bela Vista',
      modalities: ['WEIGHT_TRAINING'],
      latitude: -23.567,
      longitude: -46.649,
    })
  })

  it('uses the center of ways and relations', () => {
    const gym = mapOsmElement({
      type: 'way',
      id: 1,
      center: { lat: -23.5, lon: -46.6 },
      tags: { leisure: 'fitness_centre', name: 'Box 360' },
    })

    expect(gym).toEqual(
      expect.objectContaining({
        externalId: 'way/1',
        latitude: -23.5,
        longitude: -46.6,
      }),
    )
  })

  it('ignores places without a name or position', () => {
    expect(
      mapOsmElement({
        type: 'node',
        id: 1,
        lat: 0,
        lon: 0,
        tags: { leisure: 'fitness_centre' },
      }),
    ).toBeNull()
    expect(
      mapOsmElement({
        type: 'way',
        id: 2,
        tags: { leisure: 'fitness_centre', name: 'Gym' },
      }),
    ).toBeNull()
  })

  it('ignores sports centres that are not for working out', () => {
    expect(
      mapOsmElement({
        type: 'node',
        id: 3,
        lat: 0,
        lon: 0,
        tags: {
          leisure: 'sports_centre',
          name: 'Quadras Poliesportivas',
          sport: 'soccer;tennis',
        },
      }),
    ).toBeNull()
  })
})

describe('inferModalities', () => {
  it('reads multiple values of the sport tag', () => {
    expect(
      inferModalities({
        leisure: 'sports_centre',
        name: 'Clube',
        sport: 'swimming;muay_thai;flamenco_dancing',
      }),
    ).toEqual(['SWIMMING', 'MARTIAL_ARTS', 'DANCE'])
  })

  it('detects specialised studios by their name', () => {
    expect(
      inferModalities({
        leisure: 'fitness_centre',
        name: 'Pure Pilates Casa Verde',
      }),
    ).toEqual(['PILATES'])
    expect(
      inferModalities({ leisure: 'fitness_centre', name: 'CrossFit Paulista' }),
    ).toEqual(['CROSSFIT'])
  })

  it('treats a fitness centre without other hints as a regular gym', () => {
    expect(
      inferModalities({ leisure: 'fitness_centre', name: 'Academia Gaviões' }),
    ).toEqual(['WEIGHT_TRAINING'])
  })

  it('maps dance venues', () => {
    expect(inferModalities({ leisure: 'dance', name: 'Clube Latino' })).toEqual(
      ['DANCE'],
    )
  })
})

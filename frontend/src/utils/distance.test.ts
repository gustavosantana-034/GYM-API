import { describe, expect, it } from 'vitest'
import { getDistanceInKm, isWithinCheckInRange } from './distance'

describe('getDistanceInKm', () => {
  it('returns zero for the same point', () => {
    const point = { latitude: -23.5614, longitude: -46.6559 }
    expect(getDistanceInKm(point, point)).toBe(0)
  })

  it('measures the distance between São Paulo and Rio de Janeiro', () => {
    const saoPaulo = { latitude: -23.5505, longitude: -46.6333 }
    const rio = { latitude: -22.9068, longitude: -43.1729 }

    expect(getDistanceInKm(saoPaulo, rio)).toBeCloseTo(361, 0)
  })
})

describe('isWithinCheckInRange', () => {
  it('accepts up to 100 meters, like the API', () => {
    expect(isWithinCheckInRange(0.1)).toBe(true)
    expect(isWithinCheckInRange(0.101)).toBe(false)
  })
})

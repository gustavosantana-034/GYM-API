import { describe, expect, it } from 'vitest'
import { formatDistance, getFirstName, getInitials, splitDistance } from './format'

describe('formatDistance', () => {
  it.each([
    [0.072, '72 m'],
    [0.846, '850 m'],
    [0.998, '1 km'],
    [1.24, '1,2 km'],
    [3.4, '3,4 km'],
    [14.6, '15 km'],
  ])('formats %f km as "%s"', (km, expected) => {
    expect(formatDistance(km)).toBe(expected)
  })

  it('splits value and unit for display', () => {
    expect(splitDistance(1.24)).toEqual({ value: '1,2', unit: 'km' })
  })
})

describe('names', () => {
  it('extracts the first name', () => {
    expect(getFirstName('  Gustavo Santana ')).toBe('Gustavo')
  })

  it('builds initials from the first and last names', () => {
    expect(getInitials('Gustavo Henrique Santana')).toBe('GS')
    expect(getInitials('gustavo')).toBe('G')
  })
})

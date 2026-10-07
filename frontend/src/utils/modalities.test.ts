import { describe, expect, it } from 'vitest'
import { isModality, matchModality } from './modalities'

describe('matchModality', () => {
  it.each([
    ['Natação', 'SWIMMING'],
    ['musculação', 'WEIGHT_TRAINING'],
    ['cross', 'CROSSFIT'],
    ['jiu', 'MARTIAL_ARTS'],
    ['YOGA', 'YOGA'],
  ])('recognizes "%s"', (text, expected) => {
    expect(matchModality(text)).toBe(expected)
  })

  it('ignores gym names and very short text', () => {
    expect(matchModality('Iron House')).toBeNull()
    expect(matchModality('yo')).toBeNull()
  })
})

describe('isModality', () => {
  it('validates values coming from the URL', () => {
    expect(isModality('YOGA')).toBe(true)
    expect(isModality('yoga')).toBe(false)
    expect(isModality(null)).toBe(false)
  })
})

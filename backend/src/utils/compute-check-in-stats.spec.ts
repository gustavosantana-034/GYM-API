import { describe, expect, it } from 'vitest'
import { computeCheckInStats } from './compute-check-in-stats'

const TIMEZONE = 'America/Sao_Paulo'

// São Paulo is UTC-3: noon local time is 15:00 UTC
const atNoon = (day: string) => new Date(`${day}T15:00:00Z`)

describe('computeCheckInStats', () => {
  const now = atNoon('2025-10-08') // Wednesday

  it('should return zeroes when there are no check-ins', () => {
    expect(computeCheckInStats([], now, TIMEZONE)).toEqual({
      checkInsThisWeek: 0,
      checkInsThisMonth: 0,
      currentStreak: 0,
      bestStreak: 0,
    })
  })

  it('should count consecutive days ending today', () => {
    const dates = ['2025-10-06', '2025-10-07', '2025-10-08'].map(atNoon)

    expect(computeCheckInStats(dates, now, TIMEZONE).currentStreak).toBe(3)
  })

  it('should keep the streak alive when the user has not trained yet today', () => {
    const dates = ['2025-10-06', '2025-10-07'].map(atNoon)

    expect(computeCheckInStats(dates, now, TIMEZONE).currentStreak).toBe(2)
  })

  it('should reset the current streak after a missed day', () => {
    const dates = ['2025-10-04', '2025-10-05', '2025-10-06'].map(atNoon)

    const stats = computeCheckInStats(dates, now, TIMEZONE)

    expect(stats.currentStreak).toBe(0)
    expect(stats.bestStreak).toBe(3)
  })

  it('should keep the longest streak in history as the best streak', () => {
    const dates = [
      '2025-09-01',
      '2025-09-02',
      '2025-09-03',
      '2025-09-04',
      '2025-10-07',
      '2025-10-08',
    ].map(atNoon)

    const stats = computeCheckInStats(dates, now, TIMEZONE)

    expect(stats.bestStreak).toBe(4)
    expect(stats.currentStreak).toBe(2)
  })

  it('should count check-ins in the current week (from Monday) and month', () => {
    const dates = [
      '2025-09-30', // last month
      '2025-10-03', // this month, last week
      '2025-10-06', // Monday
      '2025-10-08', // today
    ].map(atNoon)

    const stats = computeCheckInStats(dates, now, TIMEZONE)

    expect(stats.checkInsThisWeek).toBe(2)
    expect(stats.checkInsThisMonth).toBe(3)
  })

  it('should use the app timezone to decide the day of a late check-in', () => {
    // 23:30 on Oct 7 in São Paulo is already Oct 8 in UTC
    const lateCheckIn = new Date('2025-10-08T02:30:00Z')
    const today = atNoon('2025-10-08')

    const stats = computeCheckInStats([lateCheckIn, today], now, TIMEZONE)

    expect(stats.currentStreak).toBe(2)
  })
})

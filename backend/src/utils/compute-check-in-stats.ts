import { APP_TIMEZONE, dayjs } from '@/lib/dayjs'

export interface CheckInStats {
  checkInsThisWeek: number
  checkInsThisMonth: number
  /** Consecutive days with a check-in, ending today or yesterday. */
  currentStreak: number
  bestStreak: number
}

const DAY_KEY_FORMAT = 'YYYY-MM-DD'

/**
 * Derives motivational stats from check-in dates. Days are computed in the
 * app timezone so a late-evening check-in counts for the right day. Weeks
 * start on Monday.
 */
export function computeCheckInStats(
  dates: Date[],
  now: Date = new Date(),
  timezone = APP_TIMEZONE,
): CheckInStats {
  const today = dayjs(now).tz(timezone).startOf('day')
  const daysSinceMonday = (today.day() + 6) % 7
  const startOfWeek = today.subtract(daysSinceMonday, 'day')
  const startOfMonth = today.startOf('month')

  const days = dates.map((date) => dayjs(date).tz(timezone).startOf('day'))
  const dayKeys = new Set(days.map((day) => day.format(DAY_KEY_FORMAT)))

  const checkInsThisWeek = days.filter(
    (day) => !day.isBefore(startOfWeek) && !day.isAfter(today),
  ).length

  const checkInsThisMonth = days.filter(
    (day) => !day.isBefore(startOfMonth) && !day.isAfter(today),
  ).length

  return {
    checkInsThisWeek,
    checkInsThisMonth,
    currentStreak: countCurrentStreak(dayKeys, today),
    bestStreak: countBestStreak(dayKeys),
  }
}

function countCurrentStreak(dayKeys: Set<string>, today: dayjs.Dayjs) {
  // A streak is still alive if the user has not trained yet today
  let cursor = dayKeys.has(today.format(DAY_KEY_FORMAT))
    ? today
    : today.subtract(1, 'day')

  let streak = 0

  while (dayKeys.has(cursor.format(DAY_KEY_FORMAT))) {
    streak++
    cursor = cursor.subtract(1, 'day')
  }

  return streak
}

function countBestStreak(dayKeys: Set<string>) {
  const sortedKeys = [...dayKeys].sort()

  let best = 0
  let current = 0
  let previous: dayjs.Dayjs | null = null

  for (const key of sortedKeys) {
    const day = dayjs.utc(key) // UTC avoids DST-shortened days
    const isConsecutive = previous && day.diff(previous, 'day') === 1

    current = isConsecutive ? current + 1 : 1
    best = Math.max(best, current)
    previous = day
  }

  return best
}

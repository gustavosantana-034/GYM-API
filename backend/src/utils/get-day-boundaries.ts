import { APP_TIMEZONE, dayjs } from '@/lib/dayjs'

export function getDayBoundaries(date: Date, timezone = APP_TIMEZONE) {
  const day = dayjs(date).tz(timezone)

  return {
    startOfDay: day.startOf('day').toDate(),
    endOfDay: day.endOf('day').toDate(),
  }
}

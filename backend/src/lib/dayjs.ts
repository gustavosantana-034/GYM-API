import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * Timezone that defines what a "day" is for business rules (one check-in per
 * day, streaks). Read straight from process.env so unit tests do not need the
 * full validated env; `src/env` validates the same variable at boot.
 */
export const APP_TIMEZONE = process.env.APP_TIMEZONE ?? 'America/Sao_Paulo'

export { dayjs }

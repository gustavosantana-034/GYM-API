import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

const kilometerFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
})

/** 72 m → "72 m", 846 m → "850 m", 1.24 km → "1,2 km", 14.6 km → "15 km". */
export function formatDistance(distanceInKm: number) {
  const meters = Math.round(distanceInKm * 1000)

  if (meters < 100) return `${meters} m`

  const roundedMeters = Math.round(meters / 10) * 10

  if (roundedMeters < 1000) return `${roundedMeters} m`

  if (distanceInKm >= 10) return `${Math.round(distanceInKm)} km`

  return `${kilometerFormatter.format(distanceInKm)} km`
}

/** Splits a distance into value and unit, for large typographic displays. */
export function splitDistance(distanceInKm: number) {
  const [value, unit] = formatDistance(distanceInKm).split(' ')
  return { value, unit }
}

export const formatDate = (date: string | Date) =>
  dayjs(date).format('DD/MM/YYYY')

export const formatTime = (date: string | Date) => dayjs(date).format('HH:mm')

export const formatWeekday = (date: string | Date) =>
  dayjs(date).format('dddd')

export const formatMonthYear = (date: string | Date) =>
  dayjs(date).format('MMMM [de] YYYY')

export function getFirstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  const initials = (parts[0]?.[0] ?? '') + (parts.length > 1 ? parts.at(-1)![0] : '')
  return initials.toUpperCase()
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`
}

export { dayjs }

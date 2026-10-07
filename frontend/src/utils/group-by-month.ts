import dayjs from 'dayjs'

export interface MonthGroup<T> {
  key: string
  date: string
  items: T[]
}

/** Groups items (already sorted by date) into consecutive months. */
export function groupByMonth<T extends { created_at: string }>(items: T[]) {
  const groups: MonthGroup<T>[] = []

  for (const item of items) {
    const key = dayjs(item.created_at).format('YYYY-MM')
    const lastGroup = groups.at(-1)

    if (lastGroup?.key === key) {
      lastGroup.items.push(item)
    } else {
      groups.push({ key, date: item.created_at, items: [item] })
    }
  }

  return groups
}

import { describe, expect, it } from 'vitest'
import { groupByMonth } from './group-by-month'

describe('groupByMonth', () => {
  it('groups consecutive items of the same month', () => {
    const items = [
      { id: '1', created_at: '2026-10-07T12:00:00' },
      { id: '2', created_at: '2026-10-02T12:00:00' },
      { id: '3', created_at: '2026-09-28T12:00:00' },
    ]

    const groups = groupByMonth(items)

    expect(groups.map((group) => group.key)).toEqual(['2026-10', '2026-09'])
    expect(groups[0].items.map((item) => item.id)).toEqual(['1', '2'])
  })
})

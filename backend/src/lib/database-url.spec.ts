import { describe, expect, it } from 'vitest'
import { toDirectDatabaseUrl } from './database-url'

describe('toDirectDatabaseUrl', () => {
  it('turns a Neon pooled URL into a direct one', () => {
    expect(
      toDirectDatabaseUrl(
        'postgresql://user:secret@ep-name-123-pooler.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
      ),
    ).toBe(
      'postgresql://user:secret@ep-name-123.c-2.sa-east-1.aws.neon.tech/neondb?sslmode=require&connect_timeout=15',
    )
  })

  it('keeps a connect_timeout that was set explicitly', () => {
    expect(
      toDirectDatabaseUrl(
        'postgresql://user:secret@ep-name-123.c-2.sa-east-1.aws.neon.tech/neondb?connect_timeout=30',
      ),
    ).toContain('connect_timeout=30')
  })

  it('keeps other URLs untouched', () => {
    const local =
      'postgresql://docker:docker@localhost:5433/gym-platform?schema=public'

    expect(toDirectDatabaseUrl(local)).toBe(local)
  })
})

/**
 * Runs `prisma migrate deploy` with a direct database connection, whatever
 * flavour of URL is in DATABASE_URL (see src/lib/database-url.ts). Retries a
 * few times because a sleeping Neon compute can refuse the first attempts.
 */
import 'dotenv/config'
import { spawnSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { toDirectDatabaseUrl } from '../src/lib/database-url'

const ATTEMPTS = 4
const DELAY_IN_MS = 5_000

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const env = {
  ...process.env,
  DATABASE_URL: toDirectDatabaseUrl(process.env.DATABASE_URL),
}

for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  const result = spawnSync(
    'npx',
    ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'],
    { stdio: 'inherit', env },
  )

  if (result.status === 0) process.exit(0)

  if (attempt < ATTEMPTS) {
    console.warn(
      `Migration attempt ${attempt} failed, retrying in ${DELAY_IN_MS / 1000}s (database may be waking up)...`,
    )
    await sleep(DELAY_IN_MS)
  }
}

process.exit(1)

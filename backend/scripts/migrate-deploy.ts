/**
 * Runs `prisma migrate deploy` with a direct database connection, whatever
 * flavour of URL is in DATABASE_URL (see src/lib/database-url.ts).
 */
import 'dotenv/config'
import { spawnSync } from 'node:child_process'
import { toDirectDatabaseUrl } from '../src/lib/database-url'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.')
  process.exit(1)
}

const result = spawnSync(
  'npx',
  ['prisma', 'migrate', 'deploy', '--schema', 'prisma/schema.prisma'],
  {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: toDirectDatabaseUrl(process.env.DATABASE_URL),
    },
  },
)

process.exit(result.status ?? 1)

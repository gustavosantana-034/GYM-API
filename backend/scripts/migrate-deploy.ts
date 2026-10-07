/**
 * Runs `prisma migrate deploy` with a direct database connection, whatever
 * flavour of URL is in DATABASE_URL (see src/lib/database-url.ts). Retries a
 * few times because a sleeping Neon compute can refuse the first attempts.
 */
import 'dotenv/config'
import { spawnSync } from 'node:child_process'
import { lookup } from 'node:dns/promises'
import { connect } from 'node:net'
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

await printDiagnostics(env.DATABASE_URL)
process.exit(1)

/** Explains why the database is unreachable, without printing secrets. */
async function printDiagnostics(databaseUrl: string) {
  console.error('\n--- Database connection diagnostics (no secrets) ---')

  let url: URL
  try {
    url = new URL(databaseUrl)
  } catch {
    console.error(
      'DATABASE_URL is not a valid URL. Check for quotes or spaces around it.',
    )
    return
  }

  const port = Number(url.port || 5432)
  console.error(
    `host: ${url.hostname}  port: ${port}  user: ${url.username}  database: ${url.pathname.slice(1)}`,
  )
  console.error(
    `password length: ${decodeURIComponent(url.password).length}  params: ${[...url.searchParams.keys()].join(', ') || '-'}`,
  )

  if (/\s|"|'/.test(databaseUrl)) {
    console.error('WARNING: DATABASE_URL contains spaces or quotes.')
  }

  try {
    const addresses = await lookup(url.hostname, { all: true })

    for (const { address, family } of addresses) {
      const result = await probe(address, port)
      console.error(`IPv${family} ${address}:${port} -> ${result}`)
    }
  } catch (error) {
    console.error(`DNS lookup failed: ${(error as Error).message}`)
  }
}

function probe(host: string, port: number) {
  return new Promise<string>((resolve) => {
    const socket = connect({ host, port, timeout: 5_000 })
    socket.once('connect', () => {
      socket.destroy()
      resolve('TCP ok')
    })
    socket.once('timeout', () => {
      socket.destroy()
      resolve('timeout')
    })
    socket.once('error', (error) => resolve(`error: ${error.message}`))
  })
}

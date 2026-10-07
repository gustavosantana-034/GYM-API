import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import type { Environment } from 'vitest/environments'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL
    process.env.NODE_ENV = 'test'

    // Creates the tables in an isolated schema for this test file. `db push`
    // is used because the older migrations hard-code the "public" schema.
    // `--skip-generate` keeps parallel test files from racing on the client.
    execSync('npx prisma db push --force-reset --skip-generate', {
      env: { ...process.env, DATABASE_URL: databaseURL },
      stdio: 'pipe',
    })

    return {
      async teardown() {
        // Imported lazily so the client picks up the per-test DATABASE_URL
        const { prisma } = await import('@/lib/prisma')

        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`)
        await prisma.$disconnect()
      },
    }
  },
}

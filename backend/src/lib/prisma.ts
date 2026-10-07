import { env } from '@/env'
import { PrismaClient } from '@prisma/client'
import { toDirectDatabaseUrl } from './database-url'

export const prisma = new PrismaClient({
  datasourceUrl: toDirectDatabaseUrl(env.DATABASE_URL),
  log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

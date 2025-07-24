import 'dotenv/config'
import { z } from 'zod'

// Validate environment variables

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'production', 'test']).default('dev'),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error(' ❌ Invalid enviorment variables', _env.error.format())

  throw new Error(' ❌ Invalid enviorment variables ')
}

export const env = _env.data

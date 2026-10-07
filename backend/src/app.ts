import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { env } from './env'
import { REFRESH_TOKEN_COOKIE } from './http/auth-tokens'
import { checkInRoutes } from './http/controllers/check-ins/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { userRoutes } from './http/controllers/users/routes'
import { errorHandler } from './http/error-handler'

export const app = fastify()

app.register(fastifyCors, {
  origin: env.CORS_ORIGIN,
  credentials: true, // the refresh token travels in a cookie
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: REFRESH_TOKEN_COOKIE,
    signed: false, // the JWT signature already protects its content
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(fastifyCookie)

app.get('/health', async () => ({ status: 'ok' }))

app.register(userRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)

app.setErrorHandler(errorHandler)

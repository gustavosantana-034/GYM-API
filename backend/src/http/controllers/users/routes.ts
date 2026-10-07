import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate.controller'
import { logout } from './logout.controller'
import { profile } from './profile.controller'
import { refresh } from './refresh.controller'
import { register } from './register.controller'

export const userRoutes = async (app: FastifyInstance) => {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.post('/sessions/logout', logout)
  app.patch('/token/refresh', refresh)

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}

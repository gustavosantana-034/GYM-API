import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate.controller'
import { profile } from './controllers/profile.controller'
import { register } from './controllers/register.controller'
import { verifyJwt } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  // Route to create a new user
  app.post('/users', register)

  // Route to make a authenticate
  app.post('/sessions', authenticate)

  // Route to get the profile of the authenticated user

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}

import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { register } from './register.controller'

export const userRoutes = async (app: FastifyInstance) => {
  // Route to create a new user
  app.post('/users', register)

  // Route to make a authenticate
  app.post('/sessions', authenticate)

  // Route to get the profile of the authenticated user

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}

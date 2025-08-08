import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { authenticate } from './authenticate.controller'
import { profile } from './profile.controller'
import { refresh } from './refresh'
import { register } from './register.controller'

export const userRoutes = async (app: FastifyInstance) => {
  // Route to create a new user
  app.post('/users', register)

  // Route to make a authenticate
  app.post('/sessions', authenticate)

  // Route for take a token and get user profile
  app.patch('/token/refresh', refresh)

  // Route to get the profile of the authenticated user

  /** Authenticated */
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}

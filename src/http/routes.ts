import { FastifyInstance } from 'fastify'
import { authenticate } from './controllers/authenticate.controller'
import { register } from './controllers/register.controller'

export async function appRoutes(app: FastifyInstance) {
  // Route to create a new user
  app.post('/users', register)

  // Route to make a authenticate
  app.post('/sessions', authenticate)
}

import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { create } from './create-gym.controller'
import { nearby } from './nearby-gyms.controller'
import { search } from './search-gyms.controller'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  // Create routes

  // To search for gyms
  app.get('/gyms/search', search)

  // To find nearby gyms
  app.get('/gyms/nearby', nearby)

  // To create a new gym
  app.post('/gyms', create)
}

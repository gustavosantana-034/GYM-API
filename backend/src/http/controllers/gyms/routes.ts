import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { create } from './create-gym.controller'
import { show } from './get-gym.controller'
import { nearby } from './nearby-gyms.controller'
import { search } from './search-gyms.controller'
import { update } from './update-gym.controller'

export const gymsRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.get('/gyms/:gymId', show)

  /** Admin only */
  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
  app.put('/gyms/:gymId', { onRequest: [verifyUserRole('ADMIN')] }, update)
}

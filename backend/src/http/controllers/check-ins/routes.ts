import { verifyUserRole } from '@/http/middlewares/verify-user-role'
import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'
import { history } from './check-in-history.controller'
import { metrics } from './check-in-metrics.controller'
import { create } from './create-check-in.controller'
import { list } from './fetch-check-ins.controller'
import { validate } from './validate-check-in.controller'

export const checkInRoutes = async (app: FastifyInstance) => {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)

  /** Admin only */
  app.get('/check-ins', { onRequest: [verifyUserRole('ADMIN')] }, list)
  app.patch(
    '/check-ins/:checkInId/validate',
    { onRequest: [verifyUserRole('ADMIN')] },
    validate,
  )
}

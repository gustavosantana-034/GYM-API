import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middlewares/verify-jwt'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
}

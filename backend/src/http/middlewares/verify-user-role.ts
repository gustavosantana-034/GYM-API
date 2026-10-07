import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export const verifyUserRole = (roleToVerify: Role) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user

    // The user is authenticated (verifyJwt ran first) but not allowed: 403
    if (role !== roleToVerify) {
      return reply.status(403).send({
        message: 'Forbidden.',
      })
    }
  }
}

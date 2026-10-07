import { clearRefreshTokenCookie } from '@/http/auth-tokens'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function logout(_: FastifyRequest, reply: FastifyReply) {
  clearRefreshTokenCookie(reply)

  return reply.status(204).send()
}

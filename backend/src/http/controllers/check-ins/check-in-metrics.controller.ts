import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const GetUserMetricsUseCase = makeGetUserMetricsUseCase()

  const { checkInsCount } = await GetUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}

import { pageSchema } from '@/http/schemas'
import { makeFetchCheckInsUseCase } from '@/use-cases/factories/make-fetch-check-ins-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const list = async (request: FastifyRequest, reply: FastifyReply) => {
  const fetchCheckInsQuerySchema = z.object({
    status: z.enum(['pending', 'validated']).optional(),
    page: pageSchema,
  })

  const { status, page } = fetchCheckInsQuerySchema.parse(request.query)

  const fetchCheckInsUseCase = makeFetchCheckInsUseCase()

  const { checkIns } = await fetchCheckInsUseCase.execute({ status, page })

  return reply.status(200).send({
    checkIns,
  })
}

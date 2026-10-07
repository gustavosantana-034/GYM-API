import { presentGym } from '@/http/presenters/gym-presenter'
import { modalitySchema, pageSchema } from '@/http/schemas'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymsQueryParamsSchema = z.object({
    query: z.string().trim().max(100).optional(),
    modality: modalitySchema.optional(),
    page: pageSchema,
  })

  const { query, modality, page } = searchGymsQueryParamsSchema.parse(
    request.query,
  )

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    query,
    modality,
    page,
  })

  return reply.status(200).send({
    gyms: gyms.map(presentGym),
  })
}

import { presentGym } from '@/http/presenters/gym-presenter'
import { gymBodySchema } from '@/http/schemas'
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export const create = async (request: FastifyRequest, reply: FastifyReply) => {
  const data = gymBodySchema.parse(request.body)

  const createGymUseCase = makeCreateGymUseCase()

  const { gym } = await createGymUseCase.execute(data)

  return reply.status(201).send({
    gym: presentGym(gym),
  })
}

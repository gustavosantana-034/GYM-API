import { presentGym } from '@/http/presenters/gym-presenter'
import { makeGetGymUseCase } from '@/use-cases/factories/make-get-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const show = async (request: FastifyRequest, reply: FastifyReply) => {
  const getGymParamsSchema = z.object({
    gymId: z.uuid(),
  })

  const { gymId } = getGymParamsSchema.parse(request.params)

  const getGymUseCase = makeGetGymUseCase()

  const { gym } = await getGymUseCase.execute({ gymId })

  return reply.status(200).send({
    gym: presentGym(gym),
  })
}

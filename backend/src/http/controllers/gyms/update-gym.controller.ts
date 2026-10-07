import { presentGym } from '@/http/presenters/gym-presenter'
import { gymBodySchema } from '@/http/schemas'
import { makeUpdateGymUseCase } from '@/use-cases/factories/make-update-gym-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const update = async (request: FastifyRequest, reply: FastifyReply) => {
  const updateGymParamsSchema = z.object({
    gymId: z.uuid(),
  })

  const { gymId } = updateGymParamsSchema.parse(request.params)
  const data = gymBodySchema.parse(request.body)

  const updateGymUseCase = makeUpdateGymUseCase()

  const { gym } = await updateGymUseCase.execute({ gymId, ...data })

  return reply.status(200).send({
    gym: presentGym(gym),
  })
}

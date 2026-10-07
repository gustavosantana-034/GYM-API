import { issueAuthTokens } from '@/http/auth-tokens'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().trim().min(1),
    email: z.email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  const registerUseCase = makeRegisterUseCase()

  const { user } = await registerUseCase.execute({
    name,
    email,
    password,
  })

  const { token } = await issueAuthTokens(reply, user)

  return reply.status(201).send({
    token,
  })
}

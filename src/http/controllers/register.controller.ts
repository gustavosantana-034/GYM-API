import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { EmailAlreadyExists } from '@/use-cases/errors/email-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().nonempty(), // the fields should not be empty
    email: z.string().nonempty(), // the fields should not be empty
    password: z.string().nonempty().min(6), // the fields should not be empty
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const userRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    if (error instanceof EmailAlreadyExists) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }

  return reply.status(201).send()
}

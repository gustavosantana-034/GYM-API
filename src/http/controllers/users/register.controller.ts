import { EmailAlreadyExists } from '@/use-cases/errors/email-already-exists-error'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '../../../use-cases/factories/make-register-use-case'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().nonempty(), // the fields should not be empty
    email: z.string().nonempty(), // the fields should not be empty
    password: z.string().nonempty().min(6), // the fields should not be empty
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    const { user } = await registerUseCase.execute({
      name,
      email,
      password,
    })

    const token = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
        },
      },
    )

    const refreshToken = await reply.jwtSign(
      {
        role: user.role,
      },
      {
        sign: {
          sub: user.id,
          expiresIn: '7d', // refresh token expires in 7 days
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // use secure cookies in production
        sameSite: true, // prevent CSRF attacks
        httpOnly: true, // prevent JavaScript access to the cookie
      })
      .status(201)
      .send({
        token,
        refreshToken,
      })
  } catch (error) {
    if (error instanceof EmailAlreadyExists) {
      return reply.status(409).send({
        message: error.message,
      })
    }

    throw error
  }
}

import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfileUseCase()

  const { user } = await getUserProfile.execute({
    userId: request.user.sub, // The user ID is stored in the JWT token
  })

  return reply.status(200).send({
    user: {
      ...user,
      password_hash: undefined, // Exclude sensitive information
    },
  })
}

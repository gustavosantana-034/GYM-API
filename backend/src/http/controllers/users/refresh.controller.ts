import { clearRefreshTokenCookie, issueAuthTokens } from '@/http/auth-tokens'
import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify({ onlyCookie: true })
  } catch {
    clearRefreshTokenCookie(reply)

    return reply.status(401).send({ message: 'Invalid refresh token.' })
  }

  try {
    // Reload the user so a deleted account or a changed role is honoured
    // instead of trusting the role frozen inside the refresh token.
    const getUserProfile = makeGetUserProfileUseCase()
    const { user } = await getUserProfile.execute({ userId: request.user.sub })

    const { token } = await issueAuthTokens(reply, user)

    return reply.status(200).send({
      token,
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      clearRefreshTokenCookie(reply)

      return reply.status(401).send({ message: 'Invalid refresh token.' })
    }

    throw error
  }
}

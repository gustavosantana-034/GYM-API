import { Role } from '@prisma/client'
import { FastifyReply } from 'fastify'
import { env } from '@/env'

export const REFRESH_TOKEN_COOKIE = 'refreshToken'

const REFRESH_TOKEN_TTL_IN_SECONDS = 60 * 60 * 24 * 7 // 7 days

const refreshTokenCookieOptions = {
  path: '/',
  httpOnly: true, // not readable from JavaScript
  // Browsers only keep `secure` cookies over HTTPS (localhost excepted), so it
  // is enabled where the API is actually served over HTTPS.
  secure: env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: REFRESH_TOKEN_TTL_IN_SECONDS,
} as const

interface TokenSubject {
  id: string
  role: Role
}

/**
 * Signs a short-lived access token (returned in the body) and a refresh token
 * (stored in an httpOnly cookie). Both carry the user's role.
 */
export async function issueAuthTokens(reply: FastifyReply, user: TokenSubject) {
  const token = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id } },
  )

  const refreshToken = await reply.jwtSign(
    { role: user.role },
    { sign: { sub: user.id, expiresIn: REFRESH_TOKEN_TTL_IN_SECONDS } },
  )

  reply.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOptions)

  return { token }
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie(REFRESH_TOKEN_COOKIE, {
    path: refreshTokenCookieOptions.path,
    httpOnly: refreshTokenCookieOptions.httpOnly,
    secure: refreshTokenCookieOptions.secure,
    sameSite: refreshTokenCookieOptions.sameSite,
  })
}

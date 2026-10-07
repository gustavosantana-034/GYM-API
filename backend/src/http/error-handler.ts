import { env } from '@/env'
import { CheckInAlreadyValidatedError } from '@/use-cases/errors/check-in-already-validated-error'
import { EmailAlreadyExists } from '@/use-cases/errors/email-already-exists-error'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { LateCheckInValidationError } from '@/use-cases/errors/late-check-in-validation-error'
import { MaxDistanceError } from '@/use-cases/errors/max-distance-error'
import { MaxNumberOfCheckInsError } from '@/use-cases/errors/max-number-of-check-ins-error'
import { PlacesProviderUnavailableError } from '@/use-cases/errors/places-provider-unavailable-error'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { ZodError, z } from 'zod'

type DomainErrorClass = new (...args: never[]) => Error

/**
 * HTTP status for each domain error. Use cases stay unaware of HTTP; this is
 * the single place where the translation happens.
 */
const domainErrorStatus = new Map<DomainErrorClass, number>([
  [InvalidCredentialsError, 401],
  [ResourceNotFoundError, 404],
  [EmailAlreadyExists, 409],
  [MaxNumberOfCheckInsError, 409],
  [CheckInAlreadyValidatedError, 409],
  [MaxDistanceError, 422],
  [LateCheckInValidationError, 422],
  [PlacesProviderUnavailableError, 503],
])

function getDomainErrorStatus(error: Error) {
  for (const [ErrorClass, status] of domainErrorStatus) {
    if (error instanceof ErrorClass) {
      return status
    }
  }

  return null
}

export function errorHandler(
  error: FastifyError,
  _: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: z.flattenError(error).fieldErrors,
    })
  }

  const domainStatus = getDomainErrorStatus(error)

  if (domainStatus) {
    return reply.status(domainStatus).send({ message: error.message })
  }

  // Errors raised by Fastify itself or its plugins (malformed JSON, invalid
  // or missing JWT, payload too large...) already carry a 4xx status code.
  if (error.statusCode && error.statusCode < 500) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'test') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error' })
}

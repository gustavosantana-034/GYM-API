import { presentGym } from '@/http/presenters/gym-presenter'
import { latitudeSchema, longitudeSchema } from '@/http/schemas'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case'
import {
  DEFAULT_NEARBY_RADIUS_IN_KM,
  MAX_NEARBY_RADIUS_IN_KM,
} from '@/use-cases/fetch-nearby-gyms'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearbyGymsQuerySchema = z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    radius: z.coerce
      .number()
      .positive()
      .max(MAX_NEARBY_RADIUS_IN_KM)
      .default(DEFAULT_NEARBY_RADIUS_IN_KM),
  })

  const { latitude, longitude, radius } = nearbyGymsQuerySchema.parse(
    request.query,
  )

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    radiusInKm: radius,
  })

  return reply.status(200).send({
    gyms: gyms.map(presentGym),
  })
}

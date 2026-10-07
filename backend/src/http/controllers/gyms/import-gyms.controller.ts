import { latitudeSchema, longitudeSchema } from '@/http/schemas'
import { makeImportNearbyGymsUseCase } from '@/use-cases/factories/make-import-nearby-gyms-use-case'
import { MAX_IMPORT_RADIUS_IN_KM } from '@/use-cases/import-nearby-gyms-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const importGyms = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const importGymsBodySchema = z.object({
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    radius: z.coerce
      .number()
      .positive()
      .max(MAX_IMPORT_RADIUS_IN_KM)
      .default(10),
  })

  const { latitude, longitude, radius } = importGymsBodySchema.parse(
    request.body,
  )

  const importNearbyGymsUseCase = makeImportNearbyGymsUseCase()

  const result = await importNearbyGymsUseCase.execute({
    latitude,
    longitude,
    radiusInKm: radius,
  })

  return reply.status(200).send(result)
}

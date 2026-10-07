import { Modality } from '@prisma/client'
import { z } from 'zod'

export const latitudeSchema = z.coerce.number().min(-90).max(90)
export const longitudeSchema = z.coerce.number().min(-180).max(180)

export const pageSchema = z.coerce.number().int().min(1).default(1)

export const modalitySchema = z.enum(Modality)

/** Optional text field: empty strings are stored as null. */
export const optionalTextSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => value || null)

export const gymBodySchema = z.object({
  title: z.string().trim().min(1),
  description: optionalTextSchema,
  phone: optionalTextSchema,
  address: optionalTextSchema,
  modalities: z.array(modalitySchema).default([]),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
})

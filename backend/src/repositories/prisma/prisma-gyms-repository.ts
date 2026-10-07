import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNearbyParams,
  GymsRepository,
  MAX_NEARBY_RESULTS,
  SearchManyParams,
} from '../gyms-repository'

const PAGE_SIZE = 20

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string) {
    return prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyByOsmIds(osmIds: string[]) {
    if (osmIds.length === 0) return []

    return prisma.gym.findMany({
      where: { osm_id: { in: osmIds } },
    })
  }

  async findManyNearby({
    latitude,
    longitude,
    radiusInKm,
  }: FindManyNearbyParams) {
    // Spherical law of cosines. The acos argument is clamped to [-1, 1]
    // because floating point error can push it slightly above 1 when the
    // user stands exactly on the gym coordinates, which makes Postgres throw.
    const nearby = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM (
        SELECT id, 6371 * acos(LEAST(1, GREATEST(-1,
          cos(radians(${latitude})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(latitude))
        ))) AS distance
        FROM gyms
      ) AS gyms_with_distance
      WHERE distance <= ${radiusInKm}
      ORDER BY distance
      LIMIT ${MAX_NEARBY_RESULTS}
    `

    if (nearby.length === 0) {
      return []
    }

    const ids = nearby.map((gym) => gym.id)

    const gyms = await prisma.gym.findMany({
      where: { id: { in: ids } },
    })

    // Restore the distance ordering from the raw query
    return gyms.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id))
  }

  async searchMany({ query, modality, page }: SearchManyParams) {
    const where: Prisma.GymWhereInput = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { address: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (modality) {
      where.modalities = { has: modality }
    }

    return prisma.gym.findMany({
      where,
      orderBy: { title: 'asc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })
  }

  async create(data: Prisma.GymCreateInput) {
    return prisma.gym.create({
      data,
    })
  }

  async save(gym: Gym) {
    const { id, ...data } = gym

    return prisma.gym.update({
      where: { id },
      data,
    })
  }
}

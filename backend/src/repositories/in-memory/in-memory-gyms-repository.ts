import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { Gym, Modality, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  FindManyNearbyParams,
  GymsRepository,
  SearchManyParams,
} from '../gyms-repository'

const PAGE_SIZE = 20

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async findManyNearby({
    latitude,
    longitude,
    radiusInKm,
  }: FindManyNearbyParams) {
    return this.items
      .map((gym) => ({
        gym,
        distance: getDistanceBetweenCoordinates(
          { latitude, longitude },
          {
            latitude: gym.latitude.toNumber(),
            longitude: gym.longitude.toNumber(),
          },
        ),
      }))
      .filter(({ distance }) => distance <= radiusInKm)
      .sort((a, b) => a.distance - b.distance)
      .map(({ gym }) => gym)
  }

  async searchMany({ query, modality, page }: SearchManyParams) {
    const normalizedQuery = query?.toLowerCase()

    return this.items
      .filter((gym) => {
        const matchesQuery =
          !normalizedQuery ||
          gym.title.toLowerCase().includes(normalizedQuery) ||
          gym.address?.toLowerCase().includes(normalizedQuery)

        const matchesModality = !modality || gym.modalities.includes(modality)

        return matchesQuery && matchesModality
      })
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      address: data.address ?? null,
      modalities: Array.isArray(data.modalities)
        ? (data.modalities as Modality[])
        : [],
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async save(gym: Gym) {
    const gymIndex = this.items.findIndex((item) => item.id === gym.id)

    if (gymIndex >= 0) {
      this.items[gymIndex] = gym
    }

    return gym
  }
}

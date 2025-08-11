import { prisma } from '@/lib/prisma'
import { Gym, Prisma } from 'generated/prisma'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async finbById(id: string) {
    // sourcery skip: inline-immediately-returned-variable
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findManyNearby({ latitude, longitude }: FindManyNearbyParams) {
    // sourcery skip: inline-immediately-returned-variable
    const gyms = await prisma.$queryRaw<Gym[]>`
    
         SELECT * from gyms
         WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) 
        - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    
    `

    return gyms
  }

  async searchMany(query: string, page: number) {
    // sourcery skip: inline-immediately-returned-variable
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return gyms
  }

  async create(data: Prisma.GymCreateInput) {
    // sourcery skip: inline-immediately-returned-variable
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }
}

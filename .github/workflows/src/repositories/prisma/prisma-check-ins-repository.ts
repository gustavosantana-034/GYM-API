import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'
import { CheckIn, Prisma } from 'generated/prisma'
import { CheckInsRepository } from '../check-ins-repository'

export class PrimsaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    // sourcery skip: inline-immediately-returned-variable
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn
  }

  async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    // sourcery skip: inline-immediately-returned-variable
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async save(data: CheckIn) {
    // sourcery skip: inline-immediately-returned-variable
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },

      data,
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    // sourcery skip: inline-immediately-returned-variable
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },

      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    // sourcery skip: inline-immediately-returned-variable
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    // sourcery skip: inline-immediately-returned-variable
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return count
  }
}

import { prisma } from '@/lib/prisma'
import { getDayBoundaries } from '@/utils/get-day-boundaries'
import { CheckIn, Prisma } from '@prisma/client'
import {
  CheckInsRepository,
  FindManyCheckInsParams,
} from '../check-ins-repository'

const PAGE_SIZE = 20

const gymSummary = { select: { id: true, title: true, address: true } }
const userSummary = { select: { id: true, name: true, email: true } }

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string) {
    return prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    return prisma.checkIn.create({
      data,
    })
  }

  async save(checkIn: CheckIn) {
    return prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: {
        validated_at: checkIn.validated_at,
      },
    })
  }

  async findManyByUserId(userId: string, page: number) {
    return prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      include: { gym: gymSummary },
      orderBy: { created_at: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })
  }

  async findMany({ status, page }: FindManyCheckInsParams) {
    const where: Prisma.CheckInWhereInput = {}

    if (status === 'pending') {
      where.validated_at = null
    }

    if (status === 'validated') {
      where.validated_at = { not: null }
    }

    return prisma.checkIn.findMany({
      where,
      include: { gym: gymSummary, user: userSummary },
      orderBy: { created_at: 'desc' },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    })
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const { startOfDay, endOfDay } = getDayBoundaries(date)

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    })
  }

  async countByUserId(userId: string) {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async findDatesByUserId(userId: string) {
    const checkIns = await prisma.checkIn.findMany({
      where: { user_id: userId },
      select: { created_at: true },
      orderBy: { created_at: 'asc' },
    })

    return checkIns.map((checkIn) => checkIn.created_at)
  }
}

import { getDayBoundaries } from '@/utils/get-day-boundaries'
import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import {
  CheckInsRepository,
  CheckInWithGym,
  CheckInWithGymAndUser,
  FindManyCheckInsParams,
} from '../check-ins-repository'
import { InMemoryGymsRepository } from './in-memory-gyms-repository'
import { InMemoryUsersRepository } from './in-memory-users-repository'

const PAGE_SIZE = 20

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkInsItems: CheckIn[] = []

  // Related repositories emulate the joins the Prisma implementation does
  constructor(
    private gymsRepository = new InMemoryGymsRepository(),
    private usersRepository = new InMemoryUsersRepository(),
  ) {}

  async findById(id: string) {
    const checkIn = this.checkInsItems.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const { startOfDay, endOfDay } = getDayBoundaries(date)

    const checkInOnTheSameDate = this.checkInsItems.find((checkIn) => {
      const isOnSameDate =
        checkIn.created_at >= startOfDay && checkIn.created_at <= endOfDay

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnTheSameDate) {
      return null
    }

    return checkInOnTheSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.mostRecentFirst(
      this.checkInsItems.filter((checkIn) => checkIn.user_id === userId),
    )
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      .map((checkIn) => this.withGym(checkIn))
  }

  async findMany({ status, page }: FindManyCheckInsParams) {
    const filtered = this.checkInsItems.filter((checkIn) => {
      if (status === 'pending') return checkIn.validated_at === null
      if (status === 'validated') return checkIn.validated_at !== null
      return true
    })

    return this.mostRecentFirst(filtered)
      .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      .map((checkIn) => this.withGymAndUser(checkIn))
  }

  async countByUserId(userId: string) {
    return this.checkInsItems.filter((checkIn) => checkIn.user_id === userId)
      .length
  }

  async findDatesByUserId(userId: string) {
    return this.checkInsItems
      .filter((checkIn) => checkIn.user_id === userId)
      .map((checkIn) => checkIn.created_at)
      .sort((a, b) => a.getTime() - b.getTime())
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: data.id ?? randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: data.created_at ? new Date(data.created_at) : new Date(),
    }

    this.checkInsItems.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkInsItems.findIndex(
      (item) => item.id === checkIn.id,
    )

    if (checkInIndex >= 0) {
      this.checkInsItems[checkInIndex] = checkIn
    }

    return checkIn
  }

  private mostRecentFirst(checkIns: CheckIn[]) {
    return [...checkIns].sort(
      (a, b) => b.created_at.getTime() - a.created_at.getTime(),
    )
  }

  private withGym(checkIn: CheckIn): CheckInWithGym {
    const gym = this.gymsRepository.items.find(
      (item) => item.id === checkIn.gym_id,
    )

    return {
      ...checkIn,
      gym: {
        id: checkIn.gym_id,
        title: gym?.title ?? '',
        address: gym?.address ?? null,
      },
    }
  }

  private withGymAndUser(checkIn: CheckIn): CheckInWithGymAndUser {
    const user = this.usersRepository.userItems.find(
      (item) => item.id === checkIn.user_id,
    )

    return {
      ...this.withGym(checkIn),
      user: {
        id: checkIn.user_id,
        name: user?.name ?? '',
        email: user?.email ?? '',
      },
    }
  }
}

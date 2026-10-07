import { CheckIn, Gym, Prisma, User } from '@prisma/client'

export type CheckInWithGym = CheckIn & {
  gym: Pick<Gym, 'id' | 'title' | 'address'>
}

export type CheckInWithGymAndUser = CheckInWithGym & {
  user: Pick<User, 'id' | 'name' | 'email'>
}

export type CheckInStatus = 'pending' | 'validated'

export interface FindManyCheckInsParams {
  status?: CheckInStatus
  page: number
}

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  /** Most recent first, with the gym each check-in belongs to. */
  findManyByUserId(userId: string, page: number): Promise<CheckInWithGym[]>
  /** Every check-in on the platform, most recent first (admin listing). */
  findMany(params: FindManyCheckInsParams): Promise<CheckInWithGymAndUser[]>
  countByUserId(userId: string): Promise<number>
  /** Creation dates only, used to compute streaks and periods. */
  findDatesByUserId(userId: string): Promise<Date[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}

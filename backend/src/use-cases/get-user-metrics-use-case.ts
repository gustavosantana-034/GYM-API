import {
  CheckInStats,
  computeCheckInStats,
} from '@/utils/compute-check-in-stats'
import { CheckInsRepository } from '../repositories/check-ins-repository'

interface GetUserMetricsUseCaseRequest {
  userId: string
}

interface GetUserMetricsUseCaseResponse extends CheckInStats {
  checkInsCount: number
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse> {
    const [checkInsCount, checkInDates] = await Promise.all([
      this.checkInsRepository.countByUserId(userId),
      this.checkInsRepository.findDatesByUserId(userId),
    ])

    return {
      checkInsCount,
      ...computeCheckInStats(checkInDates),
    }
  }
}

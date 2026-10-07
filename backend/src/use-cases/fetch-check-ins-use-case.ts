import {
  CheckInsRepository,
  CheckInStatus,
  CheckInWithGymAndUser,
} from '../repositories/check-ins-repository'

interface FetchCheckInsUseCaseRequest {
  status?: CheckInStatus
  page: number
}

interface FetchCheckInsUseCaseResponse {
  checkIns: CheckInWithGymAndUser[]
}

/** Lists check-ins across all users, so admins can find the ones to validate. */
export class FetchCheckInsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    status,
    page,
  }: FetchCheckInsUseCaseRequest): Promise<FetchCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findMany({ status, page })

    return {
      checkIns,
    }
  }
}

import type {
  CheckIn,
  CheckInWithGym,
  CheckInWithGymAndUser,
  UserMetrics,
} from '@/types/api'
import type { Coordinates } from '@/types/geo'
import { api } from '../client'

export type CheckInStatus = 'pending' | 'validated'

export async function createCheckIn(gymId: string, position: Coordinates) {
  const { data } = await api.post<{ checkIn: CheckIn }>(
    `/gyms/${gymId}/check-ins`,
    position,
  )
  return data.checkIn
}

export async function fetchCheckInHistory(page: number) {
  const { data } = await api.get<{ checkIns: CheckInWithGym[] }>(
    '/check-ins/history',
    { params: { page } },
  )
  return data.checkIns
}

export async function fetchMetrics() {
  const { data } = await api.get<UserMetrics>('/check-ins/metrics')
  return data
}

export async function fetchAllCheckIns(params: {
  status?: CheckInStatus
  page: number
}) {
  const { data } = await api.get<{ checkIns: CheckInWithGymAndUser[] }>(
    '/check-ins',
    { params },
  )
  return data.checkIns
}

export async function validateCheckIn(checkInId: string) {
  await api.patch(`/check-ins/${checkInId}/validate`)
}

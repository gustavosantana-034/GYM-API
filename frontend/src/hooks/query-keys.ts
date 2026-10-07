import type { CheckInStatus } from '@/api/services/check-ins'
import type { NearbyGymsParams, SearchGymsParams } from '@/api/services/gyms'

/** Every query key in one place, so invalidations stay consistent. */
export const queryKeys = {
  gyms: {
    all: ['gyms'] as const,
    nearby: (params: NearbyGymsParams) => ['gyms', 'nearby', params] as const,
    search: (params: Omit<SearchGymsParams, 'page'>) => ['gyms', 'search', params] as const,
    detail: (gymId: string) => ['gyms', 'detail', gymId] as const,
  },
  checkIns: {
    all: ['check-ins'] as const,
    history: ['check-ins', 'history'] as const,
    metrics: ['check-ins', 'metrics'] as const,
    admin: (status?: CheckInStatus) => ['check-ins', 'admin', status ?? 'all'] as const,
  },
}

import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCheckIn,
  fetchAllCheckIns,
  fetchCheckInHistory,
  fetchMetrics,
  validateCheckIn,
  type CheckInStatus,
} from '@/api/services/check-ins'
import { PAGE_SIZE } from '@/types/api'
import type { Coordinates } from '@/types/geo'
import { queryKeys } from './query-keys'

const nextPage = <T,>(lastPage: T[], _: T[][], lastPageParam: number) =>
  lastPage.length === PAGE_SIZE ? lastPageParam + 1 : undefined

export function useMetrics() {
  return useQuery({
    queryKey: queryKeys.checkIns.metrics,
    queryFn: fetchMetrics,
  })
}

export function useCheckInHistory() {
  return useInfiniteQuery({
    queryKey: queryKeys.checkIns.history,
    queryFn: ({ pageParam }) => fetchCheckInHistory(pageParam),
    initialPageParam: 1,
    getNextPageParam: nextPage,
  })
}

export function useCreateCheckIn(gymId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (position: Coordinates) => createCheckIn(gymId, position),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.checkIns.all }),
  })
}

export function useAdminCheckIns(status?: CheckInStatus) {
  return useInfiniteQuery({
    queryKey: queryKeys.checkIns.admin(status),
    queryFn: ({ pageParam }) => fetchAllCheckIns({ status, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    // Pending check-ins expire after 20 minutes: keep the list fresh
    refetchInterval: 60_000,
  })
}

export function useValidateCheckIn() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: validateCheckIn,
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.checkIns.all }),
  })
}

import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  fetchNearbyGyms,
  getGym,
  importNearbyGyms,
  searchGyms,
  type NearbyGymsParams,
  type SearchGymsParams,
} from '@/api/services/gyms'
import { PAGE_SIZE } from '@/types/api'
import { queryKeys } from './query-keys'

/** Coordinates are rounded so tiny GPS jitter does not refetch. */
function roundCoordinate(value: number) {
  return Math.round(value * 10_000) / 10_000
}

export function useNearbyGyms(params: NearbyGymsParams | null) {
  const roundedParams = params && {
    latitude: roundCoordinate(params.latitude),
    longitude: roundCoordinate(params.longitude),
    radius: params.radius,
  }

  return useQuery({
    queryKey: queryKeys.gyms.nearby(roundedParams ?? { latitude: 0, longitude: 0 }),
    queryFn: () => fetchNearbyGyms(roundedParams!),
    enabled: roundedParams !== null,
    placeholderData: keepPreviousData,
  })
}

export function useGymSearch(params: Omit<SearchGymsParams, 'page'>, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.gyms.search(params),
    queryFn: ({ pageParam }) => searchGyms({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _, lastPageParam) =>
      lastPage.length === PAGE_SIZE ? lastPageParam + 1 : undefined,
    enabled,
    placeholderData: keepPreviousData,
  })
}

export function useGym(gymId: string) {
  return useQuery({
    queryKey: queryKeys.gyms.detail(gymId),
    queryFn: () => getGym(gymId),
  })
}

export function useImportNearbyGyms() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importNearbyGyms,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all }),
  })
}

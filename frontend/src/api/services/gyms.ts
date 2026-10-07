import type { Gym, ImportGymsResult, Modality } from '@/types/api'
import type { Coordinates } from '@/types/geo'
import { api } from '../client'

export interface SearchGymsParams {
  query?: string
  modality?: Modality
  page?: number
}

export interface NearbyGymsParams extends Coordinates {
  radius?: number
}

export type GymInput = Omit<Gym, 'id' | 'created_at' | 'source' | 'osm_id'>

export async function searchGyms(params: SearchGymsParams) {
  const { data } = await api.get<{ gyms: Gym[] }>('/gyms/search', { params })
  return data.gyms
}

export async function fetchNearbyGyms(params: NearbyGymsParams) {
  const { data } = await api.get<{ gyms: Gym[] }>('/gyms/nearby', { params })
  return data.gyms
}

export async function getGym(gymId: string) {
  const { data } = await api.get<{ gym: Gym }>(`/gyms/${gymId}`)
  return data.gym
}

export async function createGym(input: GymInput) {
  const { data } = await api.post<{ gym: Gym }>('/gyms', input)
  return data.gym
}

export async function updateGym(gymId: string, input: GymInput) {
  const { data } = await api.put<{ gym: Gym }>(`/gyms/${gymId}`, input)
  return data.gym
}

/** Imports real gyms from OpenStreetMap around a point (admin only). */
export async function importNearbyGyms(params: NearbyGymsParams) {
  const { data } = await api.post<ImportGymsResult>('/gyms/import', params, {
    // The OpenStreetMap servers can take up to a minute, with retries
    timeout: 300_000,
  })
  return data
}

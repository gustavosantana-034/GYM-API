/** Shapes returned by the Gym Platform API (see backend/docs/API.md). */

export type Role = 'ADMIN' | 'MEMBER'

export const MODALITIES = [
  'WEIGHT_TRAINING',
  'CROSSFIT',
  'FUNCTIONAL',
  'YOGA',
  'PILATES',
  'SWIMMING',
  'MARTIAL_ARTS',
  'DANCE',
] as const

export type Modality = (typeof MODALITIES)[number]

export interface User {
  id: string
  name: string
  email: string
  role: Role
  created_at: string
}

export interface Gym {
  id: string
  title: string
  description: string | null
  phone: string | null
  address: string | null
  modalities: Modality[]
  latitude: number
  longitude: number
  /** "osm" gyms were imported from OpenStreetMap and must credit it */
  source: 'osm' | 'manual'
  osm_id: string | null
  created_at: string
}

export interface ImportGymsResult {
  found: number
  created: number
  updated: number
}

export interface CheckIn {
  id: string
  user_id: string
  gym_id: string
  created_at: string
  validated_at: string | null
}

export interface CheckInWithGym extends CheckIn {
  gym: Pick<Gym, 'id' | 'title' | 'address'>
}

export interface CheckInWithGymAndUser extends CheckInWithGym {
  user: Pick<User, 'id' | 'name' | 'email'>
}

export interface UserMetrics {
  checkInsCount: number
  checkInsThisWeek: number
  checkInsThisMonth: number
  currentStreak: number
  bestStreak: number
}

export interface AuthResponse {
  token: string
}

export interface ApiErrorBody {
  message: string
  issues?: Record<string, string[]>
}

export const PAGE_SIZE = 20

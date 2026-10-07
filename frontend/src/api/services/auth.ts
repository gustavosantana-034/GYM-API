import type { AuthResponse, User } from '@/types/api'
import { api } from '../client'

export interface Credentials {
  email: string
  password: string
}

export interface RegisterData extends Credentials {
  name: string
}

export async function login(credentials: Credentials) {
  const { data } = await api.post<AuthResponse>('/sessions', credentials)
  return data
}

export async function register(data: RegisterData) {
  const response = await api.post<AuthResponse>('/users', data)
  return response.data
}

export async function logout() {
  await api.post('/sessions/logout')
}

export async function getProfile() {
  const { data } = await api.get<{ user: User }>('/me')
  return data.user
}

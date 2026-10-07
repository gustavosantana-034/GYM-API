import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { AuthResponse } from '@/types/api'
import { tokenStore } from './token-store'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  withCredentials: true, // sends the httpOnly refresh token cookie
  // The free API instance sleeps when idle and takes ~50s to wake up
  timeout: 70_000,
})

/**
 * Wakes the API up as soon as the app opens, so it is likely awake by the
 * time the user signs in.
 */
export function warmUpApi() {
  api.get('/health').catch(() => undefined)
}

api.interceptors.request.use((config) => {
  const token = tokenStore.get()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/** Routes where a 401 means "wrong credentials", not "token expired". */
const AUTH_ROUTES = ['/sessions', '/users', '/token/refresh']

let refreshRequest: Promise<string> | null = null

/**
 * Exchanges the refresh cookie for a new access token. Concurrent callers
 * share the same request, so a burst of 401s triggers a single refresh.
 */
export function refreshAccessToken() {
  refreshRequest ??= api
    .patch<AuthResponse>('/token/refresh')
    .then(({ data }) => {
      tokenStore.set(data.token)
      return data.token
    })
    .finally(() => {
      refreshRequest = null
    })

  return refreshRequest
}

type SessionExpiredListener = () => void

const sessionExpiredListeners = new Set<SessionExpiredListener>()

export function onSessionExpired(listener: SessionExpiredListener) {
  sessionExpiredListeners.add(listener)

  return () => {
    sessionExpiredListeners.delete(listener)
  }
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  const isAuthRoute = AUTH_ROUTES.some((route) => config?.url === route)

  if (error.response?.status !== 401 || !config || config._retried || isAuthRoute) {
    throw error
  }

  config._retried = true

  try {
    await refreshAccessToken()
  } catch {
    tokenStore.set(null)
    sessionExpiredListeners.forEach((listener) => listener())
    throw error
  }

  return api(config)
})

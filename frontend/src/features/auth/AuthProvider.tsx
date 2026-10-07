import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { onSessionExpired, refreshAccessToken } from '@/api/client'
import * as authService from '@/api/services/auth'
import { sessionHint, tokenStore } from '@/api/token-store'
import { useToast } from '@/components/ui/toast-context'
import type { User } from '@/types/api'
import { AuthContext, type AuthStatus } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const showToast = useToast()
  // Without a session hint there is nothing to restore: start anonymous
  const [status, setStatus] = useState<AuthStatus>(() =>
    sessionHint.exists() ? 'restoring' : 'anonymous',
  )
  const [user, setUser] = useState<User | null>(null)

  const startSession = useCallback(async (token: string) => {
    tokenStore.set(token)
    sessionHint.set(true)
    setUser(await authService.getProfile())
    setStatus('authenticated')
  }, [])

  const clearSession = useCallback(() => {
    tokenStore.set(null)
    sessionHint.set(false)
    setUser(null)
    setStatus('anonymous')
    queryClient.clear()
  }, [queryClient])

  // On load, the httpOnly refresh cookie (if any) restores the session
  useEffect(() => {
    if (!sessionHint.exists()) return

    refreshAccessToken()
      .then(startSession)
      .catch(() => {
        sessionHint.set(false)
        setStatus('anonymous')
      })
  }, [startSession])

  useEffect(() => {
    return onSessionExpired(() => {
      clearSession()
      showToast({
        tone: 'info',
        title: 'Sua sessão expirou',
        description: 'Entre novamente para continuar.',
      })
    })
  }, [clearSession, showToast])

  const value = useMemo(
    () => ({
      status,
      user,
      signIn: async (credentials: authService.Credentials) => {
        const { token } = await authService.login(credentials)
        await startSession(token)
      },
      signUp: async (data: authService.RegisterData) => {
        const { token } = await authService.register(data)
        await startSession(token)
      },
      signOut: async () => {
        // Even if the request fails, the local session must end
        await authService.logout().catch(() => undefined)
        clearSession()
      },
    }),
    [status, user, startSession, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

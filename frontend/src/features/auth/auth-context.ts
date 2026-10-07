import { createContext, useContext } from 'react'
import type { Credentials, RegisterData } from '@/api/services/auth'
import type { User } from '@/types/api'

export type AuthStatus = 'restoring' | 'authenticated' | 'anonymous'

export interface AuthContextValue {
  status: AuthStatus
  user: User | null
  signIn: (credentials: Credentials) => Promise<void>
  signUp: (data: RegisterData) => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }

  return context
}

/** For screens behind <RequireAuth>, where the user is always present. */
export function useCurrentUser() {
  const { user } = useAuth()

  if (!user) {
    throw new Error('useCurrentUser must be used behind <RequireAuth>')
  }

  return user
}

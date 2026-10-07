import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '@/components/ui/LoadingState'
import { useAuth } from './auth-context'

/** Protects child routes; remembers where the user wanted to go. */
export function RequireAuth() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'restoring') {
    return <LoadingState label="Carregando sua sessão..." />
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

/** Guards routes for visitors only (login, register). */
export function RequireGuest() {
  const { status } = useAuth()

  if (status === 'restoring') {
    return <LoadingState label="Carregando..." />
  }

  if (status === 'authenticated') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

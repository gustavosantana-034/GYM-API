import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from './auth-context'

/**
 * Hides the admin area from members. The API enforces the same rule (403),
 * this only avoids showing screens that would fail.
 */
export function RequireAdmin() {
  const user = useCurrentUser()

  if (user.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

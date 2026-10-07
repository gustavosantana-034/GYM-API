import { User } from '@prisma/client'

/** Whitelists the public fields so password_hash can never leak. */
export function presentUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  }
}

import { Shield } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { Logo } from '@/components/ui/Logo'
import { useCurrentUser } from '@/features/auth/auth-context'

/** Mobile header: brand on the left, admin shortcut and profile on the right. */
export function TopBar() {
  const user = useCurrentUser()

  return (
    <header className="sticky top-0 z-[1100] flex h-16 items-center justify-between border-b border-border bg-bg/95 px-4 backdrop-blur-sm lg:hidden">
      <Link to="/" aria-label="Pulso, ir para o início">
        <Logo />
      </Link>
      <div className="flex items-center gap-2">
        {user.role === 'ADMIN' && (
          <Link
            to="/admin"
            className="flex h-9 items-center gap-1.5 rounded-md border border-border px-3 text-caption font-semibold text-muted hover:text-text"
          >
            <Shield aria-hidden className="size-4" />
            Admin
          </Link>
        )}
        <Link to="/profile" aria-label="Meu perfil">
          <Avatar name={user.name} size="sm" />
        </Link>
      </div>
    </header>
  )
}

import { Shield } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { Avatar } from '@/components/ui/Avatar'
import { Logo } from '@/components/ui/Logo'
import { useCurrentUser } from '@/features/auth/auth-context'
import { cn } from '@/utils/cn'
import { mainNavItems, type NavItem } from './nav-items'

const linkStyles = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex h-11 items-center gap-3 rounded-md px-3 text-label font-semibold transition-colors',
    isActive ? 'bg-primary-soft text-primary-ink' : 'text-muted hover:bg-surface-2 hover:text-text',
  )

function SidebarLink({ to, label, icon: Icon, end }: NavItem) {
  return (
    <NavLink to={to} end={end} className={linkStyles}>
      <Icon aria-hidden className="size-5" />
      {label}
    </NavLink>
  )
}

/** Desktop navigation. */
export function Sidebar() {
  const user = useCurrentUser()

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface-1 px-4 py-6 lg:flex">
      <Link to="/" className="mb-10 px-3" aria-label="Pulso, ir para o início">
        <Logo />
      </Link>

      <nav aria-label="Navegação principal" className="flex flex-col gap-1">
        {mainNavItems.map((item) => (
          <SidebarLink key={item.to} {...item} />
        ))}

        {user.role === 'ADMIN' && (
          <>
            <p className="mt-6 mb-2 px-3 text-caption font-semibold tracking-[0.12em] text-subtle uppercase">
              Administração
            </p>
            <SidebarLink to="/admin" label="Painel admin" icon={Shield} />
          </>
        )}
      </nav>

      <Link
        to="/profile"
        className="mt-auto flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-surface-2"
      >
        <Avatar name={user.name} size="sm" />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-label font-semibold text-text">{user.name}</span>
          <span className="truncate text-caption text-muted">{user.email}</span>
        </span>
      </Link>
    </aside>
  )
}

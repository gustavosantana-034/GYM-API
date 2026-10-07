import { CalendarCheck, Compass, House, User, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const mainNavItems: NavItem[] = [
  { to: '/', label: 'Início', icon: House, end: true },
  { to: '/explore', label: 'Explorar', icon: Compass },
  { to: '/check-ins', label: 'Check-ins', icon: CalendarCheck },
  { to: '/profile', label: 'Perfil', icon: User },
]

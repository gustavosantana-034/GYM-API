import { NavLink, Outlet } from 'react-router'
import { Page } from '@/components/ui/Page'
import { PageHeader } from '@/components/ui/PageHeader'
import { cn } from '@/utils/cn'

const tabs = [
  { to: '/admin', label: 'Check-ins', end: true },
  { to: '/admin/gyms', label: 'Academias' },
]

export function AdminLayout() {
  return (
    <Page className="gap-6">
      <PageHeader eyebrow="Administração" title="Painel admin" />
      <nav aria-label="Seções do painel" className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                '-mb-px border-b-2 px-4 py-3 text-label font-semibold transition-colors',
                isActive ? 'border-primary text-text' : 'border-transparent text-muted hover:text-text',
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </Page>
  )
}

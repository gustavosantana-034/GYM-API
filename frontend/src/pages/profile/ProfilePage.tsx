import { LogOut, Monitor, Moon, Shield, Sun } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Page } from '@/components/ui/Page'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { ProgressStats } from '@/components/progress/ProgressStats'
import { useAuth, useCurrentUser } from '@/features/auth/auth-context'
import { useTheme, type ThemePreference } from '@/features/theme/theme-context'
import { formatMonthYear } from '@/utils/format'

export function ProfilePage() {
  const user = useCurrentUser()
  const { signOut } = useAuth()
  const { preference, setPreference } = useTheme()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)
    await signOut()
  }

  return (
    <Page>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Avatar name={user.name} size="lg" />
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-h1 font-extrabold font-expanded">{user.name}</h1>
            {user.role === 'ADMIN' && (
              <Badge tone="primary" icon={<Shield aria-hidden className="size-3.5" />}>
                Admin
              </Badge>
            )}
          </div>
          <p className="text-body text-muted">{user.email}</p>
          <p className="text-label text-subtle">Membro desde {formatMonthYear(user.created_at)}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <ProgressStats />

        <section aria-labelledby="settings-title" className="flex flex-col gap-4">
          <h2 id="settings-title" className="text-h2 font-bold">
            Configurações
          </h2>
          <Card className="flex flex-col divide-y divide-border">
            <div className="flex flex-col gap-3 p-4">
              <p className="text-label font-semibold">Tema</p>
              <SegmentedControl<ThemePreference>
                label="Tema da interface"
                value={preference}
                onChange={setPreference}
                segments={[
                  { value: 'system', label: 'Sistema', icon: <Monitor aria-hidden className="size-4" /> },
                  { value: 'dark', label: 'Escuro', icon: <Moon aria-hidden className="size-4" /> },
                  { value: 'light', label: 'Claro', icon: <Sun aria-hidden className="size-4" /> },
                ]}
              />
            </div>

            {user.role === 'ADMIN' && (
              <div className="p-4">
                <ButtonLink to="/admin" variant="secondary" fullWidth>
                  <Shield aria-hidden className="size-4" />
                  Painel administrativo
                </ButtonLink>
              </div>
            )}

            <div className="p-4">
              <Button variant="danger" fullWidth onClick={() => setIsLogoutOpen(true)}>
                <LogOut aria-hidden className="size-4" />
                Sair da conta
              </Button>
            </div>
          </Card>
        </section>
      </div>

      <Modal
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Sair da conta?"
        description="Você precisará entrar de novo para fazer check-in."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLogoutOpen(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleSignOut} isLoading={isSigningOut}>
              Sair
            </Button>
          </>
        }
      />
    </Page>
  )
}

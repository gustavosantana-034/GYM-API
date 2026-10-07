import { Outlet } from 'react-router'
import { DistanceRings } from '@/components/ui/DistanceRings'
import { Logo } from '@/components/ui/Logo'

/** Split screen: brand statement on wide screens, form always visible. */
export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface-1 p-12 lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col lg:justify-between">
        <Logo />
        <div className="pointer-events-none absolute top-1/2 -right-64 w-[42rem] -translate-y-1/2 opacity-60">
          <DistanceRings tone="primary" />
        </div>
        <div className="relative flex max-w-md flex-col gap-6">
          <p className="text-display font-extrabold text-text font-expanded">
            Treine onde
            <br />
            você <span className="text-primary-ink">estiver.</span>
          </p>
          <p className="text-body text-muted">
            Encontre academias, estúdios e boxes perto de você, faça check-in pelo celular e acompanhe
            sua constância.
          </p>
        </div>
        <p className="relative text-caption text-subtle">Musculação · CrossFit · Yoga · Natação · Lutas</p>
      </aside>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="lg:hidden">
          <Logo />
        </div>
        <div className="m-auto w-full max-w-sm py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

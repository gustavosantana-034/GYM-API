import { CalendarCheck, CalendarDays, Flame, Trophy, type LucideIcon } from 'lucide-react'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useMetrics } from '@/hooks/use-check-ins'
import type { UserMetrics } from '@/types/api'
import { cn } from '@/utils/cn'

interface Stat {
  key: keyof UserMetrics
  label: string
  icon: LucideIcon
  unit?: (value: number) => string
}

const days = (value: number) => (value === 1 ? 'dia' : 'dias')

const stats: Stat[] = [
  { key: 'currentStreak', label: 'Sequência atual', icon: Flame, unit: days },
  { key: 'checkInsThisWeek', label: 'Treinos na semana', icon: CalendarCheck },
  { key: 'checkInsThisMonth', label: 'Treinos no mês', icon: CalendarDays },
  { key: 'bestStreak', label: 'Melhor sequência', icon: Trophy, unit: days },
]

function streakMessage(metrics: UserMetrics) {
  if (metrics.checkInsCount === 0) return 'Faça seu primeiro check-in para começar a contar.'
  if (metrics.currentStreak === 0) return 'Um treino hoje recomeça sua sequência.'
  if (metrics.currentStreak >= metrics.bestStreak && metrics.currentStreak > 1)
    return 'Você está no seu melhor ritmo. Continue assim.'
  return 'Mantenha o ritmo: treine amanhã para aumentar a sequência.'
}

/** Light gamification: motivating numbers derived from real check-ins. */
export function ProgressStats({ className }: { className?: string }) {
  const { data: metrics, isPending, isError, refetch, isRefetching } = useMetrics()

  if (isError) {
    return (
      <ErrorState
        title="Não conseguimos carregar seu progresso."
        onRetry={() => refetch()}
        isRetrying={isRefetching}
        className={className}
      />
    )
  }

  return (
    <section aria-labelledby="progress-title" className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-col gap-1">
        <h2 id="progress-title" className="text-h2 font-bold">
          Seu progresso
        </h2>
        {isPending ? (
          <Skeleton className="h-4 w-64" />
        ) : (
          <p className="text-label text-muted">{streakMessage(metrics)}</p>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-3">
        {stats.map(({ key, label, icon: Icon, unit }) => {
          const isStreak = key === 'currentStreak'
          const value = metrics?.[key] ?? 0

          return (
            <div
              key={key}
              className={cn(
                'flex flex-col gap-3 rounded-lg border p-4',
                isStreak && value > 0 ? 'border-primary bg-primary-soft' : 'border-border bg-surface-1',
              )}
            >
              <dt className="flex items-center gap-2 text-caption font-semibold text-muted">
                <Icon aria-hidden className={cn('size-4', isStreak && value > 0 && 'text-primary-ink')} />
                {label}
              </dt>
              <dd className="flex items-baseline gap-1.5">
                {isPending ? (
                  <Skeleton className="h-9 w-12" />
                ) : (
                  <>
                    <span className="text-h1 leading-none font-extrabold tabular font-expanded">{value}</span>
                    {unit && <span className="text-label text-muted">{unit(value)}</span>}
                  </>
                )}
              </dd>
            </div>
          )
        })}
      </dl>
    </section>
  )
}

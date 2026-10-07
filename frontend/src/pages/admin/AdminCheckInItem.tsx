import { CircleCheck, Clock, TimerOff } from 'lucide-react'
import { getErrorMessage } from '@/api/errors'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/toast-context'
import { useValidateCheckIn } from '@/hooks/use-check-ins'
import type { CheckInWithGymAndUser } from '@/types/api'
import { dayjs, formatTime } from '@/utils/format'

const VALIDATION_WINDOW_IN_MINUTES = 20

interface AdminCheckInItemProps {
  checkIn: CheckInWithGymAndUser
  now: number
}

export function AdminCheckInItem({ checkIn, now }: AdminCheckInItemProps) {
  const showToast = useToast()
  const validate = useValidateCheckIn()

  const minutesLeft =
    VALIDATION_WINDOW_IN_MINUTES - Math.floor((now - dayjs(checkIn.created_at).valueOf()) / 60_000)
  const isExpired = minutesLeft < 0

  function handleValidate() {
    validate.mutate(checkIn.id, {
      onSuccess: () =>
        showToast({ tone: 'success', title: 'Check-in validado', description: `${checkIn.user.name} em ${checkIn.gym.title}` }),
      onError: (error) =>
        showToast({
          tone: 'error',
          title: 'Não foi possível validar',
          description: getErrorMessage(error, {
            409: 'Este check-in já foi validado.',
            422: 'O prazo de 20 minutos para validar este check-in terminou.',
            404: 'Este check-in não existe mais.',
          }),
        }),
    })
  }

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-surface-1 p-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-body font-bold">{checkIn.user.name}</p>
        <p className="truncate text-label text-muted">
          {checkIn.gym.title} · {dayjs(checkIn.created_at).format('DD/MM')} às {formatTime(checkIn.created_at)}
        </p>
        <p className="truncate text-caption text-subtle">{checkIn.user.email}</p>
      </div>

      <div className="flex items-center gap-3">
        {checkIn.validated_at ? (
          <Badge tone="success" icon={<CircleCheck aria-hidden className="size-3.5" />}>
            Validado às {formatTime(checkIn.validated_at)}
          </Badge>
        ) : isExpired ? (
          <Badge tone="neutral" icon={<TimerOff aria-hidden className="size-3.5" />}>
            Prazo encerrado
          </Badge>
        ) : (
          <>
            <Badge tone={minutesLeft <= 5 ? 'danger' : 'warning'} icon={<Clock aria-hidden className="size-3.5" />}>
              {minutesLeft === 0 ? 'Último minuto' : `Expira em ${minutesLeft} min`}
            </Badge>
            <Button size="sm" onClick={handleValidate} isLoading={validate.isPending}>
              Validar
            </Button>
          </>
        )}
      </div>
    </article>
  )
}

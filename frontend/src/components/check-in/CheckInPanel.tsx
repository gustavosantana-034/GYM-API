import { CalendarCheck, LocateFixed, Navigation, RefreshCw } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCurrentUser } from '@/features/auth/auth-context'
import type { Gym } from '@/types/api'
import { formatDistance, formatTime, getFirstName } from '@/utils/format'
import { CheckInRadar } from './CheckInRadar'
import { CheckInSuccess } from './CheckInSuccess'
import { useCheckInFlow, type CheckInStep } from './use-check-in-flow'

const directionsUrl = (gym: Gym) =>
  `https://www.google.com/maps/dir/?api=1&destination=${gym.latitude},${gym.longitude}`

const failureMessages: Record<string, string> = {
  denied: 'O acesso à localização está bloqueado. Libere-o nas configurações do navegador para fazer check-in.',
  unavailable: 'Não conseguimos sua localização. Verifique se o GPS está ativo.',
  timeout: 'A localização demorou demais para responder. Tente novamente.',
}

function StepMessage({ step, gym, locationStatus }: { step: CheckInStep; gym: Gym; locationStatus: string }) {
  switch (step.name) {
    case 'needs-location':
      return (
        <>
          <p className="text-h3 font-bold">Chegou na academia?</p>
          <p className="text-label text-muted">
            Para registrar o check-in precisamos confirmar que você está a até 100 m de {gym.title}.
          </p>
        </>
      )
    case 'locating':
      return (
        <>
          <p className="text-h3 font-bold">Verificando sua distância...</p>
          <p className="text-label text-muted">Isso leva só alguns segundos.</p>
        </>
      )
    case 'location-failed':
      return (
        <>
          <p className="text-h3 font-bold">Sem localização</p>
          <p className="text-label text-muted">{failureMessages[locationStatus] ?? failureMessages.unavailable}</p>
        </>
      )
    case 'too-far':
      return (
        <>
          <p className="text-h3 font-bold">Você precisa estar próximo da academia para fazer check-in.</p>
          <p className="text-label text-muted">
            Distância atual:{' '}
            <strong className="text-h3 font-extrabold text-text tabular font-expanded">
              {formatDistance(step.distanceInKm)}
            </strong>
          </p>
        </>
      )
    case 'ready':
    case 'submitting':
      return (
        <>
          <p className="text-h3 font-bold">
            Você está a <span className="text-primary-ink tabular">{formatDistance(step.distanceInKm)}</span> da
            academia.
          </p>
          <p className="text-label text-muted">Tudo certo para registrar seu treino de hoje.</p>
        </>
      )
    case 'error':
      return (
        <>
          <p className="text-h3 font-bold">Não foi possível fazer o check-in</p>
          <p role="alert" className="text-label text-danger">
            {step.message}
          </p>
        </>
      )
    default:
      return null
  }
}

export function CheckInPanel({ gym }: { gym: Gym }) {
  const user = useCurrentUser()
  const flow = useCheckInFlow(gym)
  const { step } = flow

  if (flow.isCheckingHistory) {
    return (
      <Card className="flex flex-col gap-4 p-6">
        <Skeleton className="mx-auto aspect-square w-40 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-12 w-full" />
      </Card>
    )
  }

  if (step.name === 'already-today') {
    const isThisGym = step.checkIn.gym_id === gym.id

    return (
      <Card className="flex flex-col gap-3 p-6">
        <CalendarCheck aria-hidden className="size-7 text-success" />
        <p className="text-h3 font-bold">Treino de hoje já registrado</p>
        <p className="text-label text-muted">
          Você fez check-in {isThisGym ? 'aqui' : <>em <strong className="text-text">{step.checkIn.gym.title}</strong></>} às{' '}
          {formatTime(step.checkIn.created_at)}. É permitido um check-in por dia. Volte amanhã!
        </p>
        <Link to="/check-ins" className="text-label font-semibold text-primary-ink hover:underline">
          Ver meus check-ins
        </Link>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {step.name === 'success' ? (
          <motion.div key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6">
            <CheckInSuccess firstName={getFirstName(user.name)} />
          </motion.div>
        ) : (
          <motion.div key="flow" exit={{ opacity: 0 }} className="flex flex-col gap-5 p-6">
            <div className="relative mx-auto w-44">
              <CheckInRadar distanceInKm={flow.distanceInKm} />
              {step.name === 'locating' && (
                <span className="absolute inset-[27%] animate-ring rounded-full border border-geo" />
              )}
            </div>

            <div aria-live="polite" className="flex flex-col gap-2">
              <StepMessage step={step} gym={gym} locationStatus={flow.locationStatus} />
              {flow.accuracy !== null && flow.accuracy > 50 && step.name !== 'needs-location' && (
                <p className="text-caption text-subtle">
                  Precisão do GPS: ±{Math.round(flow.accuracy)} m. Em ambientes fechados a posição pode variar.
                </p>
              )}
            </div>

            <CheckInActions step={step} gym={gym} flow={flow} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function CheckInActions({
  step,
  gym,
  flow,
}: {
  step: CheckInStep
  gym: Gym
  flow: ReturnType<typeof useCheckInFlow>
}) {
  if (step.name === 'ready' || step.name === 'submitting') {
    return (
      <Button size="lg" fullWidth onClick={flow.confirmCheckIn} isLoading={step.name === 'submitting'}>
        Confirmar check-in
      </Button>
    )
  }

  if (step.name === 'too-far' || step.name === 'error') {
    return (
      <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
        <Button variant="secondary" fullWidth onClick={flow.refreshLocation}>
          <RefreshCw aria-hidden className="size-4" />
          Atualizar localização
        </Button>
        <a
          href={directionsUrl(gym)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md text-label font-semibold text-muted hover:bg-surface-2 hover:text-text"
        >
          <Navigation aria-hidden className="size-4" />
          Como chegar
        </a>
      </div>
    )
  }

  return (
    <Button
      size="lg"
      fullWidth
      variant={step.name === 'location-failed' ? 'secondary' : 'primary'}
      onClick={flow.refreshLocation}
      isLoading={step.name === 'locating'}
    >
      {step.name !== 'locating' && <LocateFixed aria-hidden className="size-4" />}
      {step.name === 'location-failed' ? 'Tentar novamente' : 'Verificar minha localização'}
    </Button>
  )
}

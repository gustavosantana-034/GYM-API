import { LocateFixed, MapPinOff, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { DistanceRings } from '@/components/ui/DistanceRings'
import { useLocation, type LocationStatus } from '@/features/location/location-context'
import { cn } from '@/utils/cn'

interface LocationPromptProps {
  title?: string
  description?: string
  /** Extra action for when location is not an option (e.g. search by name). */
  fallback?: ReactNode
  compact?: boolean
  className?: string
}

const failureCopy: Partial<Record<LocationStatus, { title: string; description: string }>> = {
  denied: {
    title: 'Acesso à localização bloqueado',
    description:
      'Libere a localização nas configurações do navegador (ícone de cadeado ao lado do endereço) e tente de novo. Navegadores embutidos, como o do VS Code, costumam bloquear a localização: nesse caso, abra o endereço no Chrome, Edge ou Firefox.',
  },
  unavailable: {
    title: 'Não conseguimos sua localização',
    description:
      'Seu dispositivo não informou uma posição. Verifique se os serviços de localização estão ativos, ou abra o app no Chrome, Edge ou Firefox se estiver num navegador embutido.',
  },
  timeout: {
    title: 'A localização demorou demais',
    description: 'O sinal pode estar fraco. Tente novamente em um lugar aberto.',
  },
}

/**
 * Explains why the location is needed before the browser asks for it, and
 * handles every outcome of the request.
 */
export function LocationPrompt({
  title = 'Encontre academias perto de você',
  description = 'Permita o acesso à sua localização para mostrarmos academias e atividades perto de você. Ela é usada só enquanto você navega.',
  fallback,
  compact = false,
  className,
}: LocationPromptProps) {
  const { status, requestLocation } = useLocation()
  const failure = failureCopy[status]
  const isLocating = status === 'locating'

  return (
    <section
      aria-live="polite"
      className={cn(
        'relative flex flex-col gap-5 overflow-hidden rounded-lg border border-border bg-surface-1',
        compact ? 'p-5' : 'p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8',
        className,
      )}
    >
      <div className={cn('relative flex shrink-0 items-center justify-center', compact ? 'size-16' : 'size-24')}>
        <div className="absolute inset-0">
          <DistanceRings pulsing={isLocating} tone={failure ? 'muted' : 'geo'} className="size-full" />
        </div>
        {failure && <MapPinOff aria-hidden className="relative size-6 text-muted" />}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-h3 font-bold text-text">
            {isLocating ? 'Buscando sua localização...' : (failure?.title ?? title)}
          </h2>
          <p className="max-w-lg text-label text-muted">
            {isLocating ? 'Confirme o pedido do navegador, se ele aparecer.' : (failure?.description ?? description)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {status !== 'denied' && (
            <Button onClick={() => requestLocation()} isLoading={isLocating}>
              {!isLocating &&
                (failure ? <RefreshCw aria-hidden className="size-4" /> : <LocateFixed aria-hidden className="size-4" />)}
              {failure ? 'Tentar novamente' : 'Usar minha localização'}
            </Button>
          )}
          {status === 'denied' && (
            <Button variant="secondary" onClick={() => requestLocation()}>
              <RefreshCw aria-hidden className="size-4" />
              Já liberei, tentar de novo
            </Button>
          )}
          {fallback}
        </div>
      </div>
    </section>
  )
}

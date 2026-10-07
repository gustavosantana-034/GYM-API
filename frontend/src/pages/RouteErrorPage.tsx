import { isRouteErrorResponse, useRouteError } from 'react-router'
import { ErrorState } from '@/components/ui/ErrorState'
import { Logo } from '@/components/ui/Logo'

/** Last line of defense when a screen crashes. */
export function RouteErrorPage() {
  const error = useRouteError()
  const isChunkError = error instanceof TypeError && /dynamically imported module/i.test(error.message)

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-8 px-5">
      <Logo />
      <ErrorState
        title={
          isRouteErrorResponse(error) && error.status === 404
            ? 'Página não encontrada.'
            : 'Algo saiu do esperado nesta tela.'
        }
        description={
          isChunkError
            ? 'Uma nova versão do app foi publicada. Recarregue para continuar.'
            : 'Recarregue a página. Se o problema continuar, tente novamente mais tarde.'
        }
        onRetry={() => window.location.reload()}
      />
    </main>
  )
}

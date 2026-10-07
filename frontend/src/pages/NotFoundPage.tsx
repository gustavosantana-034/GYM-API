import { Compass } from 'lucide-react'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { EmptyState } from '@/components/ui/EmptyState'
import { Page } from '@/components/ui/Page'

export function NotFoundPage() {
  return (
    <Page>
      <EmptyState
        icon={<Compass className="size-6" />}
        title="Página não encontrada."
        description="O endereço pode estar errado ou a página mudou de lugar."
        action={
          <ButtonLink to="/" size="sm">
            Voltar para o início
          </ButtonLink>
        }
      />
    </Page>
  )
}

import { CloudDownload } from 'lucide-react'
import { useState } from 'react'
import { getErrorMessage } from '@/api/errors'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/toast-context'
import { useLocation } from '@/features/location/location-context'
import { useImportNearbyGyms } from '@/hooks/use-gyms'
import type { ButtonVariant } from '@/components/ui/button-styles'
import { pluralize } from '@/utils/format'

const IMPORT_RADIUS_IN_KM = 10

/**
 * Admin action: brings the real gyms around the admin's current position
 * from OpenStreetMap into the platform.
 */
export function ImportNearbyGymsButton({ variant = 'secondary' }: { variant?: ButtonVariant }) {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const importGyms = useImportNearbyGyms()
  const showToast = useToast()

  const isLocating = location.status === 'locating'
  const isBusy = isLocating || importGyms.isPending

  async function handleImport() {
    const position = await location.requestLocation({ fresh: true })

    if (!position) {
      showToast({
        tone: 'error',
        title: 'Sem localização',
        description: 'Libere o acesso à localização para importar as academias ao seu redor.',
      })
      return
    }

    importGyms.mutate(
      { ...position, radius: IMPORT_RADIUS_IN_KM },
      {
        onSuccess: ({ found, created, updated }) => {
          setIsOpen(false)
          showToast({
            tone: 'success',
            title: `${pluralize(found, 'academia encontrada', 'academias encontradas')} perto de você`,
            description: `${pluralize(created, 'nova', 'novas')} e ${pluralize(updated, 'atualizada', 'atualizadas')}.`,
          })
        },
        onError: (error) =>
          showToast({
            tone: 'error',
            title: 'Não foi possível importar',
            description: getErrorMessage(error, {
              503: 'O OpenStreetMap está sobrecarregado agora. Tente de novo em alguns minutos.',
              403: 'Apenas administradores podem importar academias.',
            }),
          }),
      },
    )
  }

  return (
    <>
      <Button variant={variant} onClick={() => setIsOpen(true)}>
        <CloudDownload aria-hidden className="size-4" />
        Importar academias reais
      </Button>

      <Modal
        open={isOpen}
        onClose={() => !isBusy && setIsOpen(false)}
        title="Importar academias perto de você"
        description={`Buscamos no OpenStreetMap as academias, estúdios e boxes num raio de ${IMPORT_RADIUS_IN_KM} km da sua localização atual, com nome, endereço e modalidades.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isBusy}>
              Cancelar
            </Button>
            <Button onClick={handleImport} isLoading={isBusy}>
              {isLocating ? 'Obtendo localização...' : importGyms.isPending ? 'Importando...' : 'Importar'}
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-2 text-label text-muted">
          <li>• Academias já importadas são atualizadas, sem duplicar.</li>
          <li>• Pode levar de 1 a 3 minutos: os servidores do OpenStreetMap são públicos e às vezes ficam lentos.</li>
          <li>• Depois você pode editar qualquer academia importada.</li>
        </ul>
      </Modal>
    </>
  )
}

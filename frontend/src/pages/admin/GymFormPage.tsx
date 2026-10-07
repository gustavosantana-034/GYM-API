import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'
import { getErrorMessage } from '@/api/errors'
import { createGym, updateGym, type GymInput } from '@/api/services/gyms'
import { ErrorState } from '@/components/ui/ErrorState'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/toast-context'
import { useGym } from '@/hooks/use-gyms'
import { queryKeys } from '@/hooks/query-keys'
import type { GymFormData } from '@/schemas/gym'
import type { Gym } from '@/types/api'
import { GymForm } from './GymForm'

const toInput = (data: GymFormData): GymInput => ({
  ...data,
  description: data.description || null,
  phone: data.phone || null,
  address: data.address || null,
})

const toFormData = (gym: Gym): GymFormData => ({
  title: gym.title,
  description: gym.description ?? '',
  phone: gym.phone ?? '',
  address: gym.address ?? '',
  modalities: gym.modalities,
  latitude: gym.latitude,
  longitude: gym.longitude,
})

function useSaveGym(gymId?: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const showToast = useToast()

  return async (data: GymFormData) => {
    try {
      const gym = gymId ? await updateGym(gymId, toInput(data)) : await createGym(toInput(data))

      await queryClient.invalidateQueries({ queryKey: queryKeys.gyms.all })
      showToast({ tone: 'success', title: gymId ? 'Academia atualizada' : 'Academia criada', description: gym.title })
      navigate(`/gyms/${gym.id}`)
    } catch (error) {
      throw new Error(
        getErrorMessage(error, {
          400: 'Confira os campos: algum valor não foi aceito pela API.',
          403: 'Sua conta não tem permissão para gerenciar academias.',
          404: 'Esta academia não existe mais.',
        }),
        { cause: error },
      )
    }
  }
}

function FormHeader({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        to="/admin/gyms"
        className="-ml-2 inline-flex h-10 w-fit items-center gap-2 rounded-md px-2 text-label font-semibold text-muted hover:bg-surface-2 hover:text-text"
      >
        <ArrowLeft aria-hidden className="size-4" />
        Academias
      </Link>
      <h2 className="text-h2 font-bold">{title}</h2>
    </div>
  )
}

export function NewGymPage() {
  const saveGym = useSaveGym()

  return (
    <section className="flex flex-col gap-6">
      <FormHeader title="Nova academia" />
      <GymForm submitLabel="Criar academia" onSubmit={saveGym} />
    </section>
  )
}

export function EditGymPage() {
  const { gymId = '' } = useParams()
  const gym = useGym(gymId)
  const saveGym = useSaveGym(gymId)

  return (
    <section className="flex flex-col gap-6">
      <FormHeader title={gym.data ? `Editar ${gym.data.title}` : 'Editar academia'} />
      {gym.isPending ? (
        <div role="status" aria-label="Carregando academia" className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-20 w-full" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      ) : gym.isError ? (
        <ErrorState title="Não conseguimos carregar esta academia." onRetry={() => gym.refetch()} isRetrying={gym.isRefetching} />
      ) : (
        <GymForm defaultValues={toFormData(gym.data)} submitLabel="Salvar alterações" onSubmit={saveGym} />
      )}
    </section>
  )
}

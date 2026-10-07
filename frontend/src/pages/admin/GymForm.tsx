import { zodResolver } from '@hookform/resolvers/zod'
import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { LazyLocationPickerMap } from '@/components/map/LazyLocationPickerMap'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { FormError } from '@/components/ui/FormError'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useLocation } from '@/features/location/location-context'
import { gymFormSchema, type GymFormData } from '@/schemas/gym'
import { MODALITIES } from '@/types/api'
import type { Coordinates } from '@/types/geo'
import { MODALITY_INFO } from '@/utils/modalities'

interface GymFormProps {
  defaultValues?: GymFormData
  submitLabel: string
  onSubmit: (data: GymFormData) => Promise<void>
}

const SAO_PAULO: Coordinates = { latitude: -23.5614, longitude: -46.6559 }

const emptyGym: Partial<GymFormData> = {
  title: '',
  description: '',
  phone: '',
  address: '',
  modalities: [],
}

export function GymForm({ defaultValues, submitLabel, onSubmit }: GymFormProps) {
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<GymFormData>({
    resolver: zodResolver(gymFormSchema),
    defaultValues: defaultValues ?? emptyGym,
  })

  const [latitude, longitude] = useWatch({ control, name: ['latitude', 'longitude'] })
  const hasPosition = Number.isFinite(latitude) && Number.isFinite(longitude)

  function setPosition(position: Coordinates) {
    const round = (value: number) => Math.round(value * 1_000_000) / 1_000_000
    setValue('latitude', round(position.latitude), { shouldValidate: true, shouldDirty: true })
    setValue('longitude', round(position.longitude), { shouldValidate: true, shouldDirty: true })
  }

  async function useMyLocation() {
    const position = await location.requestLocation({ fresh: true })
    if (position) setPosition(position)
  }

  async function submit(data: GymFormData) {
    setFormError(null)

    try {
      await onSubmit(data)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Não foi possível salvar.')
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="grid gap-8 lg:grid-cols-2">
      <div className="flex flex-col gap-5">
        <FormError message={formError} />
        <Input id="title" label="Nome" error={errors.title?.message} {...register('title')} />
        <Textarea
          id="description"
          label="Descrição"
          hint="Opcional. Conte o que torna a academia especial."
          error={errors.description?.message}
          {...register('description')}
        />
        <Input id="address" label="Endereço" hint="Opcional." error={errors.address?.message} {...register('address')} />
        <Input
          id="phone"
          label="Telefone"
          type="tel"
          hint="Opcional."
          error={errors.phone?.message}
          {...register('phone')}
        />

        <fieldset className="flex min-w-0 flex-col gap-3">
          <legend className="mb-2 text-label font-medium">Modalidades</legend>
          <Controller
            control={control}
            name="modalities"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {MODALITIES.map((modality) => {
                  const { label, icon: Icon } = MODALITY_INFO[modality]
                  const selected = field.value.includes(modality)

                  return (
                    <Chip
                      key={modality}
                      selected={selected}
                      icon={<Icon aria-hidden className="size-4" />}
                      onClick={() =>
                        field.onChange(
                          selected ? field.value.filter((item) => item !== modality) : [...field.value, modality],
                        )
                      }
                    >
                      {label}
                    </Chip>
                  )
                })}
              </div>
            )}
          />
        </fieldset>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-label font-medium">Localização</p>
            <p className="text-caption text-muted">Clique no mapa ou arraste o marcador.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={useMyLocation} isLoading={location.status === 'locating'}>
            <LocateFixed aria-hidden className="size-4" />
            Usar minha localização
          </Button>
        </div>

        <div className="h-80 overflow-hidden rounded-lg border border-border">
          <LazyLocationPickerMap
            value={hasPosition ? { latitude, longitude } : null}
            onChange={setPosition}
            fallbackCenter={location.position ?? SAO_PAULO}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="latitude"
            label="Latitude"
            type="number"
            step="any"
            error={errors.latitude?.message}
            {...register('latitude', { valueAsNumber: true })}
          />
          <Input
            id="longitude"
            label="Longitude"
            type="number"
            step="any"
            error={errors.longitude?.message}
            {...register('longitude', { valueAsNumber: true })}
          />
        </div>

        <Button type="submit" size="lg" isLoading={isSubmitting} className="mt-2">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}

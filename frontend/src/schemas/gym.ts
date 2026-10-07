import { z } from 'zod'
import { MODALITIES } from '@/types/api'

const coordinate = (min: number, max: number) =>
  z
    .number({ error: 'Escolha a posição no mapa ou digite as coordenadas.' })
    .min(min, `Valor entre ${min} e ${max}.`)
    .max(max, `Valor entre ${min} e ${max}.`)

export const gymFormSchema = z.object({
  title: z.string().trim().min(1, 'Informe o nome da academia.').max(80, 'Use até 80 caracteres.'),
  description: z.string().trim().max(600, 'Use até 600 caracteres.'),
  phone: z.string().trim().max(30, 'Telefone muito longo.'),
  address: z.string().trim().max(160, 'Endereço muito longo.'),
  modalities: z.array(z.enum(MODALITIES)),
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
})

export type GymFormData = z.infer<typeof gymFormSchema>

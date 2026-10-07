import {
  Activity,
  Dumbbell,
  Flame,
  Flower2,
  Footprints,
  Music,
  Swords,
  Droplets,
  type LucideIcon,
} from 'lucide-react'
import { MODALITIES, type Modality } from '@/types/api'

interface ModalityInfo {
  label: string
  icon: LucideIcon
  /** Extra words people type when looking for this modality. */
  keywords: string[]
}

export const MODALITY_INFO: Record<Modality, ModalityInfo> = {
  WEIGHT_TRAINING: {
    label: 'Musculação',
    icon: Dumbbell,
    keywords: ['musculacao', 'academia', 'peso', 'hipertrofia'],
  },
  CROSSFIT: {
    label: 'CrossFit',
    icon: Flame,
    keywords: ['crossfit', 'cross', 'box'],
  },
  FUNCTIONAL: {
    label: 'Funcional',
    icon: Activity,
    keywords: ['funcional', 'hiit', 'circuito'],
  },
  YOGA: { label: 'Yoga', icon: Flower2, keywords: ['yoga', 'ioga'] },
  PILATES: { label: 'Pilates', icon: Footprints, keywords: ['pilates'] },
  SWIMMING: {
    label: 'Natação',
    icon: Droplets,
    keywords: ['natacao', 'piscina', 'hidroginastica'],
  },
  MARTIAL_ARTS: {
    label: 'Lutas',
    icon: Swords,
    keywords: ['lutas', 'luta', 'jiu', 'jiujitsu', 'muay', 'boxe', 'mma', 'karate'],
  },
  DANCE: { label: 'Dança', icon: Music, keywords: ['danca', 'zumba', 'ritmos'] },
}

export const modalityLabel = (modality: Modality) => MODALITY_INFO[modality].label

export function isModality(value: string | null): value is Modality {
  return value !== null && (MODALITIES as readonly string[]).includes(value)
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

/**
 * Recognizes a modality typed in the search bar ("natação", "jiu jitsu"...),
 * so the search can use the API's modality filter instead of a text match.
 */
export function matchModality(text: string): Modality | null {
  const query = normalize(text)

  if (query.length < 3) return null

  for (const modality of MODALITIES) {
    const { label, keywords } = MODALITY_INFO[modality]
    const terms = [normalize(label), ...keywords]

    if (terms.some((term) => term === query || term.startsWith(query))) {
      return modality
    }
  }

  return null
}

import { Modality } from '@prisma/client'
import { ExternalGym } from '../places-provider'

export interface OsmElement {
  type: 'node' | 'way' | 'relation'
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/** OSM `sport=*` values (normalized) for each modality. */
const SPORT_MODALITIES: Record<string, Modality> = {
  fitness: 'WEIGHT_TRAINING',
  weightlifting: 'WEIGHT_TRAINING',
  bodybuilding: 'WEIGHT_TRAINING',
  powerlifting: 'WEIGHT_TRAINING',
  musculacao: 'WEIGHT_TRAINING',
  crossfit: 'CROSSFIT',
  cross_training: 'CROSSFIT',
  functional_training: 'FUNCTIONAL',
  treinamento_funcional: 'FUNCTIONAL',
  funcional: 'FUNCTIONAL',
  calisthenics: 'FUNCTIONAL',
  hiit: 'FUNCTIONAL',
  yoga: 'YOGA',
  pilates: 'PILATES',
  pilates_solo: 'PILATES',
  swimming: 'SWIMMING',
  natacao: 'SWIMMING',
  water_aerobics: 'SWIMMING',
  hidroginastica: 'SWIMMING',
  martial_arts: 'MARTIAL_ARTS',
  lutas: 'MARTIAL_ARTS',
  judo: 'MARTIAL_ARTS',
  karate: 'MARTIAL_ARTS',
  taekwondo: 'MARTIAL_ARTS',
  boxing: 'MARTIAL_ARTS',
  kickboxing: 'MARTIAL_ARTS',
  muay_thai: 'MARTIAL_ARTS',
  mma: 'MARTIAL_ARTS',
  jiu_jitsu: 'MARTIAL_ARTS',
  'jiu-jitsu': 'MARTIAL_ARTS',
  brazilian_jiu_jitsu: 'MARTIAL_ARTS',
  capoeira: 'MARTIAL_ARTS',
  krav_maga: 'MARTIAL_ARTS',
  kung_fu: 'MARTIAL_ARTS',
  aikido: 'MARTIAL_ARTS',
  wrestling: 'MARTIAL_ARTS',
  dance: 'DANCE',
  zumba: 'DANCE',
  ritmos: 'DANCE',
  ballet: 'DANCE',
  hip_hop: 'DANCE',
}

/** Words in the gym name that reveal what it offers. */
const NAME_KEYWORDS: [RegExp, Modality][] = [
  [/crossfit|\bcross\b|\bbox\b/, 'CROSSFIT'],
  [/funcional|functional/, 'FUNCTIONAL'],
  [/yoga|ioga/, 'YOGA'],
  [/pilates/, 'PILATES'],
  [/natacao|swim|aquatic|piscina/, 'SWIMMING'],
  [
    /jiu|judo|karate|muay|boxe|boxing|\bmma\b|kickboxing|taekwondo|krav|capoeira|fight|luta|dojo|kung/,
    'MARTIAL_ARTS',
  ],
  [/danca|dance|ballet|bale|zumba|forro|samba|tango/, 'DANCE'],
]

function modalitiesFromSport(sport: string | undefined) {
  if (!sport) return []

  return sport
    .split(';')
    .map((value) => normalize(value).replace(/\s+/g, '_'))
    .flatMap((value) => {
      if (SPORT_MODALITIES[value]) return [SPORT_MODALITIES[value]]
      if (value.endsWith('_dancing')) return ['DANCE' as const] // flamenco_dancing...
      return []
    })
}

function modalitiesFromName(name: string) {
  const normalizedName = normalize(name)

  return NAME_KEYWORDS.filter(([pattern]) => pattern.test(normalizedName)).map(
    ([, modality]) => modality,
  )
}

/**
 * Modalities come from the `sport` tag and from keywords in the name. A
 * fitness centre or gym with no other hint is a regular gym ("academia de
 * musculação"), which is what `leisure=fitness_centre` means in OSM.
 */
export function inferModalities(tags: Record<string, string>): Modality[] {
  const modalities = new Set<Modality>([
    ...modalitiesFromSport(tags.sport),
    ...modalitiesFromName(tags.name ?? ''),
  ])

  if (tags.leisure === 'dance') modalities.add('DANCE')

  const isGeneralGym =
    tags.leisure === 'fitness_centre' || tags.amenity === 'gym'

  if (modalities.size === 0 && isGeneralGym) modalities.add('WEIGHT_TRAINING')

  return [...modalities]
}

export function formatAddress(tags: Record<string, string>) {
  const street = tags['addr:street']
  if (!street) return null

  const number = tags['addr:housenumber']
  const district = tags['addr:suburb'] ?? tags['addr:neighbourhood']

  return [number ? `${street}, ${number}` : street, district]
    .filter(Boolean)
    .join(' - ')
}

/**
 * Converts an Overpass element into a gym. Returns null when it is not a
 * place to work out (e.g. a soccer-only sports centre) or lacks a name or
 * position.
 */
export function mapOsmElement(element: OsmElement): ExternalGym | null {
  const tags = element.tags ?? {}
  const name = tags.name?.trim()
  const latitude = element.lat ?? element.center?.lat
  const longitude = element.lon ?? element.center?.lon

  if (!name || latitude === undefined || longitude === undefined) return null

  const modalities = inferModalities(tags)

  if (modalities.length === 0) return null

  return {
    externalId: `${element.type}/${element.id}`,
    title: name,
    description: tags.description?.trim() || null,
    phone: (tags.phone ?? tags['contact:phone'])?.split(';')[0].trim() || null,
    address: formatAddress(tags),
    modalities,
    latitude,
    longitude,
  }
}

import { PlacesProviderUnavailableError } from '@/use-cases/errors/places-provider-unavailable-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import {
  ExternalGym,
  FindGymsAroundParams,
  PlacesProvider,
} from '../places-provider'
import { mapOsmElement, OsmElement } from './map-osm-element'

/** Public Overpass instances; they are often busy, so we fall back. */
const DEFAULT_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]

const KM_PER_DEGREE_LATITUDE = 111.32

interface OverpassResponse {
  elements?: OsmElement[]
  /** Overpass answers 200 with a remark when the query fails or times out */
  remark?: string
}

interface OverpassPlacesProviderOptions {
  endpoints?: string[]
  rounds?: number
  retryDelayInMs?: number
  requestTimeoutInMs?: number
  fetchFn?: typeof fetch
}

/**
 * Finds gyms in OpenStreetMap through the Overpass API. Data © OpenStreetMap
 * contributors, available under the ODbL.
 */
export class OverpassPlacesProvider implements PlacesProvider {
  private endpoints: string[]
  private rounds: number
  private retryDelayInMs: number
  private requestTimeoutInMs: number
  private fetchFn: typeof fetch

  constructor(options: OverpassPlacesProviderOptions = {}) {
    this.endpoints = options.endpoints ?? DEFAULT_ENDPOINTS
    this.rounds = options.rounds ?? 3
    this.retryDelayInMs = options.retryDelayInMs ?? 5_000
    this.requestTimeoutInMs = options.requestTimeoutInMs ?? 100_000
    this.fetchFn = options.fetchFn ?? fetch
  }

  async findGymsAround({
    latitude,
    longitude,
    radiusInKm,
  }: FindGymsAroundParams) {
    const elements = await this.query(
      buildGymsQuery({ latitude, longitude, radiusInKm }),
    )

    const gyms = new Map<string, { gym: ExternalGym; distance: number }>()

    for (const element of elements) {
      const gym = mapOsmElement(element)
      if (!gym) continue

      // The query uses a bounding box (much faster); trim it to the circle
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        gym,
      )
      if (distance > radiusInKm) continue

      gyms.set(gym.externalId, { gym, distance })
    }

    return [...gyms.values()]
      .sort((a, b) => a.distance - b.distance)
      .map(({ gym }) => gym)
  }

  private async query(query: string) {
    for (let round = 0; round < this.rounds; round++) {
      for (const endpoint of this.endpoints) {
        const elements = await this.tryEndpoint(endpoint, query)
        if (elements) return elements
      }

      if (round < this.rounds - 1) {
        await new Promise((resolve) => setTimeout(resolve, this.retryDelayInMs))
      }
    }

    throw new PlacesProviderUnavailableError()
  }

  private async tryEndpoint(endpoint: string, query: string) {
    try {
      const response = await this.fetchFn(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'gym-platform/2.0 (portfolio project)',
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(this.requestTimeoutInMs),
      })

      if (!response.ok) return null

      const body = (await response.json()) as OverpassResponse

      if (body.remark?.includes('error') || !Array.isArray(body.elements))
        return null

      return body.elements
    } catch {
      return null // network error, timeout or non-JSON body: try the next one
    }
  }
}

export function buildGymsQuery({
  latitude,
  longitude,
  radiusInKm,
}: FindGymsAroundParams) {
  const deltaLatitude = radiusInKm / KM_PER_DEGREE_LATITUDE
  const deltaLongitude =
    radiusInKm / (KM_PER_DEGREE_LATITUDE * Math.cos((latitude * Math.PI) / 180))

  const bbox = [
    latitude - deltaLatitude,
    longitude - deltaLongitude,
    latitude + deltaLatitude,
    longitude + deltaLongitude,
  ]
    .map((value) => value.toFixed(5))
    .join(',')

  return `[out:json][timeout:90][bbox:${bbox}];
(
  nwr["leisure"="fitness_centre"]["name"];
  nwr["amenity"="gym"]["name"];
  nwr["leisure"="sports_centre"]["name"]["sport"];
  nwr["leisure"="dance"]["name"];
);
out center tags;`
}

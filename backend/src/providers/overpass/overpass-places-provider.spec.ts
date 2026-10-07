import { PlacesProviderUnavailableError } from '@/use-cases/errors/places-provider-unavailable-error'
import { describe, expect, it, vi } from 'vitest'
import { OverpassPlacesProvider } from './overpass-places-provider'

const center = { latitude: -23.5614, longitude: -46.6559 }

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const gymElement = (
  id: number,
  name: string,
  latitude: number,
  longitude: number,
) => ({
  type: 'node',
  id,
  lat: latitude,
  lon: longitude,
  tags: { leisure: 'fitness_centre', name },
})

function makeProvider(fetchFn: typeof fetch) {
  return new OverpassPlacesProvider({
    endpoints: ['https://first.test', 'https://second.test'],
    rounds: 2,
    retryDelayInMs: 0,
    fetchFn,
  })
}

describe('OverpassPlacesProvider', () => {
  it('returns gyms inside the radius, closest first, without duplicates', async () => {
    const fetchFn = vi.fn<typeof fetch>().mockResolvedValue(
      jsonResponse({
        elements: [
          gymElement(1, 'Two km away', -23.5434, -46.6559),
          gymElement(2, 'Next door', -23.5618, -46.6559),
          gymElement(2, 'Next door', -23.5618, -46.6559),
          // inside the bounding box corner, but outside the 10 km circle
          gymElement(3, 'Corner', -23.48, -46.57),
        ],
      }),
    )

    const gyms = await makeProvider(fetchFn).findGymsAround({
      ...center,
      radiusInKm: 10,
    })

    expect(gyms.map((gym) => gym.title)).toEqual(['Next door', 'Two km away'])
  })

  it('falls back to the next server when one is busy', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response('Gateway Timeout', { status: 504 }))
      .mockResolvedValueOnce(
        jsonResponse({ elements: [gymElement(1, 'Gym', -23.5614, -46.6559)] }),
      )

    const gyms = await makeProvider(fetchFn).findGymsAround({
      ...center,
      radiusInKm: 10,
    })

    expect(gyms).toHaveLength(1)
    expect(fetchFn.mock.calls[1][0]).toBe('https://second.test')
  })

  it('treats a 200 response with a runtime error remark as a failure', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        jsonResponse({
          elements: [],
          remark: 'runtime error: Query timed out',
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({ elements: [gymElement(1, 'Gym', -23.5614, -46.6559)] }),
      )

    const gyms = await makeProvider(fetchFn).findGymsAround({
      ...center,
      radiusInKm: 10,
    })

    expect(gyms).toHaveLength(1)
  })

  it('gives up with a domain error after every server failed every round', async () => {
    const fetchFn = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new Error('network down'))

    await expect(
      makeProvider(fetchFn).findGymsAround({ ...center, radiusInKm: 10 }),
    ).rejects.toBeInstanceOf(PlacesProviderUnavailableError)
    expect(fetchFn).toHaveBeenCalledTimes(4) // 2 servers x 2 rounds
  })
})

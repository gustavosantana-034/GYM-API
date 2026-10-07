/**
 * Imports real gyms from OpenStreetMap around a point.
 *
 *   npm run gyms:import -- --lat -23.5614 --lng -46.6559 [--radius 10] [--dry-run]
 *
 * --dry-run only lists what would be imported, without touching the database.
 */
import 'dotenv/config'
import { prisma } from '@/lib/prisma'
import { OverpassPlacesProvider } from '@/providers/overpass/overpass-places-provider'
import { makeImportNearbyGymsUseCase } from '@/use-cases/factories/make-import-nearby-gyms-use-case'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

/**
 * Reads `--name value` or `--name=value`. Hand-rolled because node:util's
 * parseArgs rejects negative values ("--lat -23.5"), i.e. all of Brazil.
 */
function readOption(name: string) {
  const args = process.argv.slice(2)
  const inline = args.find((arg) => arg.startsWith(`--${name}=`))
  if (inline) return inline.split('=')[1]

  const index = args.indexOf(`--${name}`)
  return index >= 0 ? args[index + 1] : undefined
}

const values = {
  lat: readOption('lat'),
  lng: readOption('lng'),
  radius: readOption('radius') ?? '10',
  'dry-run': process.argv.includes('--dry-run'),
}

const latitude = Number(values.lat)
const longitude = Number(values.lng)
const radiusInKm = Number(values.radius)

if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
  console.error(
    'Usage: npm run gyms:import -- --lat <latitude> --lng <longitude> [--radius 10] [--dry-run]',
  )
  process.exit(1)
}

async function main() {
  console.log(
    `Searching OpenStreetMap for gyms within ${radiusInKm} km of ${latitude}, ${longitude}...`,
  )

  if (values['dry-run']) {
    const gyms = await new OverpassPlacesProvider().findGymsAround({
      latitude,
      longitude,
      radiusInKm,
    })

    for (const gym of gyms) {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        gym,
      )
      console.log(
        `${distance.toFixed(2).padStart(6)} km  ${gym.title.padEnd(40)} ${gym.modalities.join(', ')}`,
      )
    }

    console.log(`\n${gyms.length} gyms found (dry run, nothing saved).`)
    return
  }

  const { found, created, updated } =
    await makeImportNearbyGymsUseCase().execute({
      latitude,
      longitude,
      radiusInKm,
    })

  console.log(`✔ ${found} gyms found: ${created} created, ${updated} updated.`)
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

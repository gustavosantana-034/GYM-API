import { OverpassPlacesProvider } from '@/providers/overpass/overpass-places-provider'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { ImportNearbyGymsUseCase } from '../import-nearby-gyms-use-case'

export function makeImportNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const placesProvider = new OverpassPlacesProvider()

  return new ImportNearbyGymsUseCase(gymsRepository, placesProvider)
}

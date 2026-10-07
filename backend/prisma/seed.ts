/**
 * Development seed: one admin, one member and a set of fictional gyms spread
 * around a center point. Set SEED_LATITUDE / SEED_LONGITUDE to your own
 * location to be able to check in from where you are.
 *
 *   npm run db:seed            # create users and gyms (skips existing gyms)
 *   npm run db:seed -- --reset # delete every gym and check-in first
 *   npm run db:seed -- --users-only          # only the two accounts
 *   npm run db:seed -- --reset --users-only  # remove all gyms, keep accounts
 *
 * To use real gyms instead of these samples, see `npm run gyms:import`.
 */
import { Modality, PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

const center = {
  latitude: Number(process.env.SEED_LATITUDE ?? -23.5614), // Av. Paulista, SP
  longitude: Number(process.env.SEED_LONGITUDE ?? -46.6559),
}

const SEED_PASSWORD = '123456'

interface SeedGym {
  title: string
  description: string
  phone: string
  address: string
  modalities: Modality[]
  /** Offset from the center, in meters (north, east). */
  offset: [number, number]
}

const gyms: SeedGym[] = [
  {
    title: 'Iron House',
    description:
      'Musculação de alto rendimento com área de peso livre, plataformas de levantamento e acompanhamento de treinadores.',
    phone: '(11) 3000-1001',
    address: 'Rua Haddock Lobo, 150 - Cerqueira César',
    modalities: ['WEIGHT_TRAINING', 'FUNCTIONAL'],
    offset: [40, 30], // close enough to check in from the center
  },
  {
    title: 'Box Vertical',
    description:
      'Box de CrossFit com turmas a cada hora, do iniciante ao competidor.',
    phone: '(11) 3000-1002',
    address: 'Alameda Santos, 820 - Jardim Paulista',
    modalities: ['CROSSFIT', 'FUNCTIONAL'],
    offset: [450, -300],
  },
  {
    title: 'Respira Yoga',
    description:
      'Estúdio de yoga e pilates com aulas em grupo pequeno e luz natural.',
    phone: '(11) 3000-1003',
    address: 'Rua Peixoto Gomide, 410 - Jardim Paulista',
    modalities: ['YOGA', 'PILATES'],
    offset: [-600, 250],
  },
  {
    title: 'Aqua Center',
    description:
      'Piscina semiolímpica aquecida, natação para adultos e hidroginástica.',
    phone: '(11) 3000-1004',
    address: 'Rua Frei Caneca, 1200 - Consolação',
    modalities: ['SWIMMING', 'FUNCTIONAL'],
    offset: [900, 700],
  },
  {
    title: 'Dojo Kaizen',
    description: 'Jiu-jitsu, muay thai e boxe com professores faixa-preta.',
    phone: '(11) 3000-1005',
    address: 'Rua Augusta, 2300 - Jardins',
    modalities: ['MARTIAL_ARTS'],
    offset: [-1200, -400],
  },
  {
    title: 'Pulso Funcional',
    description:
      'Treino funcional em circuito de 45 minutos, focado em condicionamento.',
    phone: '(11) 3000-1006',
    address: 'Rua Bela Cintra, 1500 - Consolação',
    modalities: ['FUNCTIONAL', 'WEIGHT_TRAINING'],
    offset: [1500, -900],
  },
  {
    title: 'Studio Equilíbrio',
    description: 'Pilates em aparelhos com sessões individuais e em dupla.',
    phone: '(11) 3000-1007',
    address: 'Rua Oscar Freire, 900 - Jardim Paulista',
    modalities: ['PILATES'],
    offset: [-1800, -1100],
  },
  {
    title: 'Ritmo Dance Club',
    description: 'Aulas de dança fitness, zumba e ritmos para todas as idades.',
    phone: '(11) 3000-1008',
    address: 'Rua da Consolação, 2600 - Consolação',
    modalities: ['DANCE'],
    offset: [2200, 1400],
  },
  {
    title: 'Forja Strength Lab',
    description:
      'Powerlifting e musculação com avaliação física inclusa no plano.',
    phone: '(11) 3000-1009',
    address: 'Av. Brigadeiro Luís Antônio, 3100 - Jardim Paulista',
    modalities: ['WEIGHT_TRAINING', 'CROSSFIT'],
    offset: [-2600, 1800],
  },
  {
    title: 'Onda Natação',
    description:
      'Escola de natação com turmas infantis e treino de performance.',
    phone: '(11) 3000-1010',
    address: 'Rua Estados Unidos, 700 - Jardim América',
    modalities: ['SWIMMING'],
    offset: [-3800, -2500],
  },
  {
    title: 'Centro Movimento',
    description:
      'Academia completa: musculação, yoga, lutas e dança em um só lugar.',
    phone: '(11) 3000-1011',
    address: 'Rua Vergueiro, 1800 - Paraíso',
    modalities: ['WEIGHT_TRAINING', 'YOGA', 'MARTIAL_ARTS', 'DANCE'],
    offset: [-1000, 4200],
  },
  {
    title: 'Trilha Outdoor Training',
    description: 'Treinos funcionais ao ar livre em grupos pela manhã.',
    phone: '(11) 3000-1012',
    address: 'Av. Pedro Álvares Cabral - Parque Ibirapuera',
    modalities: ['FUNCTIONAL'],
    offset: [-7500, 3000],
  },
  {
    title: 'Garra Fight Team',
    description: 'Equipe de MMA e wrestling com treinos de competição.',
    phone: '(11) 3000-1013',
    address: 'Rua Cardeal Arcoverde, 1000 - Pinheiros',
    modalities: ['MARTIAL_ARTS', 'FUNCTIONAL'],
    offset: [1800, -6800],
  },
]

const METERS_PER_DEGREE_LATITUDE = 111_320

function offsetCoordinates([north, east]: [number, number]) {
  const latitude = center.latitude + north / METERS_PER_DEGREE_LATITUDE
  const metersPerDegreeLongitude =
    METERS_PER_DEGREE_LATITUDE * Math.cos((center.latitude * Math.PI) / 180)
  const longitude = center.longitude + east / metersPerDegreeLongitude

  return { latitude, longitude }
}

async function seedUsers() {
  const password_hash = await hash(SEED_PASSWORD, 10)

  const users = [
    { name: 'Admin', email: 'admin@gymplatform.dev', role: 'ADMIN' as const },
    {
      name: 'Gustavo',
      email: 'member@gymplatform.dev',
      role: 'MEMBER' as const,
    },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password_hash },
    })
  }

  console.log(`✔ Users: ${users.map((user) => user.email).join(', ')}`)
  console.log(`  Password for both: ${SEED_PASSWORD}`)
}

async function seedGyms() {
  if (process.argv.includes('--reset')) {
    await prisma.checkIn.deleteMany()
    await prisma.gym.deleteMany()
  }

  if (process.argv.includes('--users-only')) {
    console.log('✔ Gyms: skipped (--users-only)')
    return
  }

  const existingTitles = new Set(
    (await prisma.gym.findMany({ select: { title: true } })).map(
      (gym) => gym.title,
    ),
  )

  const newGyms = gyms.filter((gym) => !existingTitles.has(gym.title))

  await prisma.gym.createMany({
    data: newGyms.map(({ offset, ...gym }) => ({
      ...gym,
      ...offsetCoordinates(offset),
    })),
  })

  console.log(
    `✔ Gyms: ${newGyms.length} created around ${center.latitude}, ${center.longitude}`,
  )
}

async function main() {
  await seedUsers()
  await seedGyms()
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())

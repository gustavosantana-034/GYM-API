import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Nearby Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.checkIn.deleteMany(),
      prisma.gym.deleteMany(),
      prisma.user.deleteMany(),
    ])
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Search JavaScript Gym',
        description: 'A great gym for JavaScript enthusiasts',
        phone: '11999999999',
        latitude: -23.28795,
        longitude: -45.89437,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Search TypeScript Gym',
        description: 'A great gym for TypeScript enthusiasts',
        phone: '11999999999',
        latitude: -23.0642476,
        longitude: -46.4182858,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.2805045,
        longitude: -45.8944638,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Search JavaScript Gym',
        }),
      ]),
    )
    expect(response.body.gyms).toHaveLength(1)
  })
  it('should find a gym when standing exactly on its coordinates', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Rounding in acos() used to make Postgres throw for identical points
    await prisma.gym.create({
      data: { title: 'Exact Gym', latitude: -23.55052, longitude: -46.633308 },
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -23.55052, longitude: -46.633308 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Exact Gym' }),
    ])
  })

  it('should filter by radius and accept longitudes beyond 90 degrees', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Los Angeles: longitude -118 was rejected by the old validation
    await prisma.gym.createMany({
      data: [
        { title: 'Close Gym', latitude: 34.0522, longitude: -118.2437 },
        { title: '5 km Gym', latitude: 34.0972, longitude: -118.2437 },
      ],
    })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: 34.0522, longitude: -118.2437, radius: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({ title: 'Close Gym', longitude: -118.2437 }),
    ])
  })
})

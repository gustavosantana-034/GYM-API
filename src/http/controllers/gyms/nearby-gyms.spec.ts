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
})

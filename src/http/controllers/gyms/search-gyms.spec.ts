import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Search Gyms Controller', () => {
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

  it('should be able to search a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'UniqueJS Gym',
        description: 'A gym focused on UniqueJS programming',
        phone: '11999999999',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Python Academy',
        description: 'A great academy for Python developers',
        phone: '11999999999',
        latitude: -23.55052,
        longitude: -46.633308,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({
        query: 'UniqueJS',
        page: 1,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'UniqueJS Gym',
        }),
      ]),
    )
    expect(response.body.gyms).toHaveLength(1)
  })
})

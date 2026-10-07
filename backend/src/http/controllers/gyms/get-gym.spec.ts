import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Get Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get a gym with numeric coordinates', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        title: 'Iron House',
        address: 'Rua Exemplo, 100',
        modalities: ['CROSSFIT'],
        latitude: -23.55052,
        longitude: -46.633308,
      },
    })

    const response = await request(app.server)
      .get(`/gyms/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        id: gym.id,
        title: 'Iron House',
        address: 'Rua Exemplo, 100',
        modalities: ['CROSSFIT'],
        latitude: -23.55052,
        longitude: -46.633308,
      }),
    )
  })

  it('should answer 404 for an inexistent gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get(`/gyms/${randomUUID()}`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(404)
  })
})

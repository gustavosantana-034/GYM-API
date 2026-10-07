import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const gymBody = {
  title: 'Iron House Prime',
  description: 'Renovated',
  phone: '',
  address: 'Rua Nova, 200',
  modalities: ['WEIGHT_TRAINING', 'YOGA'],
  latitude: -23.5,
  longitude: -46.6,
}

describe('Update Gym Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should allow admins to update a gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const gym = await prisma.gym.create({
      data: { title: 'Iron House', latitude: -23.55, longitude: -46.63 },
    })

    const response = await request(app.server)
      .put(`/gyms/${gym.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(gymBody)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gym).toEqual(
      expect.objectContaining({
        title: 'Iron House Prime',
        phone: null,
        modalities: ['WEIGHT_TRAINING', 'YOGA'],
        latitude: -23.5,
      }),
    )
  })

  it('should answer 404 when the gym does not exist', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .put(`/gyms/${randomUUID()}`)
      .set('Authorization', `Bearer ${token}`)
      .send(gymBody)

    expect(response.statusCode).toEqual(404)
  })
})

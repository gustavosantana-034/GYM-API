import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'

describe('Create Check-In Controller', () => {
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

  it('should be able to create check-in', async () => {
    const { token, email } = await createAndAuthenticateUser(app)
    await prisma.user.findUniqueOrThrow({ where: { email } })

    const gym = await prisma.gym.create({
      data: {
        title: 'JavaScript Gym',
        description: 'A great gym for JavaScript enthusiasts',
        phone: '11999999999',
        latitude: -23.55052,
        longitude: -46.633308,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: Number(gym.latitude),
        longitude: Number(gym.longitude),
      })

    expect(response.statusCode).toEqual(201)
    expect(response.body.checkIn).toEqual(
      expect.objectContaining({ gym_id: gym.id, validated_at: null }),
    )
  })

  it('should answer 422 when the user is too far from the gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: { title: 'Gym', latitude: -23.55052, longitude: -46.633308 },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({ latitude: -23.56, longitude: -46.64 }) // ~1.4 km away

    expect(response.statusCode).toEqual(422)
  })

  it('should answer 409 on a second check-in on the same day', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: { title: 'Gym', latitude: -23.55052, longitude: -46.633308 },
    })

    const checkIn = () =>
      request(app.server)
        .post(`/gyms/${gym.id}/check-ins`)
        .set('Authorization', `Bearer ${token}`)
        .send({ latitude: -23.55052, longitude: -46.633308 })

    await checkIn()
    const response = await checkIn()

    expect(response.statusCode).toEqual(409)
  })

  it('should answer 404 for an inexistent gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post(`/gyms/${randomUUID()}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({ latitude: -23.55052, longitude: -46.633308 })

    expect(response.statusCode).toEqual(404)
  })
})

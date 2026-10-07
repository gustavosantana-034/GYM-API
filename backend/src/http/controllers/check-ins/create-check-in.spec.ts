import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
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
  })
})

import { app } from '@/app'
import { prisma } from '@/lib/prisma'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Fetch Check-Ins Controller (admin)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should list pending check-ins with their user and gym', async () => {
    const { token } = await createAndAuthenticateUser(app, true)
    const member = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: { title: 'Iron House', latitude: -23.55, longitude: -46.63 },
    })

    await prisma.checkIn.createMany({
      data: [
        { gym_id: gym.id, user_id: member.userId },
        { gym_id: gym.id, user_id: member.userId, validated_at: new Date() },
      ],
    })

    const response = await request(app.server)
      .get('/check-ins')
      .query({ status: 'pending' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        validated_at: null,
        gym: expect.objectContaining({ title: 'Iron House' }),
        user: expect.objectContaining({ email: member.email }),
      }),
    ])
  })
})

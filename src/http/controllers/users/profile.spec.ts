import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'

describe('Profile Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should to be able to get user profile', async () => {
    const uniqueEmail = `johndoe-${randomUUID()}@example.com`

    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: uniqueEmail,
      password: '123456',
    })
    const authResponse = await request(app.server).post('/sessions').send({
      email: uniqueEmail,
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: uniqueEmail,
      }),
    )
  })
})

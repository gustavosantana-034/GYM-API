import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    const { cookies } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })

  it('should keep the admin role in the refreshed access token', async () => {
    const { cookies } = await createAndAuthenticateUser(app, true)

    const refreshResponse = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${refreshResponse.body.token}`)
      .send({ title: 'Admin Gym', latitude: -23.5, longitude: -46.6 })

    expect(response.statusCode).toEqual(201)
  })

  it('should answer 401 without a refresh token cookie', async () => {
    const response = await request(app.server).patch('/token/refresh').send()

    expect(response.statusCode).toEqual(401)
  })
})

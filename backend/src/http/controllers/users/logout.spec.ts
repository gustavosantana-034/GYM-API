import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Logout Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should clear the refresh token cookie', async () => {
    const { cookies } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/sessions/logout')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(204)
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringMatching(/^refreshToken=;.*Expires=Thu, 01 Jan 1970/),
    ])
  })
})

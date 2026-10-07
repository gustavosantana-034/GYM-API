import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authorization (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.each([
    ['get', '/me'],
    ['get', '/gyms/search'],
    ['get', '/check-ins/history'],
    ['post', '/gyms'],
  ] as const)(
    'should reject %s %s without a token with 401',
    async (method, url) => {
      const response = await request(app.server)[method](url).send()

      expect(response.statusCode).toEqual(401)
    },
  )

  it('should reject an invalid token with 401', async () => {
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', 'Bearer not-a-real-token')
      .send()

    expect(response.statusCode).toEqual(401)
  })

  it.each([
    ['post', '/gyms'],
    ['put', `/gyms/${randomUUID()}`],
    ['get', '/check-ins'],
    ['patch', `/check-ins/${randomUUID()}/validate`],
  ] as const)(
    'should forbid members from %s %s with 403',
    async (method, url) => {
      const { token } = await createAndAuthenticateUser(app)

      const response = await request(app.server)
        [method](url)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Gym',
          latitude: -23.5,
          longitude: -46.6,
        })

      expect(response.statusCode).toEqual(403)
    },
  )
})

import { app } from '@/app'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Authenticate Controller', () => {
  const email = `johndoe-${randomUUID()}@example.com`

  beforeAll(async () => {
    await app.ready()

    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email, password: '123456' })
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({ email, password: '123456' })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({ token: expect.any(String) })
  })

  it('should answer 401 for a wrong password', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({ email, password: 'wrong-password' })

    expect(response.statusCode).toEqual(401)
  })

  it('should answer 401 for an unknown email', async () => {
    const response = await request(app.server)
      .post('/sessions')
      .send({ email: 'nobody@example.com', password: '123456' })

    expect(response.statusCode).toEqual(401)
  })
})

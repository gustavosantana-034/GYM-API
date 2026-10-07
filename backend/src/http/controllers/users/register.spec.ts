import { app } from '@/app'
import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Register Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: `johndoe-${randomUUID()}@example.com`,
        password: '123456',
      })

    expect(response.statusCode).toEqual(201)
    // The refresh token is only delivered as an httpOnly cookie
    expect(response.body).toEqual({ token: expect.any(String) })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringMatching(/^refreshToken=.+HttpOnly/),
    ])
  })

  it('should not be able to register the same email twice', async () => {
    const email = `johndoe-${randomUUID()}@example.com`

    await request(app.server)
      .post('/users')
      .send({ name: 'John Doe', email, password: '123456' })

    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: email.toUpperCase(),
      password: '123456',
    })

    expect(response.statusCode).toEqual(409)
  })

  it('should validate the request body', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({ name: '', email: 'not-an-email', password: '123' })

    expect(response.statusCode).toEqual(400)
    expect(response.body.issues).toEqual(
      expect.objectContaining({
        name: expect.any(Array),
        email: expect.any(Array),
        password: expect.any(Array),
      }),
    )
  })
})

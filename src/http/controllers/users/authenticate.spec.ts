import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'

describe('Authenticate Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should to be able to authenticate', async () => {
    const uniqueEmail = `johndoe-${randomUUID()}@example.com`

    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      email: uniqueEmail,
      password: '123456',
    })
    const response = await request(app.server).post('/sessions').send({
      email: uniqueEmail,
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})

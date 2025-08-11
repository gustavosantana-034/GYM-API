import { app } from '@/app'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { randomUUID } from 'node:crypto'

describe('Register Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const uniqueEmail = `johndoe-${randomUUID()}@example.com`

    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: uniqueEmail,
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})

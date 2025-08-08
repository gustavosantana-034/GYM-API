import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

export const createAndAuthenticateUser = async (app: FastifyInstance) => {
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

  return {
    token,
    email: uniqueEmail,
  }
}

import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import request from 'supertest'

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  isAdmin = false,
) => {
  const uniqueEmail = `johndoe-${randomUUID()}@example.com`

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: uniqueEmail,
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
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

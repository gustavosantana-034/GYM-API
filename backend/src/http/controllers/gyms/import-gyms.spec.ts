import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'
import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// The happy path calls OpenStreetMap, so it is covered by unit tests with a
// fake provider; here only the HTTP contract is checked.
describe('Import Gyms Controller', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should forbid members from importing gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms/import')
      .set('Authorization', `Bearer ${token}`)
      .send({ latitude: -23.56, longitude: -46.65 })

    expect(response.statusCode).toEqual(403)
  })

  it('should validate the position and the radius', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms/import')
      .set('Authorization', `Bearer ${token}`)
      .send({ latitude: 120, longitude: -46.65, radius: 100 })

    expect(response.statusCode).toEqual(400)
    expect(Object.keys(response.body.issues)).toEqual(['latitude', 'radius'])
  })
})

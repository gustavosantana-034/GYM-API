import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { EmailAlreadyExists } from './errors/email-already-exists'

describe('Register Use Case', () => {
  it('should be to register', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })

    // console.log(user.id)
    // console.log(typeof user.id)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = 'jhondoe@example.com'

    await registerUseCase.execute({
      name: 'Jhon Doe',
      email,
      password: '123456',
    })

    await expect(
      registerUseCase.execute({
        name: 'Jhon Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(EmailAlreadyExists)
  })
})

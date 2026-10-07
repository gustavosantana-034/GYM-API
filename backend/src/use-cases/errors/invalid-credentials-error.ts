import { CustomError } from 'ts-custom-error'

export class InvalidCredentialsError extends CustomError {
  constructor() {
    super('Invalid credentials!')
  }
}

import { CustomError } from 'ts-custom-error'

export class CheckInAlreadyValidatedError extends CustomError {
  constructor() {
    super('This check-in has already been validated.')
  }
}

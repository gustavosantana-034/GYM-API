import { CustomError } from 'ts-custom-error'

export class LateCheckInValidationError extends CustomError {
  constructor() {
    super(
      'The check-in can only be validated until 20 minutes of it is validation !',
    )
  }
}

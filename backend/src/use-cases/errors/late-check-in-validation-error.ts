import { CustomError } from 'ts-custom-error'

export class LateCheckInValidationError extends CustomError {
  constructor() {
    super(
      'The check-in can only be validated up to 20 minutes after its creation.',
    )
  }
}

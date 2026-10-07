import { CustomError } from 'ts-custom-error'

export class MaxNumberOfCheckInsError extends CustomError {
  constructor() {
    super('You have already checked in today.')
  }
}

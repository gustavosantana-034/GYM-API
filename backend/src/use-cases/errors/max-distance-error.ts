import { CustomError } from 'ts-custom-error'

export class MaxDistanceError extends CustomError {
  constructor() {
    super('You must be within 100 meters of the gym to check in.')
  }
}

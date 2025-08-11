import { CustomError } from 'ts-custom-error'

export class MaxDistanceError extends CustomError {
  constructor() {
    super('Max distance reached!')
  }
}

import { CustomError } from 'ts-custom-error'

export class MaxNumberOfCheckInsError extends CustomError {
  constructor() {
    super('Max number of check-ins reached!')
  }
}

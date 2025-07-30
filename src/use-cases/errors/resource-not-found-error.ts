import { CustomError } from 'ts-custom-error'

export class ResourceNotFoundError extends CustomError {
  constructor() {
    super('Resource Not Found!')
  }
}

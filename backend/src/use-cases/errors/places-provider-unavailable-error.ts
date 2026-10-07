import { CustomError } from 'ts-custom-error'

export class PlacesProviderUnavailableError extends CustomError {
  constructor() {
    super(
      'The gyms database (OpenStreetMap) is unavailable right now. Try again in a few minutes.',
    )
  }
}

import { CustomError } from 'ts-custom-error'

export class EmailAlreadyExists extends CustomError {
  constructor() {
    super('Email already exists!')
  }
}

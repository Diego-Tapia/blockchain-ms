import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerException extends HttpException {
  a:string;
  constructor(message: string = 'Internal Server Error') {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    this.a='asdf'
  }
}
import { NotFoundException } from '@nestjs/common';

export class LoginErrorException extends NotFoundException {
  constructor(error?: string) {
    super('error.login_error', error);
  }
}

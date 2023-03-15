import { NotFoundException } from '@nestjs/common';

export class UserBlockedException extends NotFoundException {
  constructor(error?: string) {
    super('error.user_blocked', error);
  }
}

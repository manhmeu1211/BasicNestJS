import { BadRequestException } from '@nestjs/common';

export class CustomError extends BadRequestException {
  constructor(message: string, error?: string) {
    super(message, error);
  }
}

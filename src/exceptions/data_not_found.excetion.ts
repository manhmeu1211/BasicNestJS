import { NotFoundException } from '@nestjs/common';

export class DataNotFoundException extends NotFoundException {
  constructor(error?: string) {
    super('error.data_not_found', error);
  }
}

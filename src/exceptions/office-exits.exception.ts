import { NotFoundException } from '@nestjs/common';

export class OfficeExitsException extends NotFoundException {
  constructor(error?: string) {
    super('error.office_exits', error);
  }
}

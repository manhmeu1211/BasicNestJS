import { NotFoundException } from '@nestjs/common';

export class OfficeNotExitsException extends NotFoundException {
  constructor(error?: string) {
    super('error.office_not_exits', error);
  }
}

import { NotFoundException } from '@nestjs/common';

export class PaymentNotExitsException extends NotFoundException {
  constructor(error?: string) {
    super('error.payment_not_exits', error);
  }
}

import { NotFoundException } from '@nestjs/common';

export class PaymentExitsException extends NotFoundException {
  constructor(error?: string) {
    super('error.payment_exits', error);
  }
}

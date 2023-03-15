import { ApiProperty } from '@nestjs/swagger';

export class ResetPassDto {
  @ApiProperty()
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}

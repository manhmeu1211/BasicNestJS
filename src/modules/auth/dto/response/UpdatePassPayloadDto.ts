import { ApiProperty } from '@nestjs/swagger';

export class UpdatePassPayloadDto {
  @ApiProperty()
  isSuccess: boolean;

  constructor(isSuccess: boolean) {
    this.isSuccess = isSuccess;
  }
}

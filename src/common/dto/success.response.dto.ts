import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty()
  readonly success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}

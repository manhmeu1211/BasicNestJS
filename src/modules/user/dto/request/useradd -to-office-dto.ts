import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserAddToOfficeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly officeId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCurrentOfficeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly officeId: number;
}

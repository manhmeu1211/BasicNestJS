import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserRoleRequestDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly roleId: number;
}

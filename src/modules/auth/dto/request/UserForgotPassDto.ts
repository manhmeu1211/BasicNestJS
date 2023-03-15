import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserForgotPassDto {
  @IsEmail()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;
}

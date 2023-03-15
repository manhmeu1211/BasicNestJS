import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsString()
  @IsEmail()
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

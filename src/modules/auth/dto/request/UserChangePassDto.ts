import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class UserChangePassDto {
  @IsEmail()
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}

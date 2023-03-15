import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class BlockUserDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readonly isBlock: boolean;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RoleRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  officeId?: number;
}

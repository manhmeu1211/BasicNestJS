import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class EmployeeSSORequestDto {
  @ApiPropertyOptional({
    default: 1,
  })
  @ApiPropertyOptional()
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    default: 6000,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page_size = 6000;

  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNumber()
  @Transform((o) => Number.parseInt(o.value))
  role_id?: number;
}

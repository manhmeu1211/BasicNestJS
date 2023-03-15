import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ArrayUnique } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly nameUser: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly department?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly province?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly building?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly buildingNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly addressOther?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  readonly zipcode?: number;

  @ApiProperty()
  @IsArray()
  @ArrayUnique((o) => o)
  readonly officeIds: number[];
}

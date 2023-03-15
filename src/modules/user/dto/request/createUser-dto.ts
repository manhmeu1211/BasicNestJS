import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly nameUser: string;

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

  @ApiPropertyOptional()
  @IsArray()
  readonly officeIds?: number[];
}

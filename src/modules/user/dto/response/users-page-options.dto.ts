import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { WhereUserType } from '../../../../common/constants/where-user.type';
import { PageOptionsDto } from '../../../../common/dto/page-options.dto';

export class UsersPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  readonly officeIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  readonly whereOption?: WhereUserType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform((obj) => {
    const a = obj.value;
    return a.toString().toLowerCase() === 'true' ? true : false;
  })
  readonly isBlock?: boolean;
}

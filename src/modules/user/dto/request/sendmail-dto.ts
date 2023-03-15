import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class SendMailDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform((obj) => {
    const a = obj.value;
    return a.toString().toLowerCase() === 'true' ? true : false;
  })
  isSendMail?: boolean;
}

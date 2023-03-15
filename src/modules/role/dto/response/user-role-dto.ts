import { ApiProperty } from '@nestjs/swagger';

export class UserSSODto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  officeCode: string;

  constructor(name: string, code: string, email: string, officeCode: string) {
    this.name = name;
    this.code = code;
    this.email = email;
    this.officeCode = officeCode;
  }
}

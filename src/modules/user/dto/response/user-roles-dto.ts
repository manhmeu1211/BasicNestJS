import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user-dto';

export class UserRolesDto {
  @ApiProperty()
  superAdmin: UserDto[];

  @ApiProperty()
  systemAdmin: UserDto[];

  @ApiProperty()
  admin: UserDto[];

  @ApiProperty()
  staff: UserDto[];

  @ApiProperty()
  supplier: UserDto[];

  constructor(systemAdmin: UserDto[], admin: UserDto[], staff: UserDto[], supplier: UserDto[]) {
    this.systemAdmin = systemAdmin;
    this.admin = admin;
    this.staff = staff;
    this.supplier = supplier;
  }
}

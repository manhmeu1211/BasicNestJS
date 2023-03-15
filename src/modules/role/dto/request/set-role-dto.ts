import { ApiProperty } from '@nestjs/swagger';
import { ArrayUnique, IsArray, IsNotEmpty } from 'class-validator';
import { UserSSODto } from '../response/user-role-dto';

export class UserRoles {
  @ApiProperty()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty()
  @IsNotEmpty()
  @ArrayUnique((o) => o)
  officeIds: number[];
}

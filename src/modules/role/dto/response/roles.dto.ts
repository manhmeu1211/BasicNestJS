import { ApiProperty } from '@nestjs/swagger';
import RolesEntity from '../../../../entities/role.entity';
import { RoleType } from '../../../../common/constants/role.type';
import { AbstractDto } from '../../../../common/dto/abstract.dto';

export class RoleDto extends AbstractDto {
  @ApiProperty()
  role: RoleType;

  constructor(roleEntity: RolesEntity) {
    super(roleEntity);
    this.role = roleEntity.type;
  }
}

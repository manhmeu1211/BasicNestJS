import { Column, DataType, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { RoleType } from '../common/constants/role.type';
import { RoleDto } from '../modules/role/dto/response/roles.dto';

@Table({ modelName: 'Roles' })
@UseDto(RoleDto)
export default class RolesEntity extends AbstractEntity<RoleDto> {
  @Column({
    type: DataType.ENUM(RoleType.SuperAdmin, RoleType.SystemAdmin, RoleType.Admin, RoleType.Staff, RoleType.Supplier),
  })
  type: RoleType;
}

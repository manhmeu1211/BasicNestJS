import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import UserEntity from './user.entity';
import OfficeEntity from './office.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { UserOfficeDto } from '../modules/office/dto/response/useroffice-dto';
import RolesEntity from './role.entity';

@Table({ modelName: 'UserOffice' })
@UseDto(UserOfficeDto)
export default class UserOfficeEntity extends AbstractEntity<UserOfficeDto> {
  @AllowNull(true)
  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => OfficeEntity)
  officeId: number;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => UserEntity)
  userId: number;

  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => OfficeEntity, 'officeId')
  office?: OfficeEntity;

  @BelongsTo(() => UserEntity, 'userId')
  user?: UserEntity;

  @BelongsTo(() => RolesEntity, 'roleId')
  roles?: RolesEntity;
}

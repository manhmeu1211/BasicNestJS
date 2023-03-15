import { LoginType } from '../common/constants/login.type';
import { AllowNull, BelongsToMany, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { UserDto } from '../modules/user/dto/response/user-dto';
import UserOfficeEntity from './useroffice.entity';
import OfficeEntity from './office.entity';

@Table({ modelName: 'Users' })
@UseDto(UserDto)
export default class UserEntity extends AbstractEntity<UserDto> {
  @Column({ type: DataType.STRING(50) })
  name: string;

  @Column({ type: DataType.STRING(50) })
  nameFurigana: string;

  @Column({ type: DataType.STRING(50) })
  email: string;

  @Column({ type: DataType.STRING(50) })
  password: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  phoneNumber: string;

  @Column({ type: DataType.STRING(50) })
  code: string;

  @Column({ type: DataType.STRING })
  department: string;

  @Column({ type: DataType.STRING })
  city: string;

  @Column({ type: DataType.STRING })
  province: string;

  @Column({ type: DataType.STRING })
  building: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  buildingNumber?: string;

  @Column({ type: DataType.STRING })
  addressOther: string;

  @Column({ type: DataType.INTEGER })
  zipcode: number;

  @Column({ type: DataType.BOOLEAN })
  isBlock: boolean;

  @Column({ type: DataType.BOOLEAN })
  isFirstLogin: boolean;

  @Column({
    type: DataType.ENUM,
    values: [LoginType.SSO, LoginType.KSK],
  })
  loginType: LoginType;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  deletedAt?: Date;

  @HasMany(() => UserOfficeEntity, 'userId')
  userOffices?: UserOfficeEntity[];

  @BelongsToMany(() => OfficeEntity, { as: 'office', through: () => UserOfficeEntity })
  office: OfficeEntity[];
}

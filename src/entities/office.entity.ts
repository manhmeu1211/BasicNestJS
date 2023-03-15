import { AllowNull, BelongsToMany, Column, DataType, HasMany, HasOne, Table } from 'sequelize-typescript';
import { AbstractEntity } from '../common/abstract.entity';
import { UseDto } from '../decorators/use-dto.decorator';
import { OfficeDto } from '../modules/office/dto/response/office-dto';
import ElderliesEntity from './elderlies.entity';
import PaymentEntity from './payment.entity';
import UserEntity from './user.entity';
import UserOfficeEntity from './useroffice.entity';

@Table({ modelName: 'Offices' })
@UseDto(OfficeDto)
export default class OfficeEntity extends AbstractEntity<OfficeDto> {
  @Column({ type: DataType.STRING(50) })
  name: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(50) })
  fax: string;

  @Column({
    type: DataType.STRING(50),
  })
  code: string;

  @AllowNull(true)
  @Column({
    type: DataType.INTEGER,
  })
  zipcode: number;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  city: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  province: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  building: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  addressOther: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(50) })
  phoneNumber: string;

  @AllowNull(true)
  @Column({ type: DataType.DATE })
  deletedAt?: Date;

  @AllowNull(true)
  @Column({ type: DataType.STRING })
  buildingNumber?: string;

  @HasMany(() => ElderliesEntity, 'officeCode')
  elderlies?: ElderliesEntity[];

  @HasOne(() => PaymentEntity, 'officeId')
  payment?: PaymentEntity;

  @HasMany(() => UserOfficeEntity, 'officeId')
  userOffices?: UserOfficeEntity[];

  @BelongsToMany(() => UserEntity, { as: 'office', through: () => UserOfficeEntity })
  user: UserEntity[];
}

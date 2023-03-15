import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractDto } from '../../../../common/dto/abstract.dto';
import type UserEntity from '../../../../entities/user.entity';
import { UserOfficeDto } from '../../../../modules/office/dto/response/useroffice-dto';

export class UserDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  bithday?: string;

  @ApiPropertyOptional()
  phoneNumber?: string;

  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  province: string;

  @ApiPropertyOptional()
  building: string;

  @ApiPropertyOptional()
  buildingNumber?: string;

  @ApiPropertyOptional()
  addressOther: string;

  @ApiPropertyOptional()
  zipcode: number;

  @ApiProperty()
  isBlock: boolean;

  @ApiProperty()
  isFirstLogin: boolean;

  @ApiProperty()
  loginType: string;

  @ApiProperty()
  code: string;

  @ApiPropertyOptional()
  userOffices?: UserOfficeDto[];

  @ApiPropertyOptional()
  offices?: UserOfficeDto[];

  @ApiProperty()
  userOfficesCount?: number;

  constructor(userEntity: UserEntity) {
    super(userEntity);
    this.name = userEntity.name;
    this.city = userEntity.city;
    this.addressOther = userEntity.addressOther;
    this.building = userEntity.building;
    this.buildingNumber = userEntity.buildingNumber;
    this.zipcode = userEntity.zipcode;
    this.email = userEntity.email;
    this.loginType = userEntity.loginType;
    this.phoneNumber = userEntity.phoneNumber;
    this.province = userEntity.province;
    this.code = userEntity.code;
    this.isBlock = userEntity.isBlock;
    this.isFirstLogin = userEntity.isFirstLogin;
    this.offices = userEntity.office?.toDtos();
    this.userOffices = userEntity.userOffices?.toDtos();
    this.userOfficesCount = userEntity.office?.length;
  }
}

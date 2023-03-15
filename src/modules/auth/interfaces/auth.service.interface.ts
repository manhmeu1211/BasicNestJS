import { UserDto } from '../../../modules/user/dto/response/user-dto';
import UserEntity from '../../../entities/user.entity';
import { UserLoginDto } from '../dto/request/UserLoginDto';
import { TokenPayloadDto } from '../dto/response/TokenPayloadDto';
import { UserChangePassDto } from '../dto/request/UserChangePassDto';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface IAuthServiceInterface {
  validateUser(userLoginDto: UserLoginDto): Promise<UserDto>;
  createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto>;
  validateSSOUser(email: string): Promise<UserDto>;
  updatePassword(user: UserChangePassDto): Promise<boolean>;
  parseSAMLRes(samlResponse: string): Promise<string>;
  sendMailVerify(email: string): Promise<boolean>;
}

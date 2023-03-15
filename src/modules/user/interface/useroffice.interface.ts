import { RoleRequestDto } from '../../../modules/role/dto/request/role-request-dto';
import UserOfficeEntity from '../../../entities/useroffice.entity';
import { UserSSODto } from '../../../modules/role/dto/response/user-role-dto';

export interface IUserOfficeRepository {
  addUsersToOffice(userId: number, officeIds: number[], roleId: number): Promise<void>;
  updateUsersToOffice(userId: number, officeIds: number[], roleId: number): void;
  destroyUserOffice(userId: number, officeIds: number[]): void;
  findAllByOffAndUser(userId: number): Promise<UserOfficeEntity[]>;
  updateRoleUsers(usersSSO: UserSSODto[], officeIds: number[], roleId: number): Promise<void>;
  getAllRoleUserByOffice(role: RoleRequestDto): Promise<UserOfficeEntity[]>;
}

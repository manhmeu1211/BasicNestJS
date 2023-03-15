import { UserRolesDto } from '../../../modules/user/dto/response/user-roles-dto';
import { RoleRequestDto } from '../dto/request/role-request-dto';
import { UserRoles } from '../dto/request/set-role-dto';

export interface RoleServiceInterface {
  deleteRoleUser(roleId: number, userId: number): Promise<void>;
  updateRoleUsers(userRole: UserRoles): Promise<void>;
  getAllRoleByOffice(officeId: RoleRequestDto): Promise<UserRolesDto>;
}

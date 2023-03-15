import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { RoleServiceInterface } from './interfaces/role.service.interface';
import { isEmpty, isNil } from 'lodash';
import { RoleRepository } from '../../repositories/roles.repository';
import { UserRolesDto } from '../../modules/user/dto/response/user-roles-dto';
import { UserDto } from '../../modules/user/dto/response/user-dto';
import { RoleRequestDto } from './dto/request/role-request-dto';
import { IUserOfficeRepository } from '../../modules/user/interface/useroffice.interface';
import { UserRoles } from './dto/request/set-role-dto';

@Injectable()
export class RoleService implements RoleServiceInterface {
  constructor(
    @Inject('IUserOfficeRepository')
    public readonly userOfficeRepository: IUserOfficeRepository,

    @Inject('RoleRepository')
    public readonly roleRepository: RoleRepository,

    @Inject(Sequelize.name)
    public readonly sequelize: Sequelize,
  ) {}

  async getAllRoleByOffice(role: RoleRequestDto): Promise<UserRolesDto> {
    const systemAdmin: UserDto[] = [];
    const admin: UserDto[] = [];
    const staff: UserDto[] = [];
    const supplier: UserDto[] = [];

    const userOffices = await this.userOfficeRepository.getAllRoleUserByOffice(role);
    userOffices.map((userOffice) => {
      if (!isNil(userOffice.user)) {
        switch (userOffice.roleId) {
          case 2:
            systemAdmin.push(userOffice.user.toDto());
            break;
          case 3:
            admin.push(userOffice.user.toDto());
            break;
          case 4:
            staff.push(userOffice.user.toDto());
            break;
          case 5:
            supplier.push(userOffice.user.toDto());
            break;
          default:
            break;
        }
      }
    });
    return new UserRolesDto(systemAdmin, admin, staff, supplier);
  }

  async deleteRoleUser(roleId: number, userId: number): Promise<void> {
    const userOffice = await this.userOfficeRepository.findAllByOffAndUser(userId);
    if (!isEmpty(userOffice)) {
      userOffice.map(async (e) => {
        await e.update({
          roleId,
        });
      });
    }
  }

  async updateRoleUsers(userRole: UserRoles): Promise<void> {
    await this.userOfficeRepository.updateRoleUsers(userRole.userSSO, userRole.officeIds, userRole.roleId);
  }
}

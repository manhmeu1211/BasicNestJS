import { BaseInterfaceRepository } from '../../../shared/repositories/base.interface.repository';
import RolesEntity from '../../../entities/role.entity';

export interface RoleRepositoryInterface extends BaseInterfaceRepository<RolesEntity> {
  findOneRoleByPk(id: number): Promise<RolesEntity | null>;
}

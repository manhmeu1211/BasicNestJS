import { Inject } from '@nestjs/common';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import RolesEntity from '../entities/role.entity';
import { RoleRepositoryInterface } from '../modules/role/interfaces/role.repository.interface';

export class RoleRepository extends BaseAbstractRepository<RolesEntity> implements RoleRepositoryInterface {
  constructor(
    @Inject(RolesEntity.name)
    public readonly roleRepository: typeof RolesEntity,
  ) {
    super(roleRepository);
  }

  async findOneRoleByPk(id: number): Promise<RolesEntity | null> {
    const role = await this.roleRepository.findOne({
      where: {
        id,
      },
    });
    return role;
  }
}

import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import { Inject } from '@nestjs/common';
import { IUserOfficeRepository } from '../modules/user/interface/useroffice.interface';
import UserOfficeEntity from '../entities/useroffice.entity';
import { Op } from 'sequelize';
import { isEmpty, isNil } from 'lodash';
import UserEntity from '../entities/user.entity';
import { RoleRequestDto } from '../modules/role/dto/request/role-request-dto';
import OfficeEntity from '../entities/office.entity';
import { UserSSODto } from '../modules/role/dto/response/user-role-dto';
import { LoginType } from '../common/constants/login.type';
import { UserRepositoryInterface } from '../modules/user/interface/user.repository.interface';

export class UserOfficeRepository extends BaseAbstractRepository<UserOfficeEntity> implements IUserOfficeRepository {
  constructor(
    @Inject(UserOfficeEntity.name)
    public readonly userOfficeEntity: typeof UserOfficeEntity,
    @Inject(UserEntity.name)
    public readonly userEntity: typeof UserEntity,
    @Inject(OfficeEntity.name)
    public readonly officeEntity: typeof OfficeEntity,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {
    super(userOfficeEntity);
  }

  async findAllByOffAndUser(userId: number): Promise<UserOfficeEntity[]> {
    const userOffice = await this.userOfficeEntity.findAll({
      where: {
        userId,
      },
    });
    return userOffice;
  }

  async updateUsersToOffice(userId: number, officeIds: number[], roleId: number): Promise<void> {
    const userOffIds = await this.userOfficeEntity.findAll({ where: { userId } });

    if (isEmpty(userOffIds)) {
      if (isEmpty(officeIds)) {
        await this.userOfficeEntity.create({
          userId,
          officeId: null,
          roleId,
        });
      } else {
        officeIds.map(async (officeId) => {
          await this.userOfficeEntity.create({
            userId,
            officeId,
            roleId,
          });
        });
      }
    } else {
      const oldOfficeIds: number[] = [];
      userOffIds.map((e) => oldOfficeIds.push(e.officeId));
      officeIds.concat(oldOfficeIds);

      const differences = oldOfficeIds.filter((x) => officeIds.indexOf(x) === -1);
      this.destroyUserOffice(userId, differences);

      if (isEmpty(officeIds)) {
        await this.userOfficeEntity.create({
          userId,
          officeId: null,
          roleId,
        });
      } else {
        officeIds.map(async (officeId) => {
          const isExits = await this.userOfficeEntity.findOne({ where: { officeId, userId } });
          if (isNil(isExits)) {
            await this.userOfficeEntity.create({
              userId,
              officeId,
              roleId,
            });
          }
        });
      }
    }
  }

  async addUsersToOffice(userId: number, officeIds: number[], roleId: number): Promise<void> {
    if (!isEmpty(officeIds)) {
      officeIds.map(async (officeId) => {
        await this.userOfficeEntity.create({
          userId,
          officeId,
          roleId,
        });
      });
    } else {
      await this.userOfficeEntity.create({
        userId,
        roleId,
      });
    }
  }

  destroyUserOffice(userId: number, officeIds: number[]): void {
    officeIds.map(async (officeId) => {
      await this.userOfficeEntity.destroy({
        where: {
          [Op.and]: [{ officeId }, { userId }],
        },
      });
    });
  }

  async findOfficeWithUser(officeId: number): Promise<UserOfficeEntity | null> {
    const userOffice = await this.userOfficeEntity.findOne({
      where: {
        officeId,
      },
    });
    return userOffice;
  }

  async updateRoleUsers(usersSSO: UserSSODto[], officeIds: number[], roleId: number): Promise<void> {
    const userIds: number[] = [];

    await Promise.all(
      usersSSO.map(async (userSSO) => {
        const user = await this.userEntity.findOne({
          where: {
            code: userSSO.code,
          },
        });
        if (!isNil(user)) {
          userIds.push(user.id);
        } else {
          const newUser = await this.userRepository.createUserFromSSO(
            userSSO.email,
            userSSO.name,
            userSSO.code,
            LoginType.SSO,
          );
          userIds.push(newUser.id);
        }
      }),
    );

    switch (roleId) {
      case 2:
        userIds.map(async (userId) => {
          const userOffice = await this.userOfficeEntity.findOne({
            where: {
              userId,
            },
          });
          if (!isNil(userOffice)) {
            await this.userOfficeEntity.destroy({
              where: {
                userId,
              },
            });
          }
          await this.userOfficeEntity.create({
            userId,
            roleId,
            officeId: null,
          });
        });
        break;
      default:
        officeIds.map((officeId) => {
          userIds.map(async (userId) => {
            const userOffice = await this.userOfficeEntity.findOne({
              where: {
                userId,
                officeId,
              },
            });
            if (!isNil(userOffice) && userOffice.roleId !== 2) {
              await userOffice.update({
                roleId,
                officeId,
              });
            }
            if (isNil(userOffice)) {
              await this.userOfficeEntity.create({
                userId,
                roleId,
                officeId,
              });
            }
          });
        });
        break;
    }
  }

  async getAllRoleUserByOffice(role: RoleRequestDto): Promise<UserOfficeEntity[]> {
    let where = {};
    if (!isNil(role.officeId)) {
      where = {
        roleId: [2, 3],
        officeId: role.officeId,
      };
    }
    {
      where = {
        roleId: [2, 3],
      };
    }
    const roles = await this.userOfficeEntity.findAll({
      where,
      group: ['userId'],
      include: [
        {
          model: UserEntity,
          as: 'user',
        },
      ],
    });
    return roles;
  }
}

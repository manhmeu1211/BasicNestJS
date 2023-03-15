import { Inject } from '@nestjs/common';
import { UsersPageOptionsDto } from '../modules/user/dto/response/users-page-options.dto';
import { Op } from 'sequelize';
import _, { isNil, first, isEmpty } from 'lodash';
import type { AbstractEntity } from '../common/abstract.entity';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import type { PageOptionsDto } from '../common/dto/page-options.dto';
import UserEntity from '../entities/user.entity';
import type { UserRepositoryInterface } from '../modules/user/interface/user.repository.interface';
import { BaseAbstractRepository } from '../shared/repositories/base.abstract.repository';
import { UserDto } from '../modules/user/dto/response/user-dto';
import { PageDto } from '../common/dto/page.dto';
import UserOfficeEntity from '../entities/useroffice.entity';
import OfficeEntity from '../entities/office.entity';
import { CreateUserDto } from '../modules/user/dto/request/createUser-dto';
import { UpdateUserDto } from '../modules/user/dto/request/update-user-dto';
import { LoginType } from '../common/constants/login.type';
import { WhereUserType } from '../common/constants/where-user.type';
import { UserNotFoundException } from '../exceptions/user-not-found.exception';
import moment from 'moment';
import RolesEntity from '../entities/role.entity';
import { RoleType } from '../common/constants/role.type';

export class UserRepository extends BaseAbstractRepository<UserEntity> implements UserRepositoryInterface {
  constructor(
    @Inject(UserEntity.name)
    public readonly userRepository: typeof UserEntity,
    @Inject(UserOfficeEntity.name)
    public readonly userOfficeRepository: typeof UserOfficeEntity,
    @Inject(RolesEntity.name)
    public readonly roleRepository: typeof RolesEntity,
  ) {
    super(userRepository);
  }

  async paginateUserByKeyword(
    nrsIds: string[],
    searchOptions: PageOptionsDto,
  ): Promise<{ items: AbstractEntity[]; pageMetaDto: PageMetaDto }> {
    const condition = { nrsId: { [Op.in]: nrsIds } };
    const [items, pageMetaDto] = await this.userRepository.paginate(searchOptions, condition);
    return { items, pageMetaDto };
  }

  async paginateGroup(userOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    let condition = {};
    let where = {};
    let isRequired = false;
    if (!isNil(userOptionsDto.q) && !isNil(userOptionsDto.whereOption)) {
      switch (userOptionsDto.whereOption) {
        case WhereUserType.NAME:
          condition = {
            [Op.and]: [{ name: { [Op.substring]: userOptionsDto.q } }, { deletedAt: null }],
          };
          break;
        case WhereUserType.ID:
          condition = {
            [Op.and]: [{ id: { [Op.substring]: userOptionsDto.q } }, { deletedAt: null }],
          };
          break;
        case WhereUserType.EMAIL:
          condition = {
            [Op.and]: [{ email: { [Op.substring]: userOptionsDto.q } }, { deletedAt: null }],
          };
          break;
        case WhereUserType.PHONENUMBER:
          condition = {
            [Op.and]: [{ phoneNumber: { [Op.substring]: userOptionsDto.q } }, { deletedAt: null }],
          };
          break;
        case WhereUserType.ADDRESS:
          condition = {
            [Op.and]: [
              {
                [Op.or]: [
                  { zipcode: { [Op.substring]: userOptionsDto.q } },
                  { city: { [Op.substring]: userOptionsDto.q } },
                  { province: { [Op.substring]: userOptionsDto.q } },
                  { building: { [Op.substring]: userOptionsDto.q } },
                  { addressOther: { [Op.substring]: userOptionsDto.q } },
                ],
              },
              { deletedAt: null },
            ],
          };
          break;
        default:
          condition = {
            [Op.and]: [{ deletedAt: null }],
          };
          break;
      }
    } else {
      condition = {
        [Op.and]: [{ deletedAt: null }],
      };
    }

    if (!isNil(userOptionsDto.isBlock)) {
      condition = {
        [Op.and]: [{ isBlock: { [Op.is]: userOptionsDto.isBlock } }, { deletedAt: null }],
      };
    }

    if (!isEmpty(userOptionsDto.officeIds) && !isNil(userOptionsDto.officeIds)) {
      where = {
        id: userOptionsDto.officeIds,
      };

      isRequired = true;
    }

    const result = await this.userRepository.findAndCountAll({
      where: condition,
      limit: userOptionsDto.take,
      offset: userOptionsDto.skip,
      distinct: true,
      order: ['id'],
      include: [
        {
          model: UserOfficeEntity,
          as: 'userOffices',
          where: {
            roleId: 5,
          },
          include: [
            {
              model: RolesEntity,
              as: 'roles',
            },
          ],
        },
        {
          model: OfficeEntity,
          where,
          required: isRequired,
          as: 'office',
        },
      ],
    });
    const items = result.rows;
    const pageMeta = new PageMetaDto({ pageOptionsDto: userOptionsDto, itemCount: result.count });
    return items.toPageDto(pageMeta);
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll({
      where: {
        deletedAt: null,
      },
      include: [
        {
          model: UserOfficeEntity,
          as: 'userOffices',
          include: [
            {
              model: OfficeEntity,
              as: 'office',
            },
            {
              model: RolesEntity,
              where: {
                type: { [Op.and]: [{ [Op.notLike]: RoleType.Supplier }, { [Op.notLike]: RoleType.SuperAdmin }] },
              },
              as: 'roles',
            },
          ],
        },
      ],
    });
    return users;
  }

  async deleteUser(userId: number): Promise<boolean> {
    const isSuccess = await this.userRepository.update(
      {
        deletedAt: moment.now(),
      },
      {
        where: {
          id: userId,
        },
      },
    );
    return first(isSuccess) === 1;
  }

  async createUser(userCreateDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.create({
      email: userCreateDto.email,
      name: userCreateDto.nameUser,
      phoneNumber: userCreateDto.phoneNumber,
      department: userCreateDto.department,
      province: userCreateDto.province,
      city: userCreateDto.city,
      building: userCreateDto.building,
      buildingNumber: userCreateDto.buildingNumber,
      zipcode: userCreateDto.zipcode,
      addressOther: userCreateDto.addressOther,
      isFirstLogin: true,
      isBlock: false,
      loginType: LoginType.KSK,
    });
    return user;
  }

  async findOneUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      include: [
        {
          model: UserOfficeEntity,
          as: 'userOffices',
          include: [
            {
              model: RolesEntity,
              as: 'roles',
            },
          ],
        },
        {
          model: OfficeEntity,
          required: false,
          as: 'office',
        },
      ],
      where: {
        email,
        deletedAt: null,
      },
    });
    return user;
  }

  async findOneUserById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      include: [
        {
          model: UserOfficeEntity,
          as: 'userOffices',
          include: [
            {
              model: OfficeEntity,
              as: 'office',
            },
            {
              model: RolesEntity,
              as: 'roles',
            },
          ],
        },
      ],
      where: {
        id,
        deletedAt: null,
      },
    });
    if (isNil(user)) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async createUserFromSSO(email: string, name: string, code: string, loginType: string): Promise<UserEntity> {
    const user = await this.userRepository.create({
      email,
      name,
      code,
      loginType,
      isFirstLogin: true,
      isBlock: false,
    });
    return user;
  }

  async updatePassword(password: string, email: string): Promise<boolean> {
    const user = await this.findOneUserByEmail(email);
    const userId = user?.id;
    const isUpdate = await this.userRepository.update(
      {
        password,
        isFirstLogin: false,
      },
      {
        where: {
          id: userId,
        },
      },
    );
    return first(isUpdate) === 1;
  }

  async updateUser(user: UpdateUserDto, userId: number): Promise<boolean> {
    const isUpdate = await this.userRepository.update(
      {
        email: user.email,
        name: user.nameUser,
        phoneNumber: user.phoneNumber,
        department: user.department,
        province: user.province,
        city: user.city,
        building: user.building,
        buildingNumber: user.buildingNumber,
        zipcode: user.zipcode,
        addressOther: user.addressOther,
      },
      {
        where: {
          id: userId,
        },
      },
    );
    return first(isUpdate) === 1;
  }

  async blockUser(userId: number, isBlock: boolean): Promise<boolean> {
    const isUpdated = await this.userRepository.update(
      {
        isBlock,
      },
      {
        where: {
          id: userId,
        },
      },
    );
    return first(isUpdated) === 1;
  }

  async checkRoleUser(user: UserEntity): Promise<RolesEntity | null> {
    const userOffice = await this.userOfficeRepository.findOne({
      where: {
        userId: user.id,
      },
    });
    const role = await this.roleRepository.findOne({
      where: {
        id: userOffice?.roleId,
      },
    });
    return role;
  }
}

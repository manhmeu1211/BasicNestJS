import RolesEntity from '../../../entities/role.entity';
import { PageDto } from '../../../common/dto/page.dto';
import type UserEntity from '../../../entities/user.entity';
import type { BaseInterfaceRepository } from '../../../shared/repositories/base.interface.repository';
import { CreateUserDto } from '../dto/request/createUser-dto';
import { UpdateUserDto } from '../dto/request/update-user-dto';
import { UserDto } from '../dto/response/user-dto';
import { UsersPageOptionsDto } from '../dto/response/users-page-options.dto';

export interface UserRepositoryInterface extends BaseInterfaceRepository<UserEntity> {
  paginateGroup(userOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>>;
  deleteUser(userId: number): Promise<boolean>;
  findOneUserById(id: number): Promise<UserEntity>;
  findOneUserByEmail(email: string): Promise<UserEntity | null>;
  updatePassword(password: string, email: string): Promise<boolean>;
  createUser(userCreateDto: CreateUserDto): Promise<UserEntity>;
  updateUser(user: UpdateUserDto, userId: number): Promise<boolean>;
  blockUser(userId: number, isBlock: boolean): Promise<boolean>;
  checkRoleUser(user: UserEntity): Promise<RolesEntity | null>;
  getAllUsers(): Promise<UserEntity[]>;
}

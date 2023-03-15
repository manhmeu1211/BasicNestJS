import { UsersPageOptionsDto } from '../dto/response/users-page-options.dto';
import type { UserDto } from '../dto/response/user-dto';
import { PageDto } from '../../../common/dto/page.dto';
import { CreateUserDto } from '../dto/request/createUser-dto';
import { UpdateUserDto } from '../dto/request/update-user-dto';
import UserEntity from '../../../entities/user.entity';

export interface IUserServiceInterface {
  getCurrentUser(): Promise<any>;
  getUsers(userOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>>;
  deleteUser(userId: number): Promise<boolean>;
  findOneUserById(id: number): Promise<UserDto>;
  findOneUserByEmail(email: string): Promise<UserEntity | null>;
  updatePassword(password: string, email: string): Promise<boolean>;
  createUser(user: CreateUserDto): Promise<UserDto>;
  updateUser(user: UpdateUserDto, userId: number, isSendMail?: boolean): Promise<boolean>;
  blockUser(userId: number, isBlock: boolean): Promise<boolean>;
  getAllUsers(): Promise<UserDto[]>;
}

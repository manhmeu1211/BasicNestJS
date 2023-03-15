import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import type { UserDto } from './dto/response/user-dto';
import { UserRepositoryInterface } from './interface/user.repository.interface';
import type { IUserServiceInterface } from './interface/user.service.interface';
import { UtilsProvider } from '../../providers/utils.provider';
import { UsersPageOptionsDto } from './dto/response/users-page-options.dto';
import { PageDto } from '../../common/dto/page.dto';
import { CreateUserDto } from './dto/request/createUser-dto';
import { UserOfficeRepository } from '../../repositories/useroffice.repository';
import { CustomError } from '../../exceptions/custom-error.exception';
import { UpdateUserDto } from './dto/request/update-user-dto';
import { isEmpty, isNil } from 'lodash';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { MailService } from '../../shared/services/mail/mail.service';
import { ContextProvider } from '../../providers/context.provider';
import UserEntity from '../../entities/user.entity';

@Injectable()
export class UserService implements IUserServiceInterface {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,

    @Inject('IUserOfficeRepository')
    public readonly userOfficeRepository: UserOfficeRepository,
    private readonly mailService: MailService,

    @Inject(Sequelize.name)
    public readonly sequelize: Sequelize,
  ) {}

  async validateUser(userId: number): Promise<void> {
    const user = await this.findOneUserById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }
  }

  getCurrentUser(): any {
    const currentUser = ContextProvider.getAuthUser();
    return currentUser;
  }

  async getUsers(userOptionsDto: UsersPageOptionsDto): Promise<PageDto<UserDto>> {
    const results = await this.userRepository.paginateGroup(userOptionsDto);
    return new PageDto(results.data, results.meta);
  }

  async getAllUsers(): Promise<UserDto[]> {
    const results = await this.userRepository.getAllUsers();
    return results.toDtos();
  }

  async deleteUser(userId: number): Promise<boolean> {
    await this.validateUser(userId);
    const isDeleted = await this.userRepository.deleteUser(userId);
    return isDeleted;
  }

  async blockUser(userId: number, isBlock: boolean): Promise<boolean> {
    const isBlocked = await this.userRepository.blockUser(userId, isBlock);
    return isBlocked;
  }

  async createUser(user: CreateUserDto): Promise<UserDto> {
    const userExits = await this.userRepository.findOneUserByEmail(user.email);
    if (isNil(userExits)) {
      const createdUser = await this.userRepository.createUser(user);
      const userIds: number[] = [];
      userIds.push(createdUser.id);
      if (!isEmpty(user.officeIds) && user.officeIds) {
        await this.userOfficeRepository.addUsersToOffice(createdUser.id, user.officeIds, 5);
      } else {
        await this.userOfficeRepository.addUsersToOffice(createdUser.id, [], 5);
      }
      await this.mailService.sendVerifyFirsLogin(createdUser);
      return createdUser.toDto();
    }
    throw new CustomError('error.user_exits');
  }

  async updateUser(user: UpdateUserDto, userId: number, isSendMail?: boolean): Promise<boolean> {
    const userExits = await this.userRepository.findOneUserById(userId);
    const userWithNewEmail = await this.userRepository.findOneUserByEmail(user.email);

    if (userWithNewEmail && userWithNewEmail.id !== userExits.id) {
      throw new CustomError('error.email_exits');
    }

    if (userExits) {
      const isUpdated = await this.userRepository.updateUser(user, userId);
      await this.userOfficeRepository.updateUsersToOffice(userId, user.officeIds, 5);
      const userSendMail = await this.userRepository.findOneUserById(userExits.id);
      if (isUpdated && !isNil(isSendMail) && isSendMail) {
        await this.mailService.sendToNewEmail(userSendMail);
      }
      return isUpdated;
    }
    throw new CustomError('error.user_not_exits');
  }

  async findOneUserById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOneUserById(id);
    if (user === null) {
      throw new UserNotFoundException();
    }
    return user.toDto();
  }

  async findOneUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOneUserByEmail(email);
    return user;
  }

  async createUserFromSSO(email: string, name: string, code: string, loginType: string): Promise<UserDto> {
    const user = await this.userRepository.createUserFromSSO(email, name, code, loginType);
    return user.toDto();
  }

  async updatePassword(password: string, email: string): Promise<boolean> {
    const passHash = UtilsProvider.generateHash(password);
    const isUpdated = await this.userRepository.updatePassword(passHash, email);
    return isUpdated;
  }
}

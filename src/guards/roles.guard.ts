import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import UserEntity from '../entities/user.entity';
import _ from 'lodash';
import { UserRepositoryInterface } from '../modules/user/interface/user.repository.interface';
import { ContextProvider } from '../providers/context.provider';

// import type { UserEntity } from '../modules/user/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (_.isEmpty(roles)) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;
    const role = await this.userRepository.checkRoleUser(user);
    ContextProvider.setAuthUser(user);
    return roles.includes(`${role?.type}`);
  }
}

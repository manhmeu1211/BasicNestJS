import { CallHandler, ExecutionContext, NestInterceptor, Injectable } from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import { ContextProvider } from '../providers/context.provider';

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest();
    const user = <UserEntity>request.user;
    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}

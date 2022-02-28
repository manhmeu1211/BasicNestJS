import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

//Define Guards
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        //Handle logic
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user; // it's undefined
        const hasRole = () =>
          user.roles.some(role => !!roles.find(item => item === role));
        return user && user.roles && hasRole();
    }
}
//Define metadata roles
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
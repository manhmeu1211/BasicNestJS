import { Controller, Get, HttpException, HttpStatus, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Users } from './interfaces/user.interface';
import { Roles, RoleGuard } from './guards/user.guards';
import { UserInterceptor } from './interceptor/user.interceptor';

//Binding Guard, Interceptor for this controller
@Controller('users')
@UseGuards(RoleGuard)
@UseInterceptors(UserInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}
}
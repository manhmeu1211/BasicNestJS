import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserLoginDTO } from './dto/login-user.dto';
import { UsersService } from './users.service';
import { User, Users } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  //Handle get request from client
  @Get()
  async findAll(): Promise<Users> {
    //Use user service to findALL user
    return this.usersService.findAll();
  }
}
import { Controller, Get, HttpException, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Users } from './interfaces/user.interface';
import { Roles, RoleGuard } from './user.guards';

//Binding Guard
@Controller('users')
@UseGuards(RoleGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  //Setting roles per handler
  @Get(':id')
  @Roles('admin')
  async findOne(@Param() params): Promise<User>  {
    let id = params.id
    let user = this.usersService.findOne(id);
    if (!user) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return user;
  }

  //Handle get request from client
  @Get()
  async findAll(): Promise<Users> {
    //Use user service to findALL user
    let users = this.usersService.findAll()
    if (users === []) {
        // Throw exception
         throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
         //With custom message
        //  throw new HttpException({
        //     status: HttpStatus.FORBIDDEN,
        //     error: 'List user is empty',
        //   }, HttpStatus.FORBIDDEN);
    }
    return this.usersService.findAll();
  }
}
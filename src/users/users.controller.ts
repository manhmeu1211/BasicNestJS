import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Users } from './interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

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
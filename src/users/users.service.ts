import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/common/constants';
import { Users } from 'src/model/user.entity';
import { UserDto } from './dto/user.dto';

//Providers 
@Injectable()
export class UsersService {
  // Logic for user data
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof Users) { }

  async findOneByAuth(username: string, password: string): Promise<Users> {
    return await this.userRepository.findOne<Users>(
      {
        attributes: ['id', 'name', 'address', 'birthday', 'company_id', 'role'],
        where: { username, password }
      }
      );
  }

  async findOneById(id: number): Promise<Users> {
    return await this.userRepository.findOne<Users>({ where: { id } });
  }
  
}
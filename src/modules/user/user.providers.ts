import { JwtStrategy } from '../../modules/auth/jwt.strategy';
import UserEntity from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UserService } from './user.service';
import { UserOfficeRepository } from '../../repositories/useroffice.repository';
import UserOfficeEntity from '../../entities/useroffice.entity';
import RolesEntity from '../../entities/role.entity';
import OfficeEntity from '../../entities/office.entity';

export const userProviders = [
  {
    provide: 'UserRepositoryInterface',
    useClass: UserRepository,
  },
  {
    provide: 'IUserOfficeRepository',
    useClass: UserOfficeRepository,
  },
  {
    provide: 'UserServiceInterface',
    useClass: UserService,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
  {
    provide: UserOfficeEntity.name,
    useValue: UserOfficeEntity,
  },
  {
    provide: RolesEntity.name,
    useValue: RolesEntity,
  },
  {
    provide: 'JwtStrategy',
    useClass: JwtStrategy,
  },
  {
    provide: OfficeEntity.name,
    useValue: OfficeEntity,
  },
];

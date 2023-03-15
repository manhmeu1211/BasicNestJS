import { JwtStrategy } from '../../modules/auth/jwt.strategy';
import UserEntity from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UserOfficeRepository } from '../../repositories/useroffice.repository';
import UserOfficeEntity from '../../entities/useroffice.entity';
import { RoleService } from './role.service';
import { UserService } from '../../modules/user/user.service';
import { RoleRepository } from '../../repositories/roles.repository';
import RolesEntity from '../../entities/role.entity';
import OfficeEntity from '../../entities/office.entity';

export const roleProviders = [
  {
    provide: 'UserRepositoryInterface',
    useClass: UserRepository,
  },
  {
    provide: 'IUserOfficeRepository',
    useClass: UserOfficeRepository,
  },
  {
    provide: RoleRepository.name,
    useClass: RoleRepository,
  },
  {
    provide: 'RoleServiceInterface',
    useClass: RoleService,
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

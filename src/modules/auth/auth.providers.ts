import { UserRepository } from '../../repositories/user.repository';
import { UserService } from '../../modules/user/user.service';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Saml2Strategy } from './saml2.strategy';
import UserEntity from '../../entities/user.entity';
import { MailService } from '../../shared/services/mail/mail.service';
import UserOfficeEntity from '../../entities/useroffice.entity';
import { UserOfficeRepository } from '../../repositories/useroffice.repository';
import { ApiConfigService } from '../../shared/services/api-config.service';
import RolesEntity from '../../entities/role.entity';
import { OfficeService } from '../../modules/office/office.service';
import { OfficeRepository } from '../../repositories/offices.repository';
import OfficeEntity from '../../entities/office.entity';

export const authProviders = [
  {
    provide: 'AuthServiceInterface',
    useClass: AuthService,
  },
  {
    provide: MailService.name,
    useClass: MailService,
  },
  {
    provide: ApiConfigService.name,
    useClass: ApiConfigService,
  },
  {
    provide: RolesEntity.name,
    useValue: RolesEntity,
  },
  {
    provide: 'Saml2Strategy',
    useClass: Saml2Strategy,
  },
  {
    provide: 'JwtStrategy',
    useClass: JwtStrategy,
  },
  {
    provide: 'UserServiceInterface',
    useClass: UserService,
  },
  {
    provide: 'UserRepositoryInterface',
    useClass: UserRepository,
  },
  {
    provide: 'OfficeServiceInterface',
    useClass: OfficeService,
  },
  {
    provide: 'OfficeRepositoryInterface',
    useClass: OfficeRepository,
  },
  {
    provide: OfficeEntity.name,
    useValue: OfficeEntity,
  },
  {
    provide: UserOfficeEntity.name,
    useValue: UserOfficeEntity,
  },
  {
    provide: 'IUserOfficeRepository',
    useClass: UserOfficeRepository,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
];

import { HttpModule } from '@nestjs/axios';
import { CacheModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services/mail/mail.service';
// import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ApiConfigService } from './services/api-config.service';
// import { AwsS3Service } from './services/aws-s3.service';
import { GeneratorService } from './services/generator.service';
import { SSOService } from './services/sso-service';
import { TranslationService } from './services/translation.service';
import { ValidatorService } from './services/validator.service';
import MasterPostalCodesEntity from '../entities/masterpostalcode.entity';
import { MasterDataService } from './services/masterdata/master-data.service';
import { MasterPostalCodeRepository } from '../repositories/masterpostalCode.repository';
import { UserRepository } from '../repositories/user.repository';
import UserEntity from '../entities/user.entity';
import { UserService } from '../modules/user/user.service';
import { UserOfficeRepository } from '../repositories/useroffice.repository';
import { Sequelize } from 'sequelize-typescript';
import UserOfficeEntity from '../entities/useroffice.entity';
import RolesEntity from '../entities/role.entity';
import OfficeEntity from '../entities/office.entity';

const providers = [
  ApiConfigService,
  ValidatorService,
  //   AwsS3Service,
  GeneratorService,
  SSOService,
  MailService,
  TranslationService,
  MasterDataService,
  {
    provide: MasterPostalCodesEntity.name,
    useValue: MasterPostalCodesEntity,
  },
  {
    provide: MasterPostalCodeRepository.name,
    useClass: MasterPostalCodeRepository,
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
    provide: 'IUserOfficeRepository',
    useClass: UserOfficeRepository,
  },
  {
    provide: UserEntity.name,
    useValue: UserEntity,
  },
  {
    provide: Sequelize.name,
    useValue: Sequelize,
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
    provide: OfficeEntity.name,
    useValue: OfficeEntity,
  },
  // {
  //   provide: 'NATS_SERVICE',
  //   useFactory: (configService: ApiConfigService) => {
  //     const natsConfig = configService.natsConfig;
  //     return ClientProxyFactory.create({
  //       transport: Transport.NATS,
  //       options: {
  //         name: 'NATS_SERVICE',
  //         url: `nats://${natsConfig.host}:${natsConfig.port}`,
  //       },
  //     });
  //   },
  //   inject: [ApiConfigService],
  // },
];

@Global()
@Module({
  providers,
  imports: [
    HttpModule,
    ConfigModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ApiConfigService) => configService.cacheModuleConfig,
      inject: [ApiConfigService],
    }),
  ],
  exports: [...providers, HttpModule],
})
export class SharedModule {}

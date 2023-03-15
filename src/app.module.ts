import './boilerplate.polyfill';

import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import path from 'path';

import { DatabaseModule } from './database/database.module';
import { contextMiddleware } from './middlewares';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { ExistsValidator } from './validators/exists.validator';
import { UniqueValidator } from './validators/unique.validator';
import { AuthModule } from './modules/auth/auth.module';
import { OfficeModule } from './modules/office/office.module';
import { PaymentModule } from './modules/payment/payment.module';
import { RoleModule } from './modules/role/role.module';
import { MasterDataModule } from './modules/masterdata/masterdata.module';

@Module({
  imports: [
    DatabaseModule,
    OfficeModule,
    UserModule,
    AuthModule,
    RoleModule,
    PaymentModule,
    MasterDataModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      imports: [SharedModule],
      parser: I18nJsonParser,
      inject: [ApiConfigService],
    }),
  ],
  providers: [UniqueValidator, ExistsValidator],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
    consumer.apply(contextMiddleware).forRoutes('*');
  }
}

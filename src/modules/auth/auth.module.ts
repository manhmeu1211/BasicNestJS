import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../../modules/user/user.module';

import { DatabaseModule } from '../../database/database.module';
import { AuthController } from './auth.controller';
import { authProviders } from './auth.providers';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../../shared/services/mail/mail.module';

@Module({
  imports: [
    DatabaseModule,
    MailModule,
    forwardRef(() => UserModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.authConfig.jwtSecret,
      }),
      inject: [ApiConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [...authProviders],
})
export class AuthModule {}

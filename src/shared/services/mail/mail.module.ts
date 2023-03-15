import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ApiConfigService } from '../api-config.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (configService: ApiConfigService) => ({
        transport: {
          host: configService.getString('MAIL_HOST'),
          secure: false,
          auth: {
            user: configService.getString('MAIL_USER'),
            pass: configService.getString('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No_Reply" <${configService.getString('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, '../../../templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

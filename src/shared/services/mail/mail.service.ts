import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../api-config.service';
import type UserEntity from '../../../entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, public readonly configService: ApiConfigService) {}

  async sendUserForgotPass(user: UserEntity): Promise<void> {
    await this.mailerService.sendMail(this.configService.verifyUrl(user.toDto()));
  }

  async sendToNewEmail(user: UserEntity): Promise<void> {
    await this.mailerService.sendMail(this.configService.sendToNewEmail(user.toDto()));
  }

  async sendVerifyFirsLogin(user: UserEntity): Promise<void> {
    await this.mailerService.sendMail(this.configService.verifyFirstLogin(user.toDto()));
  }
}

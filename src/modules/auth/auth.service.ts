import { Inject, Injectable } from '@nestjs/common';
import UserEntity from '../../entities/user.entity';
import _, { isNil } from 'lodash';
import { UserDto } from '../../modules/user/dto/response/user-dto';
import { Sequelize } from 'sequelize-typescript';
import { UserLoginDto } from './dto/request/UserLoginDto';
import { TokenPayloadDto } from './dto/response/TokenPayloadDto';
import { IAuthServiceInterface } from './interfaces/auth.service.interface';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../modules/user/user.service';
import { UtilsProvider } from '../../providers/utils.provider';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { UserChangePassDto } from './dto/request/UserChangePassDto';
import * as xml2js from 'xml2js';
import decoder from 'saml-encoder-decoder-js';
import { MailService } from '../../shared/services/mail/mail.service';
import { LoginErrorException } from '../../exceptions/login-error.exception';
import { UserBlockedException } from '../../exceptions/user-blocked.exception';

@Injectable()
export class AuthService implements IAuthServiceInterface {
  constructor(
    public readonly jwtService: JwtService,
    public readonly configService: ApiConfigService,
    @Inject(Sequelize.name)
    public readonly sequelize: Sequelize,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,
    @Inject('MailService')
    private readonly mailService: MailService,
  ) {}

  async validateUser(userLoginDto: UserLoginDto): Promise<UserDto> {
    const user = await this.userService.findOneUserByEmail(userLoginDto.email);
    const isPasswordValid = await UtilsProvider.validateHash(userLoginDto.password, user?.password);
    if (isNil(user)) {
      throw new UserNotFoundException();
    }

    if (!isPasswordValid) {
      throw new LoginErrorException();
    }

    if (!isNil(user) && user.isBlock) {
      throw new UserBlockedException();
    }

    return user.toDto();
  }

  async validateSSOUser(email: string): Promise<UserDto> {
    const user = await this.userService.findOneUserByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user.toDto();
  }

  async createToken(user: UserEntity | UserDto): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({ user }),
    });
  }

  async parseSAMLRes(samlResponse: string): Promise<string> {
    let email = '';
    await decoder.decodeSamlPost(samlResponse, (err, xmlResponse: string) => {
      if (!err) {
        xml2js.parseString(
          xmlResponse,
          { tagNameProcessors: [xml2js.processors.stripPrefix], attrNameProcessors: [xml2js.processors.stripPrefix] },
          function (err, result) {
            if (!err) {
              const attr = result.Response.Assertion[0].AttributeStatement[0].Attribute;
              attr.map((e) => {
                if (e.$.Name === 'email') {
                  email = <string>_.first(e.AttributeValue);
                }
              });
            }
          },
        );
      }
    });
    return email;
  }

  async sendMailVerify(email: string): Promise<boolean> {
    const user = await this.userService.findOneUserByEmail(email);
    if (isNil(user)) {
      throw new UserNotFoundException();
    }
    if (!isNil(user) && user.isBlock) {
      throw new UserBlockedException();
    }
    await this.mailService.sendUserForgotPass(user);
    return true;
  }

  async updatePassword(user: UserChangePassDto): Promise<boolean> {
    const isUpdated = await this.userService.updatePassword(user.password, user.email);
    return isUpdated;
  }
}

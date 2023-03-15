import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IAuthServiceInterface } from './interfaces/auth.service.interface';
import { LoginPayloadDto } from './dto/response/LoginPayloadDto';
import { UserLoginDto } from './dto/request/UserLoginDto';
import passport from 'passport';
import { AuthGuard } from '@nestjs/passport';
import { UserChangePassDto } from './dto/request/UserChangePassDto';
import { UpdatePassPayloadDto } from './dto/response/UpdatePassPayloadDto';
import { UserForgotPassDto } from './dto/request/UserForgotPassDto';
import { ResetPassDto } from './dto/response/ResetPassDto';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { ViewAuthFilter } from '../../filters/unauth.filter';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AuthServiceInterface')
    private readonly authService: IAuthServiceInterface,

    @Inject(ApiConfigService.name)
    private readonly configService: ApiConfigService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  @UseInterceptors(AuthUserInterceptor)
  async userLogin(@Body() userLoginDto: UserLoginDto): Promise<LoginPayloadDto> {
    const user = await this.authService.validateUser(userLoginDto);
    const token = await this.authService.createToken(user);
    return new LoginPayloadDto(user, token);
  }

  @Get('/login/sso')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('saml'))
  async getLoginSSO(): Promise<void> {
    await passport.authenticate('saml', {
      failureRedirect: `${this.configService.getString('SAML_Redirect_NonAuth')}`,
      failureFlash: true,
    });
  }

  @Post('/login/sso')
  @UseGuards(AuthGuard('saml'))
  @UseFilters(ViewAuthFilter)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async loginSSO(@Req() req, @Body() body: any, @Res() res): Promise<LoginPayloadDto> {
    let email = '';
    if (!req.isAuthenticated()) {
      req.redirect(this.configService.getString('SAML_Redirect_NonAuth'));
    } else {
      email = await this.authService.parseSAMLRes(body.SAMLResponse);
    }
    const user = await this.authService.validateSSOUser(email);
    const token = await this.authService.createToken(user);
    res.redirect(this.configService.getString('SAML_Redirect') + '?token=' + token.accessToken);
    return new LoginPayloadDto(user, token);
  }

  @Post('/forgotPass')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdatePassPayloadDto,
  })
  async sendLinkVerify(@Body() userForgotPass: UserForgotPassDto): Promise<UpdatePassPayloadDto> {
    const isSuccess = await this.authService.sendMailVerify(userForgotPass.email);
    return new UpdatePassPayloadDto(isSuccess);
  }

  @Get('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResetPassDto,
  })
  resetPass(@Query() query: any): ResetPassDto {
    return new ResetPassDto(query.email);
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: UpdatePassPayloadDto,
  })
  async updatePassword(@Body() userChangePassDto: UserChangePassDto): Promise<UpdatePassPayloadDto> {
    const isSuccess = await this.authService.updatePassword(userChangePassDto);
    return new UpdatePassPayloadDto(isSuccess);
  }
}

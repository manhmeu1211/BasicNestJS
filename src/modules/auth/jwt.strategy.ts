import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserService } from '../../modules/user/user.service';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserDto } from '../../modules/user/dto/response/user-dto';
import { isNil } from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public readonly configService: ApiConfigService,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.jwtSecret,
    });
  }
  async validate(response: { user: UserDto }): Promise<UserDto> {
    // check if user in the token actually exist
    const user = await this.userService.findOneUserById(response.user.id);
    if (isNil(user) || user.isBlock) {
      //exception filter
      throw new UnauthorizedException();
    }
    return user;
  }
}

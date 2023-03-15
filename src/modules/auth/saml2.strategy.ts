import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as SamlStrategy from 'passport-saml';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserDto } from '../../modules/user/dto/response/user-dto';
import { IUserServiceInterface } from '../../modules/user/interface/user.service.interface';
import { HttpService } from '@nestjs/axios';
import { first, isNil } from 'lodash';
import { UserOfficeRepository } from '../../repositories/useroffice.repository';
import { LoginType } from '../../common/constants/login.type';
import { OfficeRepositoryInterface } from '../../modules/office/interfaces/office.repository.interfaces';
import { SSOService } from '../../shared/services/sso-service';

@Injectable()
export class Saml2Strategy extends PassportStrategy(SamlStrategy.Strategy, 'saml') {
  constructor(
    configService: ApiConfigService,
    @Inject('IUserOfficeRepository')
    public readonly userOfficeRepository: UserOfficeRepository,
    @Inject('UserServiceInterface')
    private readonly userService: IUserServiceInterface,
    @Inject('OfficeRepositoryInterface')
    private readonly officeRepository: OfficeRepositoryInterface,
    private httpService: HttpService,
    private apiConfigService: ApiConfigService,
    private readonly ssoService: SSOService,
  ) {
    super(configService.ssoConfig);
  }

  async validate(response: { attributes: { email: string; name: string; code: string } }): Promise<UserDto | null> {
    const token = await this.ssoService.getTokenSSO();
    const headersRequest = {
      headers: {
        token,
      },
    };
    const userFromSSO = await this.httpService
      .get(this.apiConfigService.urlDetailEmployee(response.attributes.code), headersRequest)
      .toPromise()
      .then((response) => response?.data.data)
      .catch(() => null);

    const officeIds: number[] = [];

    const user = await this.userService.findOneUserByEmail(userFromSSO.email);

    if (!isNil(userFromSSO)) {
      await Promise.all(
        userFromSSO.departments.map(async (department: any) => {
          if (department.level_type === 1) {
            const officeMatch = await this.officeRepository.findOneOfficeByCode(department.hiiragi_code);
            if (!isNil(officeMatch)) {
              officeIds.push(officeMatch.id);
            } else {
              const roleId = first(user?.userOffices)?.roleId;
              if (roleId !== 2) {
                throw new UnauthorizedException();
              }
            }
          }
        }),
      );
    }

    if (isNil(user)) {
      const newUser = await this.userService.createUserFromSSO(
        userFromSSO.email,
        userFromSSO.name,
        userFromSSO.code,
        LoginType.SSO,
      );
      await this.userOfficeRepository.addUsersToOffice(newUser.id, officeIds, 4);
      return newUser;
    } else {
      return user.toDto();
    }
  }
}

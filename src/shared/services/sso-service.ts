import { Inject, Injectable } from '@nestjs/common';
import { ApiConfigService } from './api-config.service';
import { HttpService } from '@nestjs/axios';
import { EmployeeSSORequestDto } from '../../modules/role/dto/request/employees-dto';
import { UserSSODto } from '../../modules/role/dto/response/user-role-dto';
import { first } from 'lodash';
import { UserService } from '../../modules/user/user.service';

@Injectable()
export class SSOService {
  constructor(
    private readonly apiConfigService: ApiConfigService,
    private httpService: HttpService,
    @Inject('UserServiceInterface')
    private readonly userService: UserService,
  ) {}

  async getTokenSSO(): Promise<any> {
    const body = {
      app_id: this.apiConfigService.getString('ORS_APPID'),
      app_secret: this.apiConfigService.getString('ORS_APPSECRET'),
    };
    return await this.httpService
      .post(this.apiConfigService.urlAuthORS(), body)
      .toPromise()
      .then((response) => response?.data.data.token);
  }
  async getListUserFromSSO(request: EmployeeSSORequestDto): Promise<UserSSODto[]> {
    const token = await this.getTokenSSO();
    let params = {};

    switch (request.role_id) {
      case 2:
        params = {
          page_size: request.page_size,
          page: request.page,
          name: request.name,
          department_codes: ['07101030', '07505010', '10701010'],
        };
        break;
      default:
        params = {
          page_size: request.page_size,
          page: request.page,
          name: request.name,
          department_layer_code: '1070',
        };
        break;
    }
    const headersRequest = {
      headers: {
        token,
      },
      params,
    };

    const listUser = await this.httpService
      .get(this.apiConfigService.urlgetEmployees(), headersRequest)
      .toPromise()
      .then((response) => response?.data.data)
      .catch(() => null);

    const users: UserSSODto[] = [];

    await Promise.all(
      listUser.map(async (userSSO) => {
        await Promise.all(
          userSSO.departments.map(async (e) => {
            if (e.level_type === 1) {
              const user = new UserSSODto(userSSO.name, userSSO.code, userSSO.email, e.hiiragi_code);
              const userRole = await this.userService.findOneUserByEmail(user.email);
              const roleId = first(userRole?.userOffices)?.roleId;
              switch (request.role_id) {
                case 2:
                  users.push(user);
                  break;
                default:
                  if (roleId !== 2) {
                    users.push(user);
                  }
                  break;
              }
            }
          }),
        );
      }),
    );
    return users;
  }
}

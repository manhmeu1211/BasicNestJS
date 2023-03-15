import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  UseGuards,
  Body,
  Put,
  Get,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleServiceInterface } from './interfaces/role.service.interface';
import { UserRoleRequestDto } from './dto/request/user-role-request-dto';
import { UserOfficeDto } from '../../modules/office/dto/response/useroffice-dto';
import { UserRoles } from './dto/request/set-role-dto';
import { RoleDto } from './dto/response/roles.dto';
import { UserRolesDto } from '../../modules/user/dto/response/user-roles-dto';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { RoleRequestDto } from './dto/request/role-request-dto';
import { SSOService } from '../../shared/services/sso-service';
import { EmployeeSSORequestDto } from './dto/request/employees-dto';
import { UserSSODto } from './dto/response/user-role-dto';

@ApiTags('roles')
@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RoleController {
  constructor(
    @Inject('RoleServiceInterface')
    private readonly roleService: RoleServiceInterface,
    private readonly ssoService: SSOService,
  ) {}

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserSSODto })
  async getAllEmployeesSSO(
    @Query(new ValidationPipe({ transform: true }))
    employeeRequest: EmployeeSSORequestDto,
  ): Promise<UserSSODto[]> {
    return await this.ssoService.getListUserFromSSO(employeeRequest);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RoleDto })
  async getAllRoleByOffice(
    @Query(new ValidationPipe({ transform: true }))
    roleRequest: RoleRequestDto,
  ): Promise<UserRolesDto> {
    const roles = await this.roleService.getAllRoleByOffice(roleRequest);
    return roles;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserOfficeDto })
  async setRoleUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() userRole: UserRoleRequestDto,
  ): Promise<SuccessResponseDto> {
    await this.roleService.deleteRoleUser(userRole.roleId, userId);
    return new SuccessResponseDto(true);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto })
  async setRoleUsers(@Body() userRole: UserRoles): Promise<SuccessResponseDto> {
    await this.roleService.updateRoleUsers(userRole);
    return new SuccessResponseDto(true);
  }
}

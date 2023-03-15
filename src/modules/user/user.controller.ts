import {
  Controller,
  Delete,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
  Body,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/response/user-dto';
import { IUserServiceInterface } from './interface/user.service.interface';
import { PageDto } from '../../common/dto/page.dto';
import { ApiPageOkResponse } from '../../decorators/api-page-ok-response.decorator';
import { SuccessResponseDto } from '../../common/dto/success.response.dto';
import { CreateUserDto } from './dto/request/createUser-dto';
import { UsersPageOptionsDto } from './dto/response/users-page-options.dto';
import { UpdateUserDto } from './dto/request/update-user-dto';
import { BlockUserDto } from './dto/request/block-dto';
import { UserNotFoundException } from '../../exceptions/user-not-found.exception';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptor.service';
import { SendMailDto } from './dto/request/sendmail-dto';

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    @Inject('UserServiceInterface')
    private readonly userService: IUserServiceInterface,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse(UserDto)
  async getListUsers(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: UsersPageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    const result = await this.userService.getUsers(pageOptionsDto);
    return result;
  }

  @Get('/me')
  @UseInterceptors(AuthUserInterceptor)
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  getCurrentUserInfor(): unknown {
    return this.userService.getCurrentUser();
  }

  @Get('/all')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  getAllUsers(): unknown {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiPageOkResponse(UserDto)
  async getUser(@Param('id', ParseIntPipe) userId: number): Promise<UserDto> {
    const result = await this.userService.findOneUserById(userId);
    if (result) {
      return result;
    }
    throw new UserNotFoundException();
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto })
  async deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<SuccessResponseDto> {
    const isSuccess = await this.userService.deleteUser(userId);
    return new SuccessResponseDto(isSuccess);
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserDto })
  async createUser(@Body() user: CreateUserDto): Promise<UserDto> {
    const createdUser = await this.userService.createUser(user);
    return createdUser;
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto })
  async updateUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDto,
    @Query(new ValidationPipe({ transform: true }))
    sendMailDto: SendMailDto,
  ): Promise<SuccessResponseDto> {
    const isUpdated = await this.userService.updateUser(user, userId, sendMailDto.isSendMail);
    return new SuccessResponseDto(isUpdated);
  }

  @Put('block/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SuccessResponseDto })
  async blockUser(
    @Param('id', ParseIntPipe) userId: number,
    @Body() blockUserDto: BlockUserDto,
  ): Promise<SuccessResponseDto> {
    const isUpdated = await this.userService.blockUser(userId, blockUserDto.isBlock);
    return new SuccessResponseDto(isUpdated);
  }
}

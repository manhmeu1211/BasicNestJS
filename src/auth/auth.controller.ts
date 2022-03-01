import { Controller, Body, Post, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';

@Controller('auth')
@UseInterceptors(AuthInterceptor)
export class AuthController {
    constructor(private authService: AuthService) {}
    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return await this.authService.login(req.user);
    }
}
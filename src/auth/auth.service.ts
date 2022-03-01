import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { md5 } from 'src/helpers/configuration';
import { Users } from 'src/model/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(username: string, pass: string) {
        // find if user exist with this username and password
        const user = await this.userService.findOneByAuth(username, md5(pass));
        if (!user) {
            return null;
        }

        // tslint:disable-next-line: no-string-literal
        const { password, ...result } = user['dataValues'];
        return result;
    }

    public async login(user: Users) {
        const expiresIn = 60 * 60 * 24;
        const accessToken = await this.generateToken(user);
        const refreshToken = await this.generateRefreshToken(user, expiresIn)
        return { user, accessToken, refreshToken };
    }

    private async generateToken(user: Users) {
        const token = await this.jwtService.signAsync(user, { secret: process.env.JWTKEY });
        return token;
    }

    public async generateRefreshToken(user: Users, expiresIn: number) {
        const refreshToken = await this.jwtService.signAsync(user, { expiresIn, secret: process.env.JWTKEY });
        return refreshToken
    }
}
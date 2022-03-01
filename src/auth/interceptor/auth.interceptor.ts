import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsersService } from 'src/users/users.service';

//Define Interceptor
@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(private usrService: UsersService) {}

  async validateUser() {
    // find if user exist with this username and password
    const usr = await this.usrService.findOneById(2)
   
    return usr;
}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      //Handle logic here
    console.log('Before...', this.validateUser());

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`, this.validateUser())),
      );
  }
}

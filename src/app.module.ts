import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import helmet from 'helmet';
import cors from "cors";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersMiddleware } from './users/middleware/user.middleware';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from './helpers/configuration';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception';
import { DatabaseModule } from './helpers/database/database.module';
import { AuthModule } from './auth/auth.module';

//Import module here
@Module({
  imports: [ConfigModule.forRoot(
    {
      load: [configuration],
    }
  ),
    DatabaseModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    //apply Exception filter for all API
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }],
})

export class AppModule {
  //Config Middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersMiddleware)
      .forRoutes(UsersController);
  }
}

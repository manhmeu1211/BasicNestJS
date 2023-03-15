import { Module } from '@nestjs/common';

import { DatabaseModule } from '../../database/database.module';
import { UserController } from './user.controller';
import { userProviders } from './user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...userProviders],
})
export class UserModule {}

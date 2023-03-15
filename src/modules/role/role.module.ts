import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { RoleController } from './role.controller';
import { roleProviders } from './role.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleController],
  providers: [...roleProviders],
})
export class RoleModule {}
